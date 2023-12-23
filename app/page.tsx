import { InvalidMessage } from "@/components/invalid-message";
import { SolideIDE } from "@/components/main/solide-ide";
import { getSolidityContract, solcVersion } from "@/lib/utils";
import { compilerVersions } from "@/lib/versions";

interface SearchParams {
    params: { slug: string };
    searchParams?: { [key: string]: string | undefined };
}
export default async function IndexPage({
    searchParams,
}: SearchParams) {
    let url = "";
    searchParams?.url && (url = searchParams.url);

    let version = solcVersion;
    (searchParams?.version && compilerVersions.includes(searchParams?.version))
        && (version = searchParams?.version);

    const data = await getSolidityContract(url);
    if (!data) {
        return <InvalidMessage>Invalid URL</InvalidMessage>
    }

    return <SolideIDE
        url={url}
        content={data}
        version={version} />
}
