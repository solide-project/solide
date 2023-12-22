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
    formData.append('file', blob, filename);

    let uri = `/api/compile?version=${encodeURIComponent(compilerVersion)}`
    if (title) {
      uri += `&title=${encodeURIComponent(title)}`
    }
    console.log(uri)
    const response = await fetch(uri, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const data = await response.json() as CompileError;
      setCompileError(data);
      setCompiling(false);
      return;
    }
    const data = await response.json();
    setContractAddress("");
    setCompileInfo(data);
    setCompiling(false);
    console.log(data);
  }

  const [contractAddress, setContractAddress] = useState<string>("");
  const [contract, setContract] = useState<ethers.Contract | undefined>();
  const [contractKey, setContractKey] = useState<number>(0);
  const deploy = async () => {
    if (compileInfo === undefined) return;

    setContract(undefined);

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner() as Signer;

    if (!contractAddress) {
      const factory = new ethers.ContractFactory(compileInfo.data.abi, compileInfo.data.evm.bytecode.object, signer);
      const contract = await factory.deploy([]);
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
          <TabsList>
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
                <ContractInvoke key={contractKey} contract={contract} abi={compileInfo?.data.abi || []} />
              </div>
              : <>Compile Contract</>}
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
                <ContractInvoke key={contractKey} contract={contract} abi={compileInfo?.data.abi || []} />
              </div>
              : <>Compile Contract</>}
          </div>
        </div>}

      <section className="absolute inset-x-0 bottom-0 border-t bg-background px-4">
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            <Button size="sm" onClick={compile} disabled={compiling}>{compiling ? "Compiling ..." : "Compile"}</Button>
            <Button size="sm" onClick={deploy} disabled={compileInfo ? false : true}>Deploy</Button>
            <Input className="h-9 rounded-md px-3" placeholder="Contract Address"
              value={contractAddress} onChange={(e) => setContractAddress(e.target.value)} />
          </div>

          <div className="flex items-center space-x-2">
            {url && <ContentLink url={url} />}
            <ThemeToggle />
            <SolVersion setVersion={setCompilerVersion} version={version} />
            <SelectedChain />
          </div>
        </div>
      </section>
    </div>
  );
}