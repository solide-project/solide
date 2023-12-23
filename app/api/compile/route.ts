import { ContractDependency, SolcError } from "@/lib/interfaces";
import { getSolidityContract, solcVersion } from "@/lib/utils";
import { compilerVersions } from "@/lib/versions";
import { NextRequest, NextResponse } from "next/server"
var solc = require("solc");
import { ImportsFsEngine, parsers, resolvers } from "@resolver-engine/imports-fs";
import fs from "fs";
import path from "path";
import { ContractPaths } from "@/lib/solide/contract-paths";

export async function POST(request: NextRequest) {

    if (request.nextUrl.searchParams.get("version") &&
        !compilerVersions.includes(request.nextUrl.searchParams.get("version") || "")) {
        return NextResponseError("Invalid compiler version");
    }

    const compilerVersion: string = decodeURI(request.nextUrl.searchParams.get("version") || solcVersion);
    const solcSnapshot = await getSolcByVersion(compilerVersion);
    const viaIR: boolean = request.nextUrl.searchParams.get("viaIR") === "1" || false;
    const enabled: boolean = request.nextUrl.searchParams.get("optimizer") === "1" || false;
    const runs: number = parseInt(request.nextUrl.searchParams.get("optimizer") || "-1") || -1;

    let optimizer = {}
    if (enabled && runs > 0) {
        optimizer = {
            enabled,
            runs,
        };
    }

    console.log("Using Solc Version", solcSnapshot.version())
    console.log("Run using CLI", viaIR)
    console.log("Optimizer", optimizer)


    // const contractAddress: string = request.nextUrl.searchParams.get("version") || "";
    // if (contractAddress && !ethers.utils.isAddress(contractAddress)) {
    //     // https://api.etherscan.io/api?module=contract&action=getsourcecode&address=0xBB9bc244D798123fDe783fCc1C72d3Bb8C189413&apikey=YourApiKeyToken
    //     const response = await fetch(`https://api.etherscan.io/api?module=contract&action=getsourcecode&address=${contractAddress}&apikey=${process.env.ETHERSCAN_API_KEY}`)
    //     const data = await response.json();
    // }

    // From here we are compiling a contract
    const data: FormData = await request.formData();
    const contract = data.get("file") as File;

    const filePath: string = contract.name;
    let name = path.basename(filePath);
    // console.log(name);
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
                paths: new ContractPaths(contractSource, ""),
                fileContents: removeHeadersAndImports(solidityInput.sources[contractSource].content),
                originalContents: solidityInput.sources[contractSource].content,
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
        dependencies = await extractImports(content, filePath)
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

    const sourceName = filePath.replace(/https:\/\/raw.githubusercontent.com\/[a-zA-Z0-9\-]+\/[a-zA-Z0-9\-]+\/[a-zA-Z0-9\-]+\//, "");

    var input = {
        language: "Solidity",
        sources: {
            ...sources,
            [sourceName]: {
                content: content
            }
        },
        settings: {
            // remappings: [ ":g=/dir" ],
            outputSelection: {
                "*": {
                    "*": ["*"]
                }
            },
            viaIR: viaIR,
            optimizer: optimizer
        }
    };

    // console.log(Object.keys(input.sources))
    var output = JSON.parse(solcSnapshot.compile(JSON.stringify(input)));
    if (output.errors) {
        // For demo we don't care about warnings
        output.errors = output.errors.filter((error: SolcError) => error.type !== "Warning");
        if (output.errors.length > 0) {
            return NextResponseSolcError(...output.errors);
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


const normaliseSource = (originalPath: string) => {
    // replace .. with .
    originalPath = originalPath.replace(/(\.\.)/g, '.');
    originalPath = originalPath.replace(/\\/g, "/")
    return path.normalize(originalPath);
}

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
        const { paths, originalContents, fileContents } = dependency;

        if (includeSource) {
            if (paths.isHttp()) {
                // if (paths.filePath.includes("IAllowanceTransfer")) {
                //     // path.join(paths.folderPath)
                //     sources["interfaces/IAllowanceTransfer.sol"] = { content: originalContents };
                // }
                // if (paths.filePath.includes("IERC1271")) {
                //     // path.join(paths.folderPath)
                //     sources["interfaces/IERC1271.sol"] = { content: originalContents };
                // }

                // if (paths.originalFilePath.startsWith("./")) {
                //     const pathWithoutDot = path.normalize(paths.originalFilePath).replace(/\\/g, "/");
                //     console.log("Adding .", pathWithoutDot, paths.folderPath)
                //     sources[pathWithoutDot] = { content: originalContents };
                //     sources[paths.folderPath] = { content: originalContents };
                // } else if (paths.originalFilePath.startsWith("../")) {
                //     const compilePath = getNormalizedDependencyPath(paths.originalFilePath, paths.folderPath)
                //     console.log("Adding ..", compilePath.filePath)
                //     console.log(paths.originalFilePath, paths.folderPath)
                //     sources[compilePath.filePath] = { content: originalContents };
                // }
                sources[paths.folderPath] = { content: originalContents };
            } else {
                sources[paths.filePath] = { content: originalContents };
            }
        }

        const cleanedContent = removeHeadersAndImports(fileContents);
        flattenContract += cleanedContent;
    });

    if (content) {
        flattenContract = flattenContract.concat(removeHeadersAndImports(content))
    }

    return { flattenContract, sources };
}

function getFileNameWithoutExtension(filename: string) {
    return filename.replace(/\.[^/.]+$/, "");
}

async function getEntryDetails(output: any, entry: string) {
    entry = getFileNameWithoutExtension(entry);
    return new Promise((resolve, reject) => {
        Object.keys(output.contracts).forEach((contractSource) => {
            // console.log(contractSource, entry)
            if (contractSource === entry) {
                for (var contractName in output.contracts[entry]) {
                    resolve(output.contracts[contractSource][contractName]);
                }
            }
            Object.keys(output.contracts[contractSource]).forEach((contractName) => {
                // console.log(contractName, entry)
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

async function resolve(importPath: string, isRelative: boolean = false): Promise<any> {
    // console.log(importPath)
    // const absoluteFilePath = path.join(process.cwd(), 'node_modules', importPath);
    // console.log(absoluteFilePath)
    // const resolver = ImportsFsEngine()
    // const filePath = await resolver.resolve(importPath);
    if (importPath.startsWith("http")) {
        const fileContents = await getSolidityContract(importPath);
        return { fileContents };
    }
    const filePath = path.resolve('./public', importPath);
    // console.log(filePath)
    const fileContents = fs.readFileSync(filePath).toString();
    return { fileContents };
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
    // const regex = /import\s+{([^}]+)}\s+from\s+[""]([^""]+)[""]|import\s+[""]([^""]+)[""];/g;
    const regex = /import\s+{([^}]+)}\s+from\s+[""'']([^""'']+)[""'']|import\s+[""'']([^""'']+)[""''];/g;

    const matches: ContractDependency[] = [];
    let match;
    while ((match = regex.exec(content)) !== null) {
        const [, aliasList, filePathWithAlias, filePathWithoutAlias] = match;
        const contractPath = new ContractPaths(filePathWithAlias || filePathWithoutAlias, mainPath);
        // console.log(contractPath)
        const resolved = await resolve(contractPath.filePath, contractPath.isRelative);

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

        // console.log("compiled", contractPath.originalFilePath, contractPath.filePath, "from", mainPath)
        matches.push({
            paths: contractPath,
            fileContents: codeContent,
            originalContents: resolved.fileContents,
        });
        matches.push(...(await extractImports(resolved.fileContents, contractPath.filePath)));
    }

    return matches;
}

function getDirPath(filePath: any) {
    let index1 = filePath.lastIndexOf(path.sep);
    let index2 = filePath.lastIndexOf("/");
    return filePath.substring(0, Math.max(index1, index2));
}

/**
 * isRelative is true means that dependency path is relative to source (not in node_modules)
 * Note the isRelative will break (not work) if the dependency is in node_modules is using relative paths in import
 * Also note implementation will ruin the https:// as normalising // will result in /
 * @param dependency 
 * @param filePath 
 * @returns 
 */
function getNormalizedDependencyPath(dependency: string, filePath: string) {
    // We assume that if the dependency starts with ./ or ../ it is a relative path
    if (dependency.startsWith("./") || dependency.startsWith("../")) {
        if (filePath.startsWith("http://") || filePath.startsWith("https://")) {
            // remove the http:// or https://   
            const rawPath = filePath.substring(filePath.indexOf("//") + 2);
            dependency = path.join(getDirPath(rawPath), dependency);
            dependency = path.normalize(dependency);

            // Add back the http:// or https://
            dependency = filePath.substring(0, filePath.indexOf("//") + 2) + dependency;
            return { filePath: dependency.replace(/\\/g, "/"), isRelative: true };
        }

        dependency = path.join(getDirPath(filePath), dependency);
        dependency = path.normalize(dependency);
        return { filePath: dependency.replace(/\\/g, "/"), isRelative: false };
    }

    return { filePath: dependency, isRelative: false };
}

function removeDuplicatesPreserveOrder(files: ContractDependency[]): ContractDependency[] {
    const seenPaths = new Set<string>();
    const result: ContractDependency[] = [];

    for (let i = files.length - 1; i >= 0; i--) {
        const file = files[i];
        // console.log(path.basename(file.paths.originalFilePath));
        if (!seenPaths.has(file.paths.originalFilePath)) {
            result.unshift(file); // Add to the beginning of the array
            seenPaths.add(path.basename(file.paths.originalFilePath));
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