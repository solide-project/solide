import path from "path"
import { isNull, isVFSFile, Sources, VFSFile, VFSNode } from "./interfaces";

export class MemoryFS {
    vfs: VFSNode

    constructor() {
        this.vfs = {} as VFSNode
    }

    public ls(filePath: string) {
        let curr: VFSNode | VFSFile = this.vfs;
        const arr = filePath.split("/").filter(segment => segment);
        for (const segment of arr) {
            if (isNull(curr[segment])) {
                throw new Error("File not found")
            }

            if (isVFSFile(curr[segment])) {
                return [segment]
            }

            curr = curr[segment]
        }

        return Object.keys(curr).sort()
    }

    public mkdir(filePath: string) {
        let curr: VFSNode | VFSFile = this.vfs;
        const arr = filePath.split("/").filter(segment => segment);
        for (const segment of arr) {
            // Create directory if it doesn't exist
            if (isNull(curr[segment])) {
                curr[segment] = {}
            }

            // Type error if path exist and is a file
            if (isVFSFile(curr[segment])) {
                throw new Error(`MemoryFS: cannot create directory ${filePath}: File exists`)
            }

            curr = curr[segment] as VFSNode
        }
    }

    public touch(filePath: string, content: string = "") {
        const { dir, base } = path.parse(filePath)

        let curr: VFSNode | VFSFile = this.vfs;
        const arr = filePath.split("/").filter(segment => segment);
        for (const segment of arr) {
            if (isNull(curr[segment])) {
                curr[segment] = {}
            }
            curr = curr[segment] as VFSNode
        }

        curr[base].content = content
        curr[base].filePath = filePath
    }

    public cat(filePath: string) {
        let curr: VFSNode | VFSFile = this.vfs;
        const arr = filePath.split("/").filter(segment => segment);
        for (const segment of arr) {
            if (isNull(curr[segment])) {
                throw new Error("File not found")
            }

            if (isVFSFile(curr[segment])) {
                return curr[segment] as VFSFile
            }

            curr = curr[segment]
        }

        return curr
    }

    public pack(filePath: string = ""): Sources {
        const sources: Sources = {};

        const traverse = (node: VFSNode, path: string): void => {
            for (const key in node) {
                const newPath = path ? `${path}/${key}` : key;
                const value = node[key];
                if (isVFSFile(value)) {
                    sources[newPath] = { content: value.content };
                } else {
                    traverse(value, newPath);
                }
            }
        };

        let curr = this.vfs;
        if (filePath) {
            const arr = filePath.split("/").filter(segment => segment)
            for (const segment of arr) {
                if (!curr[segment]) {
                    throw new Error("File not found")
                }

                if (typeof curr[segment] === "string") {
                    return { [filePath]: { content: curr[segment] } }
                }

                curr = curr[segment] as VFSNode
            }
        }
        traverse(this.vfs, '');
        return sources;
    }

    public rm(filePath: string) {
        const { dir, base } = path.parse(filePath)
        let curr: VFSNode | VFSFile = this.vfs;
        const arr = dir.split("/").filter(segment => segment);
        for (const segment of arr) {
            if (isNull(curr[base])) {
                throw new Error("File not found")
            }
            curr = curr[segment] as VFSNode
        }

        if (isNull(curr[base])) {
            throw new Error("File not found")
        }

        delete curr[base]
    }

    public mv(oldPath: string, newPath: string) {
        this.mkdir(newPath)

        const sources = this.pack(oldPath)

        this.rm(oldPath)
        Object.entries(sources).forEach(([key, value]) => {
            this.touch(key.replace(oldPath, newPath), value.content)
        })
    }
}