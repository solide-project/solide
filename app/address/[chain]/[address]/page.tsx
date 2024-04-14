import { getSourceCode } from "@/lib/evm/explorer"
import { EthGetSourceCodeInterface } from "@/lib/evm"
import { EVMProvider } from "@/components/evm/evm-provider"
import { EvmIDE } from "@/components/evm/ide"
import { InvalidMessage } from "@/components/core/components/invalid-message"

export default async function Page({
  params,
}: {
  params: { chain: string; address: string }
}) {
  const data: EthGetSourceCodeInterface = await getSourceCode(
    params.chain,
    params.address
  )

  if (typeof data.result === "string") {
    return (
      <InvalidMessage>
        {data.result} {JSON.stringify(data)}
      </InvalidMessage>
    )
  }

  return (
    <EVMProvider>
      <EvmIDE
        url={params.address}
        chainId={params.chain}
        title={data.result[0].ContractName}
        content={data.result[0].SourceCode}
        version={data.result[0].CompilerVersion}
        bytecodeId={data.result[0].BytcodeContract}
      />
    </EVMProvider>
  )
}
