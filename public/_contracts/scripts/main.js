const fs = require('fs');
const { packageInfo, packageName } = require('./helpers');
const { copyFolderSync, deleteEmptyFolders } = require('./files');

console.log('Running script...');
const currentDirectory = process.cwd().replace(/\\/g, '/');
console.log(`Current directory: ${currentDirectory}`);

const packageJson = fs.readFileSync('./package.json', 'utf8');
const packageData = JSON.parse(packageJson);

// Copy all dependencies to the public folder
Object.entries(packageData.dependencies).forEach(([package, value]) => {
    const info = packageInfo(package)
    const name = packageName(info);

    // Manually remap some packages
    if (info.name.includes('solmate')) {
        package = `${package}/src`
    }
    
    console.log(package, name);
    copyFolderSync(`./node_modules/${package}`, `../${name}`)
    deleteEmptyFolders(`../${name}`)
});

// Delete all non Solidity files
Object.entries(packageData.devDependencies).forEach(([package, value]) => {
    const info = packageInfo(package)
    const name = packageName(info);
    console.log(package, name);
    copyFolderSync(`./node_modules/${package}`, `../${name}`)
    deleteEmptyFolders(`../${name}`)
});