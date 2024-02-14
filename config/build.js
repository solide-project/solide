const fs = require('fs');
const path = require('path');

function copyFolderRecursiveSync(sourcePath, destinationPath) {
    // Create destination folder if it doesn't exist
    if (!fs.existsSync(destinationPath)) {
        fs.mkdirSync(destinationPath);
    }

    // Get all files and subdirectories in the source folder
    const files = fs.readdirSync(sourcePath);

    files.forEach((file) => {
        const sourceFile = path.join(sourcePath, file);
        const destinationFile = path.join(destinationPath, file);

        // Check if the current item is a file or directory
        const isDirectory = fs.statSync(sourceFile).isDirectory();

        if (isDirectory) {
            // Recursively copy subdirectories
            copyFolderRecursiveSync(sourceFile, destinationFile);
        } else {
            // Copy the file
            // if (path.extname(file).toLowerCase() === '.sol') {
            fs.copyFileSync(sourceFile, destinationFile);
            // }
        }
    });
}

function deleteNonSolidityFiles(directory) {
    const files = fs.readdirSync(directory);

    files.forEach((file) => {
        const filePath = path.join(directory, file);

        if (fs.statSync(filePath).isDirectory()) {
            // Recursively delete files in subdirectories
            deleteNonSolidityFiles(filePath);
        } else {
            // Check if the file is a Solidity file (ends with ".sol")
            if (path.extname(filePath).toLowerCase() !== '.sol') {
                // console.log(`Deleting: ${filePath}`);
                fs.unlinkSync(filePath);
            }
        }
    });
}

function deleteEmptyFoldersRecursiveSync(directory) {
    if (!fs.existsSync(directory)) {
        return;
    }

    const contents = fs.readdirSync(directory);
    if (contents.length === 0) {
        fs.rmdirSync(directory);
        // Recursively check parent directories
        deleteEmptyFoldersRecursiveSync(path.dirname(directory));
        return;
    }

    contents.forEach(item => {
        const itemPath = path.join(directory, item);
        if (fs.statSync(itemPath).isDirectory()) {
            deleteEmptyFoldersRecursiveSync(itemPath);
        }
    });

    // Check if the directory is now empty after recursive deletion
    if (fs.readdirSync(directory).length === 0) {
        fs.rmdirSync(directory);
        // Recursively check parent directories
        deleteEmptyFoldersRecursiveSync(path.dirname(directory));
    }
}

// const library = ["@uniswap/v2-core", "@uniswap/v2-periphery"]
const library = [
    "@chainlink/contracts",
    "@chainlink/contracts-ccip",
    "@openzeppelin/contracts",
    "@openzeppelin/contracts-upgradeable",
    "@uniswap/v3-core",
    "@uniswap/v3-periphery",
    "solmate",
    "@tableland/evm/contracts",
    "erc721a-upgradeable",
    "@arbitrum/nitro-contracts",
    "@arbitrum/token-bridge-contracts",
    "@balancer-labs/v2-vault",
    "@balancer-labs/v2-interfaces",
    "@balancer-labs/v2-solidity-utils",
    "@balancer-labs/v2-pool-utils",
    "@aave/periphery-v3",
    "@aave/core-v3",
    "@aave/aave-token",
    "@oasisprotocol/sapphire-contracts",
    "@imtbl/contracts",
    "@axelar-network/axelar-gmp-sdk-solidity",
    "openzeppelin-contracts",
    "@lukso/lsp-smart-contracts",
    "@0x/contracts-treasury",
    "@0x/contracts-utils",
    "@0x/contracts-erc20",
    "@0x/contracts-zero-ex",
    "@jbx-protocol/juice-contracts-v3",
    "@jbx-protocol/juice-delegates-registry",
    "@jbx-protocol/contracts-v2",
    "@prb/math",
    "@account-abstraction/contracts",
    "@dydxprotocol/perpetual",
    "@dydxprotocol/solo",
    "@dydxprotocol/protocol",
    "erc721a",
    "erc721a-upgradeable",
    "@chiru-labs/pbt",
    "synthetix",
    "seaport-types",
    "@paulrberg/contracts",
    "@uniswap/universal-router", 
    "solady",

    // Deceprecated
    "@0x/contracts-asset-proxy",
    "arb-bridge-eth",
    "openzeppelin-solidity",
    "cross-not-official",
    "prb-math",
    "@uniswap/lib",
    "@uniswap/v2-core",
    "@uniswap/v2-periphery",
    "base64-sol",
    "@uniswap/swap-router-contracts",
    "@uniswap/v3-staker",

    // Note these are from git clone: 13/02/24
    "permit2",                                          // git clone https://github.com/Uniswap/permit2
    "@uniswap/v4-core",                                 // git clone https://github.com/Uniswap/v4-core
    "@uniswap/v4-periphery",                            // git clone https://github.com/Uniswap/v4-periphery
    "@jbx-protocol/juice-ownable",                      // git clone https://github.com/jbx-protocol/juice-ownable.git
    "@jbx-protocol/juice-delegate-metadata-lib",        // git clone https://github.com/jbx-protocol/juice-delegate-metadata-lib
    "@openzeppelin/contracts@3.4.0",
    "@openzeppelin/contracts@4.5.0",
    "@openzeppelin/contracts@4.7.0",
    "@openzeppelin/contracts@4.9.0",
    "@openzeppelin/contracts-upgradeable@3.4.0",
    "@openzeppelin/contracts-upgradeable@4.7.0",
    "@uniswap/v3-core@1.0.0",
    "@uniswap/v3-periphery@1.0.0",
];

library.forEach((lib) => {
    const sourceFolder = `node_modules/${lib}`;
    const destinationFolder = `public/${lib}`;

    if (!fs.existsSync(sourceFolder)) {
        return;
    }

    // Create destination folder if it doesn't exist
    fs.mkdirSync(destinationFolder, { recursive: true });

    copyFolderRecursiveSync(sourceFolder, destinationFolder);
    console.log(`Folder copied from '${sourceFolder}' to '${destinationFolder}' successfully.`);
});

library.forEach((lib) => {
    const destinationFolder = `public/${lib}`;
    try {
        deleteNonSolidityFiles(destinationFolder);
        deleteEmptyFoldersRecursiveSync(destinationFolder);
        console.log(`Finished cleaning ${destinationFolder}`);
    } catch (error) {
        console.error(`Error cleaning ${destinationFolder}: ${error.message}`);
    }
});