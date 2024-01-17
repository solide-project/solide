import { getSolidityContract } from "@/lib/server/source-loader"
import { solcVersion } from "@/lib/utils"
import { compilerVersions } from "@/lib/versions"
import { InvalidMessage } from "@/components/invalid-message"
import { SolideIDE } from "@/components/main/solide-ide"

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

  const data = await getSolidityContract(url)
  if (typeof data === "string") {
    return <InvalidMessage>{data}</InvalidMessage>
  }

  return (
    <SolideIDE
      url={url}
      content={JSON.stringify(data)}
      version={version}
      title={url.replace(
        /https:\/\/raw.githubusercontent.com\/[a-zA-Z0-9\-]+\/[a-zA-Z0-9\-]+\/[a-zA-Z0-9\-]+\//,
        ""
      )}
    />
  )
}
