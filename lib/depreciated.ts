// async function extractImports(content: any, mainPath: any = ""): Promise<ContractDependency[]> {
//     // Regular expression to match import statements
//     const regex = /import\s+["']([^"']+)["'];|import\s+{[^}]+}\s+from\s+["']([^"']+)["'];/g;

//     // Extract imports
//     const matches: ContractDependency[] = [];
//     let match;
//     while ((match = regex.exec(content)) !== null) {
//         const filePath = getNormalizedDependencyPath(match[1] || match[2], mainPath)

//         const resolved = await resolve(filePath);
//         matches.push({
//             filePath: filePath,
//             fileContents: resolved.fileContents
//         });

//         // console.log(resolved.fileContents);
//         matches.push(...await extractImports(resolved.fileContents, filePath))
//     }

//     return matches;
// }

export {}