import { getSolidityContract } from "@/lib/server/source-loader"
import { solcVersion, compilerVersions } from "@/lib/versions"
import { InvalidMessage } from "@/components/invalid-message"
import { SolideIDE } from "@/components/main/evm/evm-ide"
import { EVMProvider } from "@/components/main/evm/provider/evm-provider"

interface SearchParams {
  params: { slug: string }
  searchParams?: { [key: string]: string | undefined }
}
export default async function IndexPage({ searchParams }: SearchParams) {
  let url = ""
  searchParams?.url && (url = searchParams.url)

  let version = solcVersion
  searchParams?.version &&
    compilerVersions.includes(searchParams?.version) &&
    (version = searchParams?.version)

  let remappings: Record<string, string> = {}
  if (searchParams?.remappings) {
    searchParams?.remappings.split(',').forEach((remapping: string) => {
      const [to, from] = remapping.split('=')
      if (!to || !from) return <InvalidMessage>{"Remapping Issue"}</InvalidMessage>
      console.log(remapping, to, from)
      remappings[to] = from
    })
  }

  const data = await getSolidityContract(url, remappings)
  if (typeof data === "string") {
    return <InvalidMessage>{data}</InvalidMessage>
  }

  return (
    <EVMProvider>
      <SolideIDE
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
