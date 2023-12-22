import { ContractDependency, SolcError } from "@/lib/interfaces";
import { solcVersion } from "@/lib/utils";
import { compilerVersions } from "@/lib/versions";
import { NextRequest, NextResponse } from "next/server"
var solc = require("solc");
import { ImportsFsEngine, parsers, resolvers } from "@resolver-engine/imports-fs";
import fs from "fs";
import path from "path";

export async function POST(request: NextRequest) {

    if (request.nextUrl.searchParams.get("version") &&
        !compilerVersions.includes(request.nextUrl.searchParams.get("version") || "")) {
        return NextResponseError("Invalid compiler version");
    }

    const compilerVersion: string = decodeURI(request.nextUrl.searchParams.get("version") || solcVersion);
    const solcSnapshot = await getSolcByVersion(compilerVersion);
    console.log("Using Solc Version", solcSnapshot.version())

    // const contractAddress: string = request.nextUrl.searchParams.get("version") || "";
    // if (contractAddress && !ethers.utils.isAddress(contractAddress)) {
    //     // https://api.etherscan.io/api?module=contract&action=getsourcecode&address=0xBB9bc244D798123fDe783fCc1C72d3Bb8C189413&apikey=YourApiKeyToken
    //     const response = await fetch(`https://api.etherscan.io/api?module=contract&action=getsourcecode&address=${contractAddress}&apikey=${process.env.ETHERSCAN_API_KEY}`)
    //     const data = await response.json();
    // }

    // From here we are compiling a contract
    const data: FormData = await request.formData();
    const contract = data.get("file") as File;

    let name: string = contract.name;
    const content: string = await contract.text();

    // Check if the content is a (Solidity Standard Json-Input format)
    const solidityInput: any = GetSolidityJsonInputFormat(content);
    if (solidityInput) {
        /**
         * Update the name of the contract to the first contract in the input
         * Note: We can use the etherscan api to get the contract name, but for now we will use query param for now
         */
        name = request.nextUrl.searchParams.get("title") || "";
        if (!name) {
            return NextResponseError("Missing Entry Title");
        }

        var output = JSON.parse(solcSnapshot.compile(JSON.stringify(solidityInput)));
        if (output.errors) {
            // For demo we don't care about warnings
            output.errors = output.errors.filter((error: SolcError) => error.type !== "Warning");
            if (output.errors.length > 0) {
                return NextResponseSolcError(output.errors);
            }
        }

        let dependencies: ContractDependency[] = [];
        Object.keys(solidityInput.sources).forEach((contractSource) => {
            dependencies.push({
                filePath: contractSource,
                fileContents: removeHeadersAndImports(solidityInput.sources[contractSource].content),
                originalContents: solidityInput.sources[contractSource].content
            })
        });

        const { flattenContract } = flattenContracts({ dependencies, });
        const compiled = await getEntryDetails(output, name);
        if (compiled) {
            return NextResponse.json({ data: compiled, flattenContract });
        }

        return NextResponseError("No contract found");
    }

    // Get all dependencies contracts (imports) and remove dups
    let dependencies: ContractDependency[] = [];
    try {
        dependencies = await extractImports(content)
        dependencies = removeDuplicatesPreserveOrder(dependencies)
    } catch (error: any) {
        return NextResponse.json({
            details: [generateError(error.message, "ImportError")]
        }, { status: 400, })
    }

    const { flattenContract, sources } = flattenContracts({
        dependencies,
        content,
        includeSource: true
    });

    var input = {
        language: "Solidity",
        sources: {
            ...sources,
            [name]: {
                content: content
            }
        },
        settings: {
            outputSelection: {
                "*": {
                    "*": ["*"]
                }
            }
        }
    };

    var output = JSON.parse(solcSnapshot.compile(JSON.stringify(input)));

    if (output.errors) {
        // For demo we don't care about warnings
        output.errors = output.errors.filter((error: SolcError) => error.type !== "Warning");
        if (output.errors.length > 0) {
            return NextResponseSolcError(output.errors);
        }
    }

    const compiled = await getEntryDetails(output, name);
    if (compiled) {
        return NextResponse.json({ data: compiled, flattenContract });
    }

    return NextResponseError("No contract found");
}

const NextResponseError = (...messages: string[]) => NextResponse.json({
    details: messages.map((msg) => generateError(msg))
}, { status: 400 });

const NextResponseSolcError = (...details: SolcError[]) => NextResponse.json({
    details: details
}, { status: 400 });

const flattenContracts = ({
    dependencies,
    content = "",
    includeSource = false,
}: {
    dependencies: ContractDependency[];
    content?: string;
    includeSource?: boolean;
}) => {
    let flattenContract: string = "";
    const sources: any = {};
    dependencies.reverse().forEach((dependency) => {
        const { filePath, originalContents, fileContents } = dependency;

        if (includeSource) {
            sources[filePath] = { content: originalContents };
        }

        const cleanedContent = removeHeadersAndImports(fileContents);
        flattenContract += cleanedContent;
    });

    if (content) {
        flattenContract = flattenContract.concat(removeHeadersAndImports(content))
    }

    return { flattenContract, sources };
}

