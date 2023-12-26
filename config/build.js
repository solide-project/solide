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
            fs.copyFileSync(sourceFile, destinationFile);
        }
    });
}

// Example usage
const library = [
    "@chainlink/contracts",
    "@openzeppelin/contracts",
    "@openzeppelin/contracts-upgradeable",
    "@uniswap/v3-core",
    "@uniswap/v3-periphery",
    "solmate",
    "@tableland/evm/contracts",
    "erc721a-upgradeable",
    "@arbitrum/nitro-contracts",
    // "@oceanprotocol/contracts",
];

library.forEach((lib) => {
    const sourceFolder = `node_modules/${lib}`;
    const destinationFolder = `public/${lib}`;

    // Create destination folder if it doesn't exist
    fs.mkdirSync(destinationFolder, { recursive: true });

    copyFolderRecursiveSync(sourceFolder, destinationFolder);
    console.log(`Folder copied from '${sourceFolder}' to '${destinationFolder}' successfully.`);
});
