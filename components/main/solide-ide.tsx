"use client"

import Editor from '@monaco-editor/react';
import { useTheme } from "next-themes"
import { GetSolidityJsonInputFormat, JSONParse, cn, solcVersion } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { SolVersion } from '@/components/main/footer/sol-version';
import { Signer, ethers } from 'ethers';
import { SelectedChain } from '@/components/main/footer/selected-chain';
import { CompileError, CompileResult } from '@/lib/interfaces';
import { ThemeToggle } from '@/components/theme-toggle';
import { Input } from '@/components/ui/input';
import { ContractInvoke } from '@/components/main/contract/contract-invoke';
import { ContractMetadata } from '@/components/main/contract/contract-metadata';
import { ContentLink } from '@/components/main/footer/content-link';
import { CompileErrors } from '@/components/main/compile/errors';
import { EditorLoading } from '@/components/main/compile/loading';
import { Checkbox } from '../ui/checkbox';
import { FileTree } from './file-tree';
import { useSolideFile } from '../provider/file-provider';
import { SolideFile, isSolideFile } from '@/lib/solide/solide-file';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import path from 'path';
import { Code, File, FunctionSquare, Settings } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"

interface SolideIDEProps
  extends React.HTMLAttributes<HTMLDivElement> {
  url?: string;
  chainId?: string;
  title?: string;
  content: string;
  version?: string;
}

interface CompileInput {
  language: "Solidity" | "Yul" | "LLL" | "Assembly" | "Vyper";
  settings?: {
    outputSelection: any;
    optimizer: any;
    evmVersion: string;
    metadata: any;
    libraries: any;
    remappings: any;
    metadataHash: string;
  }
  sources: {
    [key: string]: CompileSource;
  };
}

interface CompileSource {
  content: string;
}

