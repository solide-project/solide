"use client"

import path from "path"
import { useEffect, useState } from "react"
import {
  Check,
  FileBox,
  FilePlus,
  FolderClosed,
  FolderOpen,
  FolderPlus,
} from "lucide-react"

import { VFSFile, VFSNode, isVFSFile } from "@/lib/core/file-system/interfaces"
import { cn } from "@/lib/utils"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { Input } from "@/components/ui/input"
import { Title } from "@/components/core/components/title"
import {
  DeleteFileContextMenuItem,
  FileTreeContextMenuItem,
  FileTreeContextMenuSubTrigger,
} from "@/components/core/file/fs-context-menu"
import { useEditor } from "@/components/core/providers/editor-provider"
import { useFileSystem } from "@/components/core/providers/file-provider"
import { useLogger } from "@/components/core/providers/logger-provider"

interface FileTreeNodeProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string
  directory: string
  node: VFSNode | VFSFile
  depth: number
}

const menuClass = "p-0 py-1 px-2"
const nodeClass =
  "hover:bg-secondary flex items-center cursor-pointer space-x-1"
const iconsProps = {
  size: 18,
  className: "shrink-0",
}
const FileTreeNode = ({ name, directory, node, depth }: FileTreeNodeProps) => {
  const ide = useEditor()
  const logger = useLogger()
  const { vfs } = useFileSystem()

  const [isExpanded, setIsExpanded] = useState(false)
  const [newName, setName] = useState("")
  const [fullPath, setFullPath] = useState("")

  useEffect(() => {
    setName(name)
  }, [])

  useEffect(() => {
    setFullPath(directory + "/" + name)
    // setName(name)
  }, [path, name])

  if (isVFSFile(node)) {
    return (
      <ContextMenu>
        <ContextMenuTrigger
          onClick={() => ide.selectFile(node as VFSFile)}
          className={cn(nodeClass, "pl-[16px]")}
        >
          <FileBox {...iconsProps} />
          <div className="truncate">{name}</div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuSub>
            <FileTreeContextMenuSubTrigger className={menuClass}>
              Rename
            </FileTreeContextMenuSubTrigger>
            <ContextMenuSubContent className="flex items-center gap-2">
              <Input
                className="h-8 border-none"
                onChange={(e) => setName(e.target.value)}
                value={newName}
              />
              <Check
                size={16}
                className="hover:cursor-pointer hover:text-green-400"
                onClick={() => {
                  const isValid = /^[a-zA-Z0-9-_.]+$/.test(newName)
                  if (!isValid) {
                    logger.error(
                      "Invalid file name. Only alphanumeric characters, dashes, and underscores are allowed."
                    )
                    return
                  }

                  const { dir } = path.parse(fullPath)
                  const file = vfs.cat(fullPath)
                  // console.log(file.content)
                  vfs.touch(path.join(dir, newName), file.content)
                  vfs.rm(fullPath)

                  setName("")
                }}
              />
            </ContextMenuSubContent>
          </ContextMenuSub>
          <DeleteFileContextMenuItem onClick={() => vfs.rm(fullPath)} />
        </ContextMenuContent>
      </ContextMenu>
    )
  }

  return (
    <div className={`${depth === 0 ? "pl-[4px]" : "pl-[16px]"}`}>
      <ContextMenu>
        <ContextMenuTrigger
          onClick={() => node && setIsExpanded(!isExpanded)}
          className={cn(nodeClass, "pl-[4px]")}
        >
          {isExpanded ? (
            <FolderOpen {...iconsProps} />
          ) : (
            <FolderClosed {...iconsProps} />
          )}
          <div className="truncate">{name}</div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuSub>
            <FileTreeContextMenuSubTrigger>
              Rename
            </FileTreeContextMenuSubTrigger>
            <ContextMenuSubContent className="flex items-center gap-2">
              <Input
                className="h-8 border-none"
                onChange={(e) => setName(e.target.value)}
                value={newName}
              />
              <Check
                size={16}
                className="hover:cursor-pointer hover:text-green-400"
                onClick={() => {
                  const { dir } = path.parse(fullPath)
                  vfs.mv(fullPath, path.join(dir, newName))
                }}
              />
            </ContextMenuSubContent>
          </ContextMenuSub>
          <ContextMenuSub>
            <FileTreeContextMenuSubTrigger>Add</FileTreeContextMenuSubTrigger>
            <ContextMenuSubContent>
              <FileTreeContextMenuItem
                onClick={() => {
                  vfs.touch(path.join(fullPath, "text.txt"), "")
                }}
              >
                File
                <ContextMenuShortcut>
                  <FilePlus size={14} />
                </ContextMenuShortcut>
              </FileTreeContextMenuItem>
              <FileTreeContextMenuItem
                onClick={() => vfs.mkdir(path.join(fullPath, "new-folder"))}
              >
                Folder
                <ContextMenuShortcut>
                  <FolderPlus size={14} />
                </ContextMenuShortcut>
              </FileTreeContextMenuItem>
            </ContextMenuSubContent>
          </ContextMenuSub>
          <DeleteFileContextMenuItem onClick={() => vfs.rm(fullPath)} />
        </ContextMenuContent>
      </ContextMenu>

      {isExpanded && node && (
        <ul style={{ listStyleType: "none" }}>
          {Object.entries(node).map(([childName, childNode]) => (
            <li key={childName}>
              <FileTreeNode
                name={childName}
                node={childNode}
                depth={depth + 1}
                directory={fullPath}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

interface FileTreeProps extends React.HTMLAttributes<HTMLDivElement> {
  name?: string
}

export const FileTree = ({ className, name = "root" }: FileTreeProps) => {
  const { vfs } = useFileSystem()

  if (!vfs.vfs) {
    return <div className={className}>Empty</div>
  }

  return (
    <div className={className}>
      <Title text="File Tree" />
      {/* <FileTreeNode name={name} node={vfs.vfs || {}} depth={0} path="" /> */}
      {Object.keys(vfs.vfs).map((name, index) => {
        return (
          <FileTreeNode
            key={index}
            name={name}
            node={vfs.vfs[name] || {}}
            depth={0}
            directory=""
          />
        )
      })}
    </div>
  )
}
