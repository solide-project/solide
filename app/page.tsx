import { InvalidMessage } from "@/components/invalid-message";
import { SolideIDE } from "@/components/main/solide-ide";
import { solcVersion } from "@/lib/utils";
import { compilerVersions } from "@/lib/versions";

const getSolidityContract = async (url: string) => {
    if (!url) return "";
    if (!url.startsWith("https://raw.githubusercontent.com")) return "";
    if (!url.endsWith(".sol")) return "";

    const response = await fetch(url);
    return await response.text();
}

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
