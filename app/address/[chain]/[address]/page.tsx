import { EthGetSourceCodeInterface, getSourceCode } from "@/lib/evm/explorer"
import { EVMProvider } from "@/components/evm/evm-provider"
import { EvmIDE } from "@/components/evm/ide"
import { LoadContractPage } from "@/components/evm/load-contract"

export default async function Page({
  params,
}: {
  params: { chain: string; address: string }
}) {
  const data: EthGetSourceCodeInterface = await getSourceCode(
    params.chain,
    params.address
  )

  if (typeof data.result === "string")
    return (
      <LoadContractPage message={`${data.result} ${JSON.stringify(data)}`} />
    )

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
