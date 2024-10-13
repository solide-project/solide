const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { deleteNonSolFiles, deleteEmptyFolders } = require('./files');

// List of GitHub repositories to clone
const repos = [
  { repo: 'https://github.com/Uniswap/v4-core.git', name: "@uniswap/v4-core" },
  { repo: 'https://github.com/Uniswap/v4-core.git', name: "@uniswap/v4-core@pre", branch: "9293e5ab1deed87e03c176d8af94b1af19eb3900" },
  { repo: 'https://github.com/Uniswap/v4-periphery.git', name: "@uniswap/v4-periphery" },
];

const nodeModulesDir = "../"

if (!fs.existsSync(nodeModulesDir)) {
  fs.mkdirSync(nodeModulesDir);
}

function deleteFolderRecursive(folderPath) {
  if (fs.existsSync(folderPath)) {
    fs.rmSync(folderPath, { recursive: true, force: true });
    console.log(`Deleted existing directory: ${folderPath}`);
  }
}

repos.forEach(repo => {
  const targetDir = path.join(nodeModulesDir, repo.name);
  if (fs.existsSync(targetDir)) {
    deleteFolderRecursive(targetDir);
  }

  console.log(`Cloning ${repo.repo} into ${targetDir}...`);
  execSync(`git clone ${repo.repo} ${targetDir}`, { stdio: 'inherit' });

  if (repo.branch) {
    execSync(`git checkout ${repo.branch}`, { cwd: targetDir, stdio: 'inherit' });
  }

  deleteNonSolFiles(targetDir)
  deleteEmptyFolders(targetDir)
});

console.log('All repositories cloned!');