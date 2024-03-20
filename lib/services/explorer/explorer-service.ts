import { ContractInfo, EthGetSourceCodeInterface, ExplorerInterface, generateSourceCodeError } from "./scanner/explorer-service"
import { BlockScoutOldClient } from "./scanner/blockscout-old"
import { BlockScoutClient } from "./scanner/blockscout-new"
import { XdcScanClient } from "./scanner/xdcscan"
import { RoninChainClient } from "./scanner/roninchain"
import { FilScanClient } from "./scanner/filscan"
import { ConfluxScanClient } from "./scanner/confluxscan"
import { VicScanClient } from "./scanner/vicscan"
import { TronScanClient } from "./scanner/tronscan"
import { ChainLensClient } from "./scanner/chain-lens"
import { EtherScanClient } from "./scanner/etherscan"
import { ethers } from "ethers"
import { solcVersion } from "@/lib/versions"
import { ChainID, getRPC, getTronRPC } from "@/lib/chains"
import { BTFSGateway, GlacierService } from "@/lib/services/solidity-db"
import { sEthers } from "@/lib/services/ethers"
import TronWeb from 'tronweb';
import { sWeb3 } from "../web3"

export const getSourceCode = async (
    chain: string,
    address: string
): Promise<EthGetSourceCodeInterface> => {
    const scanner: ExplorerInterface | undefined = getScanner(chain)
    if (!scanner) {
        return generateSourceCodeError("Invalid chain or chain not supported")
    }

    // return scanner.getSourceCode(address)
    const data = await scanner.getSourceCode(address)

    // NEW: Solide Smart Contract Database Service to load unverified contracts
    if (typeof data.result !== "string") {
        const source = (data.result[0] as ContractInfo).SourceCode;
        if (!source) {
            let contractBytecode: string = "";

            if (chain === ChainID.TRON_MAINNET || chain === ChainID.TRON_NILE_TESTNET || chain === ChainID.TRON_SHASTA_TESTNET) {
                const rpc = getTronRPC(chain)
                if (rpc) {
                    contractBytecode = await sWeb3.tron.getCode(address, rpc);
                }
            } else {
                const rpc = getRPC(chain)
                if (rpc) {
                    const provider: ethers.JsonRpcProvider = new ethers.JsonRpcProvider(rpc)
                    contractBytecode = await provider.getCode(address)
                }
            }

            if (contractBytecode && contractBytecode !== "0x") {
                const hash = ethers.id(contractBytecode.slice(2))

                console.log("hash", hash)
                const databaseService = new GlacierService()
                const results = await databaseService.find(hash);
                if (!databaseService.exist(results)) {
                    console.log("address not found in database")
                    return data;
                }
                if (results && results.length > 1) {
                    console.log("multiple results found. Note this should not happen")
                }

                const response = await fetch(`${BTFSGateway}/${results[0].input}`);
                const metadata = await response.json();

                const contractName = sEthers.metadata.contractName(metadata)
                const compilerVersion = sEthers.metadata.compilerVersion(metadata)

                const result = {
                    SourceCode: `{${JSON.stringify(metadata)}}`,
                    ABI: "",
                    ContractName: contractName,
                    CompilerVersion: compilerVersion || solcVersion,
                    OptimizationUsed: "0",
                    Runs: "200",
                    ConstructorArguments: "",
                    EVMVersion: "default",
                    Library: "",
                    LicenseType: "0",
                    Proxy: "",
                    Implementation: "",
                    SwarmSource: "",
                    BytcodeContract: results[0].input
                }

                data.result = [result]
            }
        }
    }

    return data;
}

const getScanner = (chainId: string): ExplorerInterface | undefined => {
    switch (chainId) {
        case ChainID.METIS_ANDROMEDA:
        case ChainID.METIS_SEPOLIA:
        case ChainID.MANTLE_MAINNET:
        case ChainID.MANTLE_TESTNET:
        case ChainID.KAVA_MAINNET:
        case ChainID.KAVA_TESTNET:
        case ChainID.ROLLUX_MAINNET:
        case ChainID.ROLLUX_TESTNET:
        case ChainID.CANTO_TESTNET:
        case ChainID.ASTAR_MAINNET:
        case ChainID.ACALA_MAINNET:
        case ChainID.MANDALA_TESTNET:
        case ChainID.REI_MAINNET:
        case ChainID.REI_TESTNET:
        case ChainID.CALLISTO_MAINNET:
        case ChainID.OASIS_EMERALD:
        case ChainID.OASIS_SAPPHIRE:
        case ChainID.OASIS_SAPPHIRE_TESTNET:
            return new BlockScoutOldClient(chainId)
        case ChainID.IMMUTABLE_MAINNET:
        case ChainID.IMMUTABLE_TESTNET:
        case ChainID.CANTO_MAINNET:
        case ChainID.MANTA_PACIFIC:
        case ChainID.MANTA_TESTNET:
        // case ChainID.ZETACHAIN_MAINNET:
        case ChainID.ZETACHAIN_TESTNET:
        case ChainID.FUSE_MAINNET:
        case ChainID.FUSE_SPARK:
        // case ChainID.ASTAR_MAINNET:
        // case ChainID.SHIDEN_MAINNET:
        // case ChainID.SHUBIYA_TESTNET:
        case ChainID.LUKSO_MAINNET:
        case ChainID.LUKSO_TESTNET:
        case ChainID.ZORA_NETWORK_MAINNET:
        case ChainID.NEON_MAINNET:
        case ChainID.NEON_TESTNET:
        case ChainID.AURORA_MAINNET:
        case ChainID.AURORA_TESTNET:
        case ChainID.PUBLIC_GOOD_NETWORK:
        case ChainID.PUBLIC_GOOD_NETWORK_SEPOLIA:
        case ChainID.ROOTSTOCK_MAINNET:
        case ChainID.ROOTSTOCK_TESTNET:
        case ChainID.LIGHTLINK_PHOENIX_MAINNET:
        case ChainID.LIGHTLINK_PEGASUS_TESTNET:
            return new BlockScoutClient(chainId)
        case ChainID.XDC_MAINNET:
            return new XdcScanClient(chainId)
        case ChainID.RONIN_MAINNET:
        case ChainID.RONIN_SAIGON_TESTNET:
            return new RoninChainClient(chainId)
        case ChainID.CONFLUX_MAINNET:
        case ChainID.CONFLUX_TESTNET:
            return new ConfluxScanClient(chainId)
        case ChainID.FILECOIN_MAINNET:
        case ChainID.FILECOIN_CALIBRATION:
            return new FilScanClient(chainId)
        case ChainID.TRON_MAINNET:
        case ChainID.TRON_NILE_TESTNET:
        case ChainID.TRON_SHASTA_TESTNET:
            return new TronScanClient(chainId)
        case ChainID.VICTION_MAINNET:
        case ChainID.VICTION_TESTNET:
            return new VicScanClient(chainId)
        case ChainID.PALM_MAINNET:
        case ChainID.PALM_TESTNET:
        case ChainID.METER_MAINNET:
        case ChainID.METER_TESTNET:
            return new ChainLensClient(chainId)
        default:
            return new EtherScanClient(chainId)
    }
}