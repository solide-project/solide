"use client"

import Editor from '@monaco-editor/react';
import { useTheme } from "next-themes"
import { solcVersion } from '@/lib/utils';
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

interface SolideIDEProps
  extends React.HTMLAttributes<HTMLDivElement> {
  url?: string;
  title?: string;
  content?: string;
  version?: string;
}

export function SolideIDE({ url, title = "contract", content, version }: SolideIDEProps) {
  const { theme } = useTheme()
  const [value, setValue] = useState<string>(title)
  const [filename, setFilename] = useState<string>(`${title}.sol`)
  const [compileInfo, setCompileInfo] = useState<CompileResult | undefined>()

  useEffect(() => {
    if (content) {
      setValue(content);
    }
  }, [content]);

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

  const onChange = async (newValue: string | undefined, event: any) => {
    // Could compile on change but it might have performance issue
    if (newValue === undefined) return;
    setValue(newValue || "");
  }

  const [compilerRun, setCompilerRun] = useState<number>(200)
  const [compileOptimiser, setCompileOptimiser] = useState<boolean>(false)
  const handleCompileOptimiser = (e: any) => {
    const val = compileOptimiser;
    setCompileOptimiser(!val)
  }

  const [compilerVersion, setCompilerVersion] = useState<string>(solcVersion)
  const [compiling, setCompiling] = useState<boolean>(false)
  const [compileError, setCompileError] = useState<CompileError | undefined>();
  const compile = async () => {
    if (compiling) return;
    setCompiling(true);

    setCompileError(undefined);
    setCompileInfo(undefined);
    setContract(undefined);

    const formData = new FormData();
    const blob = new Blob([value], { type: 'text/plain' });
    formData.append('file', blob, url);
    formData.append('source', url || encodeURIComponent(title));
    if (title) {
      formData.append('title', title);
    }

    let uri = `/api/compile?version=${encodeURIComponent(compilerVersion)}`

    if (compileOptimiser) {
      uri += `&optimizer=${encodeURIComponent(compileOptimiser)}&runs=${encodeURIComponent(compilerRun)}`
    }

    console.log(uri)
    const response = await fetch(uri, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const data = await response.json() as CompileError;
      console.log(data);
      setCompileError(data);
      setCompiling(false);
      return;
    }
    const data = await response.json();
    const constructors: any[] = data.data.abi.filter((m: any)=> m.type === "constructor");

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

  return (
    <div>
      {width < 768
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
                  { title: "ABI", payload: JSON.stringify(compileInfo.data.abi) },
                  { title: "Bytecode", payload: compileInfo.data.evm.bytecode.object },
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
        : <div className="grid grid-cols-12">
          <div className="col-span-12 sm:col-span-8">
            <Editor
              height="90vh"
              theme={theme === "light" ? "vs" : "vs-dark"}
              defaultLanguage="sol"
              loading={<EditorLoading />}
              onChange={onChange}
              defaultValue={value}
              options={{ fontSize: editorFontSize }}
            />
          </div>
          <div className="col-span-12 text-xs sm:col-span-4 md:text-sm lg:text-base" style={{ height: "90vh" }}>
            {compileError && compileError.details &&
              <CompileErrors errors={compileError.details} />}

            {compileInfo
              ? <div>
                <ContractMetadata items={[
                  { title: "ABI", payload: JSON.stringify(compileInfo.data.abi) },
                  { title: "Bytecode", payload: compileInfo.data.evm.bytecode.object },
                  { title: "Flatten", payload: compileInfo.flattenContract },
                ]} />
                <ContractInvoke
                  setConstructorArgs={setConstructorArgs}
                  key={contractKey}
                  contract={contract}
                  abi={compileInfo?.data.abi || []} />
              </div>
              : <div className="text-center py-8">Compile Contract</div>}
          </div>
        </div>}

      <section className="absolute inset-x-0 bottom-0 border-t bg-background px-4">
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            <Button size="sm" onClick={compile} disabled={compiling}>{compiling ? "Compiling ..." : "Compile"}</Button>
            <Button size="sm" onClick={deploy} disabled={ethers.utils.isAddress(contractAddress) || constructorArgs.length === (constructorABI.inputs || []).length
               ? false : true}>Deploy</Button>
            <Input className="h-9 rounded-md px-3" placeholder="Contract Address"
              value={contractAddress} onChange={(e) => setContractAddress(e.target.value)} />
          </div>

          <div className="flex items-center space-x-2">
            {url && <ContentLink url={url} />}
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
                  <Checkbox id="viaIR" disabled={true} />
                  <label htmlFor="viaIR"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Use CLI
                  </label>
                </div>
              </PopoverContent>
            </Popover>
            <SolVersion setVersion={setCompilerVersion} version={version} />
            <SelectedChain />
          </div>
        </div>
      </section>
    </div>
  );
}