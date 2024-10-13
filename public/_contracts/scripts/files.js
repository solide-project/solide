const fs = require('fs');
const path = require('path');

function copyFolderSync(source, target) {
    // Ensure target folder exists, creating parent directories if necessary
    fs.mkdirSync(target, { recursive: true });

    // Read contents of source folder
    const files = fs.readdirSync(source);

    // Iterate through files in source folder
    files.forEach((file) => {
        const currentPath = path.join(source, file);
        const targetPath = path.join(target, file);

        // If it's a directory, recursively copy
        if (fs.statSync(currentPath).isDirectory()) {
            copyFolderSync(currentPath, targetPath);
        } else {
            // If it's a solidity file, copy it
            if (path.extname(currentPath) === '.sol') {
                fs.copyFileSync(currentPath, targetPath);
            }
        }
    });
}

function deleteEmptyFolders(directory) {
    // Read contents of the directory
    const files = fs.readdirSync(directory);

    // Iterate through files in the directory
    files.forEach((file) => {
        const filePath = path.join(directory, file);

        // If it's a directory, recursively check and delete if empty
        if (fs.statSync(filePath).isDirectory()) {
            deleteEmptyFolders(filePath);

            // Check if the directory is empty after recursive deletion
            if (isEmptyDirectory(filePath)) {
                fs.rmdirSync(filePath); // Delete the directory
            }
        }
    });
}

function isEmptyDirectory(directory) {
    // Check if the directory exists
    if (!fs.existsSync(directory)) {
        return false;
    }

    // Read contents of the directory
    const files = fs.readdirSync(directory);

    // If the directory is empty, return true; otherwise, return false
    return files.length === 0;
}

function deleteNonSolFiles(dir) {
    fs.readdirSync(dir).forEach(file => {
        const filePath = path.join(dir, file);

        if (fs.statSync(filePath).isDirectory()) {
            deleteNonSolFiles(filePath);
        } else if (path.extname(file) !== '.sol') {
            fs.unlinkSync(filePath);
        }
    });
}

module.exports = { copyFolderSync, deleteEmptyFolders, deleteNonSolFiles };
