import { GlacierService } from "@/lib/services/solidity-db/src/glacier-service";
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
    const databaseService = new GlacierService()

    const hash: string = request.nextUrl.searchParams.get("hash") || ""
    if (!hash) {
        return NextResponse.json({ details: "No hash provided" }, { status: 400 })
    }

    // const results: any = databaseService.find(hash);
    // console.log(results);

    return NextResponse.json({ data: "Hello" })
}