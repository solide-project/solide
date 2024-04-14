"use client"

import { useEffect, useState } from "react"
import { ChevronDown, ChevronRight, FileBox } from "lucide-react"

import { VFSFile, VFSNode, isVFSFile } from "@/lib/core/utils/interface"

import { useEditor } from "./providers/editor-provider"
import { useFileSystem } from "./providers/file-provider"
import { Title } from "./components/title"

interface FileTreeNodeProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string
  node: VFSNode | VFSFile
  depth: number
}

const FileTreeNode = ({ name, node, depth }: FileTreeNodeProps) => {
  const ide = useEditor()
  const [isExpanded, setIsExpanded] = useState(false)

  const openFile = () => {
    ide.selectFile(node as VFSFile)
  }

  const handleToggle = () => {
    setIsExpanded(!isExpanded)
  }

  const getIndentStyle = () => {
    const baseIndent = 16 // Adjust as needed
    const indent = baseIndent // * depth;
    return { paddingLeft: `${indent}px` }
  }

  if (isVFSFile(node)) {
    return (
      <div
        onClick={openFile}
        style={getIndentStyle()}
        className="hover:bg-secondary"
      >
        <span className="flex cursor-pointer space-x-2">
          <FileBox /> {name}
        </span>
      </div>
    )
  }

  return (
    <div className="border-l dark:border-white" style={getIndentStyle()}>
      <div>
        <span
          onClick={node ? handleToggle : () => {}}
          className="flex cursor-pointer"
        >
          {isExpanded ? <ChevronDown /> : <ChevronRight />} {name}
        </span>
      </div>
      {isExpanded && node && (
        <ul style={{ listStyleType: "none" }}>
          {Object.entries(node).map(([childName, childNode]) => (
            <li key={childName}>
              <FileTreeNode
                name={childName}
                node={childNode}
                depth={depth + 1}
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
  const { files } = useFileSystem()

  if (!files) {
    return <div className={`${className}`}>Empty</div>
  }

  return (
    <div className={`${className}`}>
      <Title text="File Tree" />
      <FileTreeNode name={name} node={files || {}} depth={0} />
    </div>
  )
}
