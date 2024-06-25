"use client"

import React, { createContext, useContext, useState } from "react"

import {
  Sources,
  VFSFile,
  VFSNode,
  isVFSFile,
} from "@/lib/core/utils/interface"
import path, { parse } from "path"

/**
 * VFS Provider to handle files and folders in the IDE
 */
export const FileSystemProvider = ({ children }: FileSystemProviderProps) => {
  const [files, setFiles] = useState<VFSNode>({})

  const clear = () => {
    setFiles({})
  }

  const writeFile = (path: string, content: Buffer | string): void => {
    setFiles((currentFiles) => {
      const pathArray = path.split("/")
      let newFiles = { ...currentFiles } // Create a shallow copy at the top level

      let currentLocation = newFiles

      for (const folder of pathArray.slice(0, -1)) {
        if (!currentLocation[folder]) {
          currentLocation[folder] = {}
        } else {
          // Ensure a new object is created for each nested level to avoid direct mutation
          currentLocation[folder] = { ...currentLocation[folder] }
        }
        currentLocation = currentLocation[folder] as VFSNode
      }

      currentLocation[pathArray[pathArray.length - 1]] = {
        content: content.toString(),
        filePath: path,
      } as VFSFile

      return newFiles // Return the new state
    })
  }

  const readFile = (path: string): VFSFile | undefined => {
    const pathArray = path.split("/")
    let currentLocation = files

    for (const folder of pathArray) {
      if (!currentLocation[folder]) {
        return undefined
      }
      currentLocation = currentLocation[folder] as VFSNode
    }

    return currentLocation[pathArray[pathArray.length - 1]] as VFSFile
  }

  const init = (sources: { [key: string]: { content: string } }) => {
    clear()

    Object.entries(sources).forEach(([key, val]) => {
      writeFile(key, val.content)
    })
  }

  const initAndFoundEntry = async (sources: { [key: string]: { content: string } }, entry: string) => {
    await init(sources)

    const entryFile = Object.entries(sources).find(([key, _]) =>
      path.basename(key).startsWith(path.basename(entry))
    )

    if (entryFile) {
      return {
        content: entryFile[1].content.toString(),
        filePath: entryFile[0],
      } as VFSFile
    }

    return undefined
  }

  const generateSources = (): Sources => {
    let obj = { ...files } // Create a copy of the file system
    let sources: Sources = {}

    const traverse = (currentObj: any) => {
      for (const key in currentObj) {
        if (isVFSFile(currentObj[key])) {
          sources[currentObj[key].filePath] = {
            content: currentObj[key].content,
          }
        } else if (typeof currentObj[key] === "object") {
          traverse(currentObj[key])
        }
      }
    }

    traverse(obj)

    return sources
  }

  const count = (): number => {
    let count = 0

    // Recursive helper function to traverse the VFSNode
    function traverse(currentNode: VFSNode) {
      for (const key in currentNode) {
        const childNode = currentNode[key]
        if (isVFSFile(childNode)) {
          // If childNode is a VFSFile, increment the count
          count++
        } else if (isVFSFile(childNode)) {
          // If childNode is a VFSNode, recursively traverse it
          traverse(childNode)
        }
      }
    }

    // Start traversing from the root node
    traverse(files)

    return count
  }

  const removeFile = (path: string) => {
    setFiles(prevFiles => {
      const parts = path.split('/');
      let current: VFSNode | undefined = prevFiles;

      // Traverse through the VFS to reach the parent directory of the file
      for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i];
        if (current && typeof current[part] === 'object') {
          current = current[part] as VFSNode;
        } else {
          // Directory not found or invalid path
          return prevFiles;
        }
      }

      // Get the file name
      const fileName = parts[parts.length - 1];

      // Delete the file if it exists in the parent directory
      if (current && typeof current[fileName] === 'object') {
        delete current[fileName];
      }

      return { ...prevFiles }; // Return a new object to trigger state update
    });
  };

  const writeFolder = (path: string) => {
    console.log('writeFolder', path);
    setFiles(prevFiles => {
      const parts = path.split('/');
      let current: VFSNode | undefined = prevFiles;

      // Traverse through the VFS to reach the parent directory of the folder
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (current && typeof current[part] === 'object') {
          current = current[part] as VFSNode;
        } else {
          current[part] = {};
          current = current[part] as VFSNode;
        }
      }

      return { ...prevFiles };
    });
  }

  const renameFile = (path: string, name: string): void => {
    setFiles(prevFiles => {
      const parts = path.split('/');
      const oldName = parts.pop();
      const parentPath = parts.join('/');
      let current: VFSNode | undefined = prevFiles;

      // Traverse through the VFS to reach the parent directory of the node
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (current && typeof current[part] === 'object') {
          current = current[part] as VFSNode;
        } else {
          return prevFiles; // Return previous state if path is invalid
        }
      }

      if (current && oldName && current[oldName]) {
        console.log('renameFile', current[oldName]);
        const { ext } = parse(path)
        const newName = `${name}${ext}`;
        current[newName] = current[oldName];
        delete current[oldName];

        // Update filePath if it's a file
        if ('filePath' in current[name]) {
          console.log('renameFile', current[name]);
          (current[name] as VFSFile).filePath = `${parentPath}/${newName}`;
        }

        return { ...prevFiles }; // Return new state with updated name
      }

      return prevFiles;
    });
  };

  return (
    <FileContext.Provider
      value={{
        files,
        clear,
        writeFile,
        readFile,
        init,
        initAndFoundEntry,
        generateSources,
        count,
        removeFile,
        writeFolder,
        renameFile,
      }}
    >
      {children}
    </FileContext.Provider>
  )
}

interface FileSystemProviderProps extends React.HTMLAttributes<HTMLDivElement> {
  name?: string
}

export const FileContext = createContext({
  files: {},
  clear: () => { },
  writeFile: (path: string, content: Buffer | string) => { },
  readFile: (path: string): VFSFile | undefined => undefined,
  init: (sources: { [key: string]: { content: string } }) => { },
  initAndFoundEntry: async (sources: { [key: string]: { content: string } }, entry: string): Promise<VFSFile | undefined> => undefined,
  generateSources: (): Sources => ({}),
  count: (): number => 0,
  removeFile: (path: string) => { },
  writeFolder: (path: string) => { },
  renameFile: (path: string, name: string) => { },
})

export const useFileSystem = () => useContext(FileContext)