async function getEntryDetails(output: any, entry: string) {
    return new Promise((resolve, reject) => {
        Object.keys(output.contracts).forEach((contractSource) => {
            if (contractSource === entry) {
                for (var contractName in output.contracts[entry]) {
                    resolve(output.contracts[contractSource][contractName]);
                }
            }
            Object.keys(output.contracts[contractSource]).forEach((contractName) => {
                if (contractName === entry) {
                    resolve(output.contracts[contractSource][entry]);
                }
            });
        });

        // If the entryContractName is not found, you might want to reject the promise
        reject(new Error('Entry contract not found'));
    });
}


interface Solc {
    version(): any;
    compile(input: string): any;
}
async function getSolcByVersion(solcVersion: string): Promise<Solc> {
    return new Promise((resolve, reject) => {
        solc.loadRemoteVersion(solcVersion, (err: any, solcInstance: Solc | Promise<any>) => {
            if (err) {
                reject(err);
            } else {
                resolve(solcInstance);
            }
        });
    });
}

const generateError = (message: string, type?: string): SolcError => {
    return {
        component: "custom",
        errorCode: "0",
        formattedMessage: message,
        message: "Internal error while compiling.",
        severity: "error",
        sourceLocation: [],
        type: type || "CustomError"
    }
}

async function resolve(importPath: any): Promise<ContractDependency> {
    // console.log(importPath)
    // const absoluteFilePath = path.join(process.cwd(), 'node_modules', importPath);
    // console.log(absoluteFilePath)
    // const resolver = ImportsFsEngine()
    // const filePath = await resolver.resolve(importPath);
    const filePath = path.resolve('./public', importPath);
    // console.log(filePath)
    const fileContents = fs.readFileSync(filePath).toString();
    return { fileContents, filePath };
}

/**
 * import can be import {ENSResolver as ENSResolver_Chainlink} from "./vendor/ENSResolver.sol";
 * In this case we need to replace all ENSResolver with ENSResolver_Chainlink for that file see
 * aliasList condition for implementation
 * @param content 
 * @param mainPath 
 * @returns 
 */
async function extractImports(content: any, mainPath: any = ""): Promise<ContractDependency[]> {
    // Regular expression to match import statements
    const regex = /import\s+{([^}]+)}\s+from\s+[""]([^""]+)[""]|import\s+[""]([^""]+)[""];/g;

    const matches: ContractDependency[] = [];
    let match;
    while ((match = regex.exec(content)) !== null) {
        const [, aliasList, filePathWithAlias, filePathWithoutAlias] = match;
        const filePath = getNormalizedDependencyPath(filePathWithAlias || filePathWithoutAlias, mainPath);
        const resolved = await resolve(filePath);
        // console.log(filePath)

        let codeContent = resolved.fileContents;
        if (aliasList) {
            const names: string[] = aliasList.split(",").map((name: string) => name.trim());
            names.forEach((name: string) => {
                const alias = name.split(" as ");
                if (alias.length === 2) {
                    // console.log(alias[0], alias[1])
                    codeContent = codeContent.replace(new RegExp(alias[0], "g"), alias[1]);
                }
            });
        }

        matches.push({ filePath, fileContents: codeContent, originalContents: resolved.fileContents });
        matches.push(...(await extractImports(resolved.fileContents, filePath)));
    }

    return matches;
}

function getDirPath(filePath: any) {
    let index1 = filePath.lastIndexOf(path.sep);
    let index2 = filePath.lastIndexOf("/");
    return filePath.substring(0, Math.max(index1, index2));
}

function getNormalizedDependencyPath(dependency: any, filePath: any) {
    if (dependency.startsWith("./") || dependency.startsWith("../")) {
        dependency = path.join(getDirPath(filePath), dependency);
        dependency = path.normalize(dependency);
    }

    return dependency.replace(/\\/g, "/");
}

function removeDuplicatesPreserveOrder(files: ContractDependency[]): ContractDependency[] {
    const seenPaths = new Set<string>();
    const result: ContractDependency[] = [];

    for (let i = files.length - 1; i >= 0; i--) {
        const file = files[i];
        if (!seenPaths.has(file.filePath)) {
            result.unshift(file); // Add to the beginning of the array
            seenPaths.add(file.filePath);
        }
    }

    return result;
}

const removeHeadersAndImports = (fileContents: any): string => {
    const regex = /\/\/ SPDX-License-Identifier:.*|import [^;]+;/g;
    return fileContents.replace(regex, "");
}

function GetSolidityJsonInputFormat(content: string) {
    content = content.slice(1, -1);
    try {
        const input = JSON.parse(content)
        return input
    } catch (error) {
        return undefined
    }
}