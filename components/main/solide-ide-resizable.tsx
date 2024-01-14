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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ContractInvoke } from '@/components/main/contract/contract-invoke';
import { ContractMetadata } from '@/components/main/contract/contract-metadata';
import { ContentLink } from '@/components/main/footer/content-link';
import { CompileErrors } from '@/components/main/compile/errors';
import { EditorLoading } from '@/components/main/compile/loading';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
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
  settings: {
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
  title = "Contract.sol",
}: SolideIDEProps) {
  const {
    folder, setFolder,
    ideKey, selectedFile, handleIDEDisplay,
    handleIDEChange
  } = useSolideFile();
  const { theme } = useTheme()

  // These variables are used to store the contract input if it is JSON format content
  const [sourceKey, setSourceKey] = useState<string>("")
  const [contractInput, setContractInput] = useState<CompileInput | undefined>(undefined)

  // This is the main smart contract content
  const [mainValue, setMainValue] = useState<string>(content)
  const [secondaryValue, setSecondaryValue] = useState<string>("")

  const [value, setValue] = useState<string>(content)
  const [readonlyValue, setReadonlyValue] = useState<string>(content)

  // const [values, setValues] = useState<any>({})

  const [filename, setFilename] = useState<string>(`${title}.sol`)
  const [compileInfo, setCompileInfo] = useState<CompileResult | undefined>()

  useEffect(() => {
    (async () => {
      // console.log(version)

      // At the start, we need to check if the content is JSON format
      handleIDEDisplay({ content, filePath: title });
      version && setCompilerVersion(version);
      // setValue(content);

      if (!content) return;

      //#region Check if the smart contract is JSON format
      const input: CompileInput = GetSolidityJsonInputFormat(content);
      if (input) {
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
        setContractInput(input);
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
          setSourceKey(key)
        }
      } else {
        let data: any = JSONParse(content)

        // If flatten contract, then can't parse JSON, hence we need to manually parse it
        if (!data) {
          data = {
            sources: {
              [title]: {
                content: content
              }
            }
          }
        }

        let fileSystem: any = {};
        Object.entries(data.sources as CompileSource).forEach(([key, val]) => {
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
        setContractInput(input);
        const onChainEntry = Object.entries(data.sources as CompileSource).find(
          ([key, _]) => path.basename(key).startsWith(path.basename(title)));

        if (onChainEntry) {
          const [key, onChainContent] = onChainEntry;
          // Now, key is the key, and onChainContent is the value
          // setValue(onChainContent.content);
          handleIDEDisplay({
            content: onChainContent.content,
            filePath: key,
          });
          setSourceKey(key)
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
    const blob = new Blob([JSON.stringify({ sources })], { type: 'text/plain' });
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

    let uri = `/api/compile?version=${encodeURIComponent(compilerVersion)}`

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
    <div className="max-h-screen">
      {/* OLD CODE */}
      {/* {width < 768
        ? <Tabs defaultValue="code">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="code">Code</TabsTrigger>
            <TabsTrigger value="contract">Contract</TabsTrigger>
          </TabsList>
          <TabsContent value="code">
            <Editor
              height="90vh"
              theme={theme === "light" ? "vs" : "vs-dark"}
              defaultLanguage="sol"
              loading={<EditorLoading />}
              onChange={onChange}
              defaultValue={value}
              options={{ fontSize: editorFontSize }}
            />
          </TabsContent>
          <TabsContent value="contract">
            {compileError && compileError.details &&
              <CompileErrors errors={compileError.details} />}

            {compileInfo
              ? <div>
                <ContractMetadata items={[
                  { title: "ABI", payload: JSON.stringify(compileInfo.data?.abi || "{}") },
                  { title: "Bytecode", payload: compileInfo.data?.evm?.bytecode?.object || "" },
                  { title: "Flatten", payload: compileInfo.flattenContract },
                ]} />
                <ContractInvoke
                  setConstructorArgs={setConstructorArgs}
                  key={contractKey}
                  contract={contract}
                  abi={compileInfo?.data.abi || []} />
              </div>
              : <div className="text-center py-8">Compile Contract</div>}
          </TabsContent>
        </Tabs>
        : <ResizablePanelGroup
          direction="horizontal" className=""
        >
          <ResizablePanel defaultSize={70}>
            <div>{selectedFile.filePath || "Contract.sol"}</div>
            <Editor
              key={ideKey}
              height="90vh"
              theme={theme === "light" ? "vs" : "vs-dark"}
              defaultLanguage="sol"
              loading={<EditorLoading />}
              onChange={onChange}
              defaultValue={selectedFile.content || ""}
              options={{ fontSize: editorFontSize }}
            />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={30}>
            {compileError && compileError.details &&
              <CompileErrors errors={compileError.details} />}

            {compileInfo
              ? <div>
                <ContractMetadata items={[
                  { title: "ABI", payload: JSON.stringify(compileInfo.data?.abi || "{}") },
                  { title: "Bytecode", payload: compileInfo.data?.evm?.bytecode?.object || "" },
                  { title: "Flatten", payload: compileInfo.flattenContract },
                ]} />
                <ContractInvoke
                  setConstructorArgs={setConstructorArgs}
                  key={contractKey}
                  contract={contract}
                  abi={compileInfo?.data.abi || []} />
              </div>
              : <div className="py-4">
                Compile Contract
                <FileTree />
              </div>}
          </ResizablePanel>
        </ResizablePanelGroup>} */}
      {/* <section className="absolute inset-x-0 bottom-0 border-t bg-background px-4">
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            <Button size="sm" onClick={compile} disabled={compiling}>{compiling ? "Compiling ..." : "Compile"}</Button>
            <Button size="sm" onClick={deploy} disabled={ethers.utils.isAddress(contractAddress) || constructorArgs.length === (constructorABI.inputs || []).length
              ? false : true}>Deploy</Button>
            <Input className="h-9 rounded-md px-3" placeholder="Contract Address"
              value={contractAddress} onChange={(e) => setContractAddress(e.target.value)} />
          </div>

          <div className="flex items-center space-x-2">
            {url && <ContentLink url={url} chainId={chainId} />}
            <ThemeToggle />
            <Popover>
              <PopoverTrigger>Settings</PopoverTrigger>
              <PopoverContent>
                <Input type="number" max={1300} min={200}
                  value={compilerRun}
                  onChange={(e: any) => setCompilerRun(parseInt(e.target.value))} />
                <div className="flex items-center space-x-2 py-4">
                  <Checkbox id="optimizer" checked={compileOptimiser} onClick={handleCompileOptimiser} />
                  <label htmlFor="optimizer"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Enable optimization (Note enable may timeout on large contracts)
                  </label>
                </div>
                <div className="flex items-center space-x-2 py-4">
                  <Checkbox id="viaIR" checked={viaIR} onClick={handleViaIR} />
                  <label htmlFor="viaIR"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Use CLI (Coming Soon)
                  </label>
                </div>
              </PopoverContent>
            </Popover>
            <SolVersion setVersion={setCompilerVersion} version={version} />
            <SelectedChain />
          </div>
        </div>
      </section> */}
      <div className="flex">
        <ResizablePanelGroup direction="horizontal" className="">
          <ResizablePanel defaultSize={15} className={cn("p-4 rounded max-h-screen overflow-y-scroll overflow-x-hidden", `${isFileSytemVisible ? '' : 'hidden'}`)}>
            <FileTree />
          </ResizablePanel>
          <ResizableHandle withHandle className={`${isFileSytemVisible ? '' : 'hidden'}`} />
          <ResizablePanel defaultSize={5} maxSize={5} minSize={5}>
            <div className="rounded-md bg-grayscale-025 flex flex-col gap-2 items-center py-4 px-1 lg:px-2 max-h-screen">
              <Button size="icon" variant="ghost" className="mb-4" onClick={toggleFileSytemVisible}>
                <File />
              </Button>

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
                  <DialogContent className="shadow-none border-none bg-grayscale-025">
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

                        <div className="flex items-center space-x-2 bg-grayscale-100 rounded-md py-4 px-4 lg:py-1">
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
          </ResizablePanel>
          <ResizablePanel defaultSize={50} className={cn("relative", `${isEditorVisible ? '' : 'hidden'}`)}>
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
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={30} className={cn("", `${isContractVisible ? '' : 'hidden'}`)}>
            {compileError && compileError.details &&
              <CompileErrors errors={compileError.details} />}
            {compileInfo
              ? <div className="max-h-screen">
                <ContractMetadata items={[
                  { title: "ABI", payload: JSON.stringify(compileInfo.data?.abi || "{}") },
                  { title: "Bytecode", payload: compileInfo.data?.evm?.bytecode?.object || "" },
                  { title: "Flatten", payload: compileInfo.flattenContract },
                ]} />
                <ContractInvoke
                  setConstructorArgs={setConstructorArgs}
                  key={contractKey}
                  contract={contract}
                  abi={compileInfo?.data.abi || []} />

                <div className="flex">
                  <Button size="sm" onClick={deploy} disabled={ethers.utils.isAddress(contractAddress) || constructorArgs.length === (constructorABI.inputs || []).length
                    ? false : true}>Deploy</Button>
                  <Input className="h-9 rounded-md px-3" placeholder="Contract Address"
                    value={contractAddress} onChange={(e) => setContractAddress(e.target.value)} />
                </div>
              </div>
              : <div className="py-4">
                Compile Contract
              </div>}
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}