"use client"

import { useState } from "react"
import {
  Check,
  FileBox,
  FilePlus,
  FolderClosed,
  FolderOpen,
  FolderPlus,
  Trash
} from "lucide-react"

import { VFSFile, VFSNode, isVFSFile } from "@/lib/core"

import { useEditor } from "../providers/editor-provider"
import { useFileSystem } from "../providers/file-provider"
import { Title } from "../components/title"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuShortcut,
} from "@/components/ui/context-menu"
import { Input } from "@/components/ui/input"
import { useLogger } from "@/components/core/providers/logger-provider"

interface FileTreeNodeProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string
  node: VFSNode | VFSFile
  depth: number,
  fullPath: string,
}

const iconsProps = {
  size: 18,
  className: "shrink-0",
}
const FileTreeNode = ({ name, node, depth, fullPath }: FileTreeNodeProps) => {
  const ide = useEditor()
  const logger = useLogger()
  const { removeFile, writeFile, writeFolder, renameFile } = useFileSystem()

  const [isExpanded, setIsExpanded] = useState(false)
  const [newName, setNewName] = useState("")

  if (isVFSFile(node)) {
    return <ContextMenu>
      <ContextMenuTrigger>
        <div onClick={() => ide.selectFile(node as VFSFile)}
          className="group hover:bg-secondary flex items-center justify-between cursor-pointer pl-[16px] pr-[4px]">
          <div className="flex items-center space-x-1">
            <FileBox {...iconsProps} />
            <div className="truncate">
              {name} {fullPath} {depth}
            </div>
          </div>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuSub>
          <ContextMenuSubTrigger>Rename</ContextMenuSubTrigger>
          <ContextMenuSubContent className="flex items-center space-x-4">
            <Input onChange={(e) => setNewName(e.target.value)} value={newName} />
            <Check onClick={() => {
              const isValid = /^[a-zA-Z0-9-_]+$/.test(newName);
              if (!isValid) {
                logger.error("Invalid file name. Only alphanumeric characters, dashes, and underscores are allowed.")
                return;
              }

              logger.info(`Renaming file ${node.filePath} to  ${newName} ...`)
              renameFile(node.filePath, newName)
              setNewName("")
            }} />
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuItem onClick={() => removeFile(node.filePath)}>
          Delete
          <ContextMenuShortcut>
            <Trash size={14} />
          </ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  }

  return <div className={`${depth === 0 ? "pl-[4px]" : "pl-[16px]"}`}>
    <ContextMenu>
      <ContextMenuTrigger>
        <div onClick={() => node && setIsExpanded(!isExpanded)}
          className="hover:bg-secondary flex items-center cursor-pointer space-x-1 pl-[4px]">
          <div onClick={() => node && setIsExpanded(!isExpanded)}
            className="hover:bg-secondary flex items-center cursor-pointer space-x-1 pl-[4px]">
            <div className="flex items-center space-x-1">
              {isExpanded ? <FolderOpen {...iconsProps} /> : <FolderClosed {...iconsProps} />}
              <div className="truncate">
                {name} {fullPath} {depth}
              </div>
            </div>
          </div>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuSub>
          <ContextMenuSubTrigger>Rename</ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <Input />
            <Check />
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSub>
          <ContextMenuSubTrigger>Add</ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuItem onClick={() => {
              let writePath = ""
              if (depth === 0) {
                writePath = ""
              } else if (depth === 1) {
                writePath = `${name}/`
              } else {
                writePath = `${fullPath}/${name}/`
              }
              writeFile(`${writePath}text.txt`, "")
            }}>
              File
              <ContextMenuShortcut>
                <FilePlus size={14} />
              </ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem onClick={() => {
              let writePath = ""
              if (depth === 0) {
                writePath = ""
              } else if (depth === 1) {
                writePath = `${name}/`
              } else {
                writePath = `${fullPath}/${name}/`
              }
              writeFolder(`${writePath}folder`)
            }}>
              Folder
              <ContextMenuShortcut>
                <FolderPlus size={14} />
              </ContextMenuShortcut>
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuItem>
          Delete
          <ContextMenuShortcut>
            <Trash size={14} />
          </ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>

    {isExpanded && node && (<ul style={{ listStyleType: "none" }}>
      {Object.entries(node).map(([childName, childNode]) => <li key={childName}>
        <FileTreeNode name={childName} node={childNode} depth={depth + 1} fullPath={depth > 0 ? `${name}/${childName}` : ""} />
      </li>)}
    </ul>)}
  </div >
}

interface FileTreeProps extends React.HTMLAttributes<HTMLDivElement> {
  name?: string
}

export const FileTree = ({ className, name = "root" }: FileTreeProps) => {
  const { files } = useFileSystem()
  // const [fileData, setFileData] = useState<VFSNode>(files);

  // useEffect(() => {
  //   // To trigger render
  //   console.log("FileTree: files changed");
  //   setFileData(files);
  // }, [files]);

  if (!files) {
    return <div className={className}>Empty</div>
  }

  return <div className={className}>
    <Title text="File Tree" />
    <FileTreeNode name={name} node={files || {}} depth={0} fullPath="" />
  </div>
}

