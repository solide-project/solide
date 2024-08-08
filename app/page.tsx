import { getSolidityContract } from "@/lib/server/source-loader"
import { compilerVersions, solcVersion } from "@/lib/versions"
import { EVMProvider } from "@/components/evm/evm-provider"
import { EvmIDE } from "@/components/evm/ide"
import { LoadContractPage } from "@/components/evm/load-contract"

interface SearchParams {
  params: { slug: string }
  searchParams?: { [key: string]: string | undefined }
}
export default async function IndexPage({ searchParams }: SearchParams) {
  let url = ""
  searchParams?.url && (url = searchParams.url)

  if (!url) return <LoadContractPage />

  let version = solcVersion
  searchParams?.version &&
    compilerVersions.includes(searchParams?.version) &&
    (version = searchParams?.version)

  let remappings: Record<string, string> = {}
  if (searchParams?.remappings) {
    searchParams?.remappings.split(",").forEach((remapping: string) => {
      const [to, from] = remapping.split("=")
      if (!to || !from) return <LoadContractPage message="Remapping Error" />
      remappings[to] = from
    })
  }

  const data = await getSolidityContract(url, remappings)
  if (typeof data === "string") return <LoadContractPage message={data} />

  return (
    <EVMProvider>
      <EvmIDE
        url={url}
        content={JSON.stringify(data)}
        version={version}
        title={url.replace(
          /https:\/\/raw.githubusercontent.com\/[a-zA-Z0-9\-]+\/[a-zA-Z0-9\-]+\/[a-zA-Z0-9\-]+\//,
          ""
        )}
      />
    </EVMProvider>
  )
}
