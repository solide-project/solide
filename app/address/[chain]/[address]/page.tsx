import { InvalidMessage } from "@/components/invalid-message"
import { SolideIDE } from "@/components/main/evm/evm-ide"
import { EVMProvider } from "@/components/main/evm/provider/evm-provider"
import { getSourceCode } from "@/lib/services/explorer/explorer-service"
import { EthGetSourceCodeInterface } from "@/lib/services/explorer/scanner/explorer-service"

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
      <SolideIDE
        url={params.address}
        chainId={params.chain}
        title={data.result[0].ContractName}
        content={data.result[0].SourceCode}
        version={data.result[0].CompilerVersion}
      />
    </EVMProvider>
  )
}
