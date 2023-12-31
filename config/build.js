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

// Example usage
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
    "cross-not-official",
    "@aave/periphery-v3",
    "@aave/core-v3",
    "arb-bridge-eth",
];

library.forEach((lib) => {
    const sourceFolder = `node_modules/${lib}`;
    const destinationFolder = `public/${lib}`;

    // Create destination folder if it doesn't exist
    fs.mkdirSync(destinationFolder, { recursive: true });

    copyFolderRecursiveSync(sourceFolder, destinationFolder);
    console.log(`Folder copied from '${sourceFolder}' to '${destinationFolder}' successfully.`);
});

library.forEach((lib) => {
    const destinationFolder = `public/${lib}`;
    try {
        deleteNonSolidityFiles(destinationFolder);
        console.log(`Finished cleaning ${destinationFolder}`);
    } catch (error) {
        console.error(`Error cleaning ${destinationFolder}: ${error.message}`);
    }
});