export function SolideIDE({
  url,
  content,
  version,
  chainId,
  title = "Contract",
}: SolideIDEProps) {
  const {
    folder, setFolder,
    ideKey, selectedFile, handleIDEDisplay,
    handleIDEChange, selectedSolcVersion, setSelectedSolcVersion
  } = useSolideFile();
  const { theme } = useTheme()

  const [compileInfo, setCompileInfo] = useState<CompileResult | undefined>()
  const [solidityInput, setSolidityInput] = useState<CompileInput | undefined>()

  useEffect(() => {
    (async () => {
      // At the start, we need to check if the content is JSON format
      handleIDEDisplay({ content, filePath: title });
      setSelectedSolcVersion(version || solcVersion)

      if (!content) return;

      //#region Check if the smart contract is JSON format
      const input: CompileInput = GetSolidityJsonInputFormat(content);
      if (input) {
        setSolidityInput(input);
        let fileSystem: any = {};
        Object.entries(input.sources).forEach(([key, val]) => {
          // console.log(key, val)

          const pathArray = key.split('/');
          let currentLocation = fileSystem;

          for (const folder of pathArray.slice(0, -1)) {
            if (!currentLocation[folder]) {
              currentLocation[folder] = {};
            }
            currentLocation = currentLocation[folder];
          }

          currentLocation[pathArray[pathArray.length - 1]] = {
            content: val.content,
            filePath: key,
          } as SolideFile;
        });

        setFolder(fileSystem)
        const onChainEntry = Object.entries(input.sources).find(
          ([_, val]) => val.content.includes(`contract ${title}`));

        if (onChainEntry) {
          const [key, onChainContent] = onChainEntry;
          // Now, key is the key, and onChainContent is the value
          // setValue(onChainContent.content);
          handleIDEDisplay({
            content: onChainContent.content,
            filePath: key,
          });
        }
      } else {
        let data: CompileInput = JSONParse(content) as CompileInput

        // If flatten contract, then can't parse JSON, hence we need to manually parse it
        if (!data) {
          data = {
            language: "Solidity",
            sources: {
              [`${title}.sol`]: {
                content: content
              }
            }
          }
        }

        setSolidityInput(data);
        let fileSystem: any = {};
        Object.entries(data.sources).forEach(([key, val]) => {
          const pathArray = key.split('/');
          let currentLocation = fileSystem;

          for (const folder of pathArray.slice(0, -1)) {
            if (!currentLocation[folder]) {
              currentLocation[folder] = {};
            }
            currentLocation = currentLocation[folder];
          }

          currentLocation[pathArray[pathArray.length - 1]] = {
            content: val.content,
            filePath: key,
          } as SolideFile;
        });

        setFolder(fileSystem)
        const onChainEntry = Object.entries(data.sources).find(
          ([key, _]) => path.basename(key).startsWith(path.basename(title)));

        if (onChainEntry) {
          const [key, onChainContent] = onChainEntry;
          // Now, key is the key, and onChainContent is the value
          // setValue(onChainContent.content);
          handleIDEDisplay({
            content: onChainContent.content,
            filePath: key,
          });
        }
      }
      //#endregion

    })()
  }, [content]);

  //#region Compiling on client using web worker
  // const compileOffLine = async () => {
  //   if (compiling) return;
  //   setCompiling(true);

  //   const formData = new FormData();
  //   const blob = new Blob([value], { type: 'text/plain' });
  //   formData.append('file', blob, url);
  //   formData.append('source', url || encodeURIComponent(title));
  //   if (title) {
  //     formData.append('title', title);
  //   }

  //   let uri = `/api/source?version=${encodeURIComponent(compilerVersion)}`

  //   if (compileOptimiser) {
  //     uri += `&optimizer=${encodeURIComponent(compileOptimiser)}&runs=${encodeURIComponent(compilerRun)}`
  //   }

  //   if (viaIR) {
  //     uri += `&viaIR=${encodeURIComponent(viaIR)}`
  //   }

  //   console.log(uri)
  //   const response = await fetch(uri, {
  //     method: 'POST',
  //     body: formData,
  //   })

  //   if (!response.ok) {
  //     const data = await response.json() as CompileError;
  //     console.log(data);
  //     return;
  //   }
  //   const data = await response.json();
  //   console.log(`https://binaries.soliditylang.org/bin/soljson-${compilerVersion}.js`)

  //   try {
  //     const output: any = await solidityCompiler({
  //       version: `https://binaries.soliditylang.org/bin/soljson-${compilerVersion}.js`,
  //       sources: data.sources
  //     })
  //     if (output.errors) {
  //       // For demo we don't care about warnings
  //       output.errors = output.errors.filter((error: SolcError) => error.type !== "Warning");
  //       if (output.errors.length > 0) {
  //         setCompileError({ details: output.errors } as CompileError);
  //         setCompiling(false);
  //         return;
  //       }
  //     }
  //     let name = path.basename(url || encodeURIComponent(title));
  //     const compiled: any = await getEntryDetails(output, name);
  //     if (compiled) {
  //       const constructors: any[] = compiled.abi.filter((m: any) => m.type === "constructor");

  //       if (constructors.length > 0) {
  //         const contractConstructor = constructors.pop();
  //         setConstructorABI(contractConstructor)
  //       }
  //       setContractAddress("");
  //       setCompileInfo({ data: compiled, flattenContract: data.flattenContract });
  //       setCompiling(false);
  //     }
  //   } catch (error) {
  //     console.log(error)
  //     setCompileError(undefined);
  //     setCompiling(false);
  //     return;
  //   }
  // }
  //#endregion

  const onChange = async (newValue: string | undefined, event: any) => {
    if (!newValue) return;
    handleIDEChange(selectedFile.filePath, newValue);
  }

  const [viaIR, setViaIR] = useState<boolean>(false)
  const [compilerRun, setCompilerRun] = useState<number>(200)
  const [compileOptimiser, setCompileOptimiser] = useState<boolean>(false)
  const handleCompileOptimiser = (e: any) => {
    const val = compileOptimiser;
    setCompileOptimiser(!val)
  }
  const handleViaIR = (e: any) => {
    const val = viaIR;
    setViaIR(!val)
  }

  const [compilerVersion, setCompilerVersion] = useState<string>(solcVersion)
  const [compiling, setCompiling] = useState<boolean>(false)
  const [compileError, setCompileError] = useState<CompileError | undefined>();

  const getAllStringValues = (obj: any) => {
    let sources: any = {};

    const traverse = (currentObj: any) => {
      for (const key in currentObj) {
        if (isSolideFile(currentObj[key])) {
          sources[currentObj[key].filePath] = { content: currentObj[key].content };
        } else if (typeof currentObj[key] === 'object') {
          traverse(currentObj[key]);
        }
      }
    };

    traverse(obj);

    return sources;
  };

  const compile = async () => {
    if (compiling) return;

    setCompiling(true);

    setCompileError(undefined);
    setCompileInfo(undefined);
    setContract(undefined);

    const formData = new FormData();

    // override the content with the json format if it exists
    const sources = getAllStringValues(folder)
    console.log({ ...solidityInput, sources })
    const blob = new Blob([JSON.stringify({ ...solidityInput, sources })], { type: 'text/plain' });
    formData.append('file', blob, url);
    // if (contractInput) {
    //   const blob = new Blob([JSON.stringify(contractInput)], { type: 'text/plain' });
    //   formData.append('file', blob, url);
    // } else {
    //   const blob = new Blob([value], { type: 'text/plain' });
    //   formData.append('file', blob, url);
    // }
    formData.append('source', url || encodeURIComponent(title));

    if (title) {

      formData.append('title', title);
    }

    let uri = `/api/compile?version=${encodeURIComponent(selectedSolcVersion)}`

    if (compileOptimiser) {
      uri += `&optimizer=${encodeURIComponent(compileOptimiser)}&runs=${encodeURIComponent(compilerRun)}`
    }

    if (viaIR) {
      uri += `&viaIR=${encodeURIComponent(viaIR)}`
    }

    const response = await fetch(uri, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const data = await response.json() as CompileError;
      setCompileError(data);
      setCompiling(false);
      return;
    }
    const data = await response.json();
    const constructors: any[] = data.data.abi.filter((m: any) => m.type === "constructor");

    if (constructors.length > 0) {
      const contractConstructor = constructors.pop();
      setConstructorABI(contractConstructor)
    }
    setContractAddress("");
    setCompileInfo(data);
    setCompiling(false);
  }

  const [contractAddress, setContractAddress] = useState<string>("");
  const [constructorArgs, setConstructorArgs] = useState<any[]>([]);
  const [constructorABI, setConstructorABI] = useState<{
    inputs: any[];
  }>({
    inputs: [],
  } as any);

  const [contract, setContract] = useState<ethers.Contract | undefined>();
  const [contractKey, setContractKey] = useState<number>(0);
  const deploy = async () => {
    if (compileInfo === undefined) return;

    setContract(undefined);

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner() as Signer;

    console.log(constructorArgs, constructorABI, constructorArgs.length, (constructorABI.inputs || []).length);
    if (!ethers.utils.isAddress(contractAddress)) {
      const factory = new ethers.ContractFactory(compileInfo.data.abi, compileInfo.data.evm.bytecode.object, signer);
      const contract = await factory.deploy(...constructorArgs);
      setContractAddress(contract.address);
      setContractKey(contractKey + 1);
      setContract(contract);
    } else {
      const contract = new ethers.Contract(contractAddress, compileInfo.data.abi, signer);
      setContractAddress(contract.address);
      setContractKey(contractKey + 1);
      setContract(contract);
    }
  }

  //#region Set width, fontsize of the editor
  const [width, setWidth] = useState<number>(1024);
  const [editorFontSize, setEditorFontSize] = useState<number>(16);
  useEffect(() => {
    const handleWindowResize = () => {
      let fontSize = 12;

      if (window.innerWidth > 1024) {
        fontSize = 16;
      } else if (window.innerWidth > 768) {
        fontSize = 14;
      }

      setWidth(window.innerWidth);
      setEditorFontSize(fontSize);
    };

    handleWindowResize(); // Initialize size
    window.addEventListener('resize', handleWindowResize);
    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);
  //#endregion


  const [isFileSytemVisible, setIsFileSytemVisible] = useState(false);
  const toggleFileSytemVisible = () => {
    setIsFileSytemVisible(!isFileSytemVisible);
  };

  const [isEditorVisible, setIsEditorVisible] = useState(true);
  const toggleEditorVisible = () => {
    setIsEditorVisible(!isEditorVisible);
  };

  const [isContractVisible, setIsContractVisible] = useState(true);
  const toggleIsContractVisible = () => {
    setIsContractVisible(!isContractVisible);
  };

  return (
    <div className="flex max-h-screen min-h-screen">
      <div className={cn("max-h-screen mx-0", `${isFileSytemVisible ? '' : 'hidden'}`)}>
        <div className="h-full">
          <div className="overflow-y-auto overflow-x-auto h-full p-4 pb-8">
            <FileTree name={path.basename(url || "")} />
          </div>
        </div>
      </div>
      <div className={cn("flex flex-col gap-2 items-center py-4 lg:px-2 max-h-screen px-1")}>
        <Button size="icon" variant="ghost" onClick={toggleFileSytemVisible}>
          <File />
        </Button>

        <Separator className="my-4" />

        <Button size="icon" variant="ghost" onClick={toggleEditorVisible}>
          <Code />
        </Button>

        <Button size="icon" variant="ghost" onClick={toggleIsContractVisible} >
          <FunctionSquare />
        </Button>

        {url && <ContentLink url={url} chainId={chainId} />}

        <div className="mt-auto flex flex-col items-center gap-2">
          <SelectedChain />

          <ThemeToggle />

          <Dialog>
            <DialogTrigger>
              <Button size="icon">
                <Settings />
              </Button>
            </DialogTrigger>
            <DialogContent className="shadow-none border-none bg-grayscale-025 overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-center text-sm lg:text-xl mb-0 lg:mb-6">Settings</DialogTitle>
                <DialogDescription className="flex flex-col gap-2 lg:gap-8 text-xs lg:text-base">
                  <div>
                    <div className="my-2">Compiler</div>
                    <SolVersion version={version} />
                  </div>

                  <div>
                    <div className="my-2">Runs</div>
                    <Input type="number" max={1300} min={200}
                      value={compilerRun}
                      onChange={(e: any) => setCompilerRun(parseInt(e.target.value))} />
                  </div>

                  <div className="flex items-center space-x-2 bg-grayscale-100 rounded-md py-1 px-4 lg:py-4 lg:px-4">
                    <Checkbox id="optimizer" checked={compileOptimiser} onClick={handleCompileOptimiser} />
                    <label htmlFor="optimizer"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Enable optimization (Note enable may timeout on large contracts)
                    </label>
                  </div>

                  <div className="flex items-center space-x-2 bg-grayscale-100 rounded-md py-4 px-4">
                    <Checkbox id="viaIR" checked={viaIR} onClick={handleViaIR} disabled={true} />
                    <label htmlFor="viaIR"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Use CLI (Coming Soon)
                    </label>
                  </div>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <ResizablePanelGroup direction="horizontal" className="">
        <ResizablePanel defaultSize={70} minSize={5} className={cn("relative", `${isEditorVisible ? '' : 'hidden'}`)}>
          <div className="flex items-center justify-center text-center" style={{ height: "5vh" }}>
            <span className="border py-1 px-16 rounded-md bg-grayscale-025">{selectedFile.filePath || "Contract.sol"}</span>
          </div>
          <Editor
            key={ideKey}
            height="95vh"
            theme={theme === "light" ? "vs" : "vs-dark"}
            defaultLanguage="sol"
            loading={<EditorLoading />}
            onChange={onChange}
            defaultValue={selectedFile.content || ""}
            options={{ fontSize: editorFontSize }}
          />
          <Button
            className="absolute" style={{ bottom: "16px", right: "16px" }}
            size="sm" onClick={compile} disabled={compiling}>{compiling ? "Compiling ..." : "Compile"}</Button>
        </ResizablePanel>
        {isContractVisible && isEditorVisible && <ResizableHandle withHandle />}
        <ResizablePanel defaultSize={30} minSize={5} className={cn("", `${isContractVisible ? '' : 'hidden'}`)}>
          {compileError && compileError.details &&
            <CompileErrors errors={compileError.details} />}
          {compileInfo
            ? <div className="max-h-screen flex flex-col gap-2">
              <div className="px-4">
                <ContractMetadata items={[
                  { title: "ABI", payload: JSON.stringify(compileInfo.data?.abi || "{}") },
                  { title: "Bytecode", payload: compileInfo.data?.evm?.bytecode?.object || "" },
                  { title: "Flatten", payload: compileInfo.flattenContract },
                ]} />

                <div className="flex">
                  <Button size="sm" onClick={deploy}
                    variant="default"
                    disabled={ethers.utils.isAddress(contractAddress) || constructorArgs.length === (constructorABI.inputs || []).length
                      ? false : true}>Deploy</Button>
                  <Input className="h-9 rounded-md px-3" placeholder="Contract Address"
                    value={contractAddress} onChange={(e) => setContractAddress(e.target.value)} />
                </div>
              </div>
              <div className="pl-4">
                <ContractInvoke
                  setConstructorArgs={setConstructorArgs}
                  key={contractKey}
                  contract={contract}
                  abi={compileInfo?.data.abi || []} />
              </div>
            </div>
            : <div className={cn("py-4 min-h-screen flex items-center justify-center", `${compileError && compileError.details && "hidden"}`)}>
              Compile contract to render section
            </div>}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}