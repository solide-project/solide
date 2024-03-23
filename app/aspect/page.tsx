import { getTypescriptContract } from "@/lib/server/typescript-loader"
import { solcVersion, compilerVersions } from "@/lib/versions"
import { InvalidMessage } from "@/components/invalid-message"
import { SolideAspectIDE } from "@/components/main/aspect/aspect-ide"
import { AspectProvider } from "@/components/main/aspect/provider/aspect-provider"

interface SearchParams {
  params: { slug: string }
  searchParams?: { [key: string]: string | undefined }
}
export default async function IndexPage({ searchParams }: SearchParams) {
  let url =
    "https://github.com/solide-project/solide-guides/blob/master/src/aspect/other/HelloWorld/hello-world.ts"
  searchParams?.url && (url = searchParams.url)

  let version = solcVersion
  searchParams?.version &&
    compilerVersions.includes(searchParams?.version) &&
    (version = searchParams?.version)

  const data = await getTypescriptContract(url)
  if (typeof data === "string") {
    return <InvalidMessage>{data}</InvalidMessage>
  }

  return (
    <AspectProvider>
      <SolideAspectIDE
        url={url}
        content={JSON.stringify(data)}
        version={version}
        title={url.replace(
          /https:\/\/github.com\/[a-zA-Z0-9\-]+\/[a-zA-Z0-9\-]+\/[a-zA-Z0-9\-]+\/[a-zA-Z0-9\-]+\//,
          ""
        )}
      />
    </AspectProvider>
  )
}
