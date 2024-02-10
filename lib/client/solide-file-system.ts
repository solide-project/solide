import JSZip from 'jszip';

export interface SolideFile {
  content: string
  filePath: string
}

export function isSolideFile(obj: any): obj is SolideFile {
  return (
    typeof obj === "object" &&
    "content" in obj &&
    "filePath" in obj &&
    typeof obj.content === "string" &&
    typeof obj.filePath === "string"
  )
}

export class SolideFileSystem {
  fileSystem: any
  constructor() {
    this.fileSystem = {}
  }

  private createFolderStructure(root: Record<string, any>, zip: JSZip, path: string[] = []): void {
    for (const [key, value] of Object.entries(root)) {
      const newPath = [...path, key];

      if (isSolideFile(value)) {
        // It's a file
        console.log(newPath.join('/'), value.content);
        zip.file(newPath.join('/'), value.content);
      } else {
        // It's a folder
        const subFolder = zip.folder(newPath.join('/')) as JSZip;
        this.createFolderStructure(value, subFolder, newPath);
      }
    }
  }

  async download(): Promise<Blob> {
    const zip = new JSZip();
    
    // this.createFolderStructure(this.fileSystem, zip, []);
    // const blob = await zip.generateAsync({ type: 'blob' });
    // console.log(blob.size, blob.type);
    // return blob;

    const sources = await this.generateSources();
    console.log(sources);
    Object.entries(sources).forEach(([key, val]) => {
      zip.file(key, val.content);
    });
    const blob = await zip.generateAsync({ type: 'blob' });
    console.log(blob.size, blob.type);
    return blob;
  }

  async init(sources: { [key: string]: { content: string } }) {
    this.fileSystem = {} // Reset file system

    Object.entries(sources).forEach(([key, val]) => {
      const pathArray = key.split("/")
      let currentLocation = this.fileSystem

      for (const folder of pathArray.slice(0, -1)) {
        if (!currentLocation[folder]) {
          currentLocation[folder] = {}
        }
        currentLocation = currentLocation[folder]
      }

      currentLocation[pathArray[pathArray.length - 1]] = {
        content: val.content,
        filePath: key,
      } as SolideFile
    })
  }

  async updateFile(filePath: string, content: string) {
    const paths = filePath.split("/")

    // Create a backup of the original structure
    let currentLocation = { ...this.fileSystem }
    let originalStructure = { ...this.fileSystem }

    for (const folder of paths.slice(0, -1)) {
      if (!currentLocation[folder]) {
        currentLocation[folder] = {}
      }
      currentLocation = currentLocation[folder]
    }

    const fileName = paths[paths.length - 1]

    // Restore the original structure up to the point of the file
    currentLocation = originalStructure
    for (const folder of paths.slice(0, -1)) {
      currentLocation = currentLocation[folder]
    }

    // Update the content at the specified filePath
    currentLocation[fileName] = {
      content,
      filePath,
    } as SolideFile

    this.fileSystem = { ...originalStructure }
  }

  async generateSources(): Promise<Record<string, { content: string }>> {
    let obj = { ...this.fileSystem } // Create a copy of the file system
    let sources: Record<string, { content: string }> = {}

    const traverse = (currentObj: any) => {
      for (const key in currentObj) {
        if (isSolideFile(currentObj[key])) {
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
}
