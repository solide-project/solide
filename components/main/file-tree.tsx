"use client"

import { ChevronDown, ChevronRight, FileBox } from "lucide-react";
import { useState } from "react";
import { useSolideFile } from "../provider/file-provider";
import { SolideFile, isSolideFile } from '@/lib/solide/solide-file';
import { cn } from "@/lib/utils";

interface FileTreeNodeProps
    extends React.HTMLAttributes<HTMLDivElement> {
    name: string;
    node: any;
    depth: number
}

const FileTreeNode = ({ name, node, depth }: FileTreeNodeProps) => {
    const { handleIDEDisplay } = useSolideFile();
    const [isExpanded, setIsExpanded] = useState(false);

    const handleToggle = () => {
        setIsExpanded(!isExpanded);
    };

    const openFile = () => {
        handleIDEDisplay(node as SolideFile);
    };

    const getIndentStyle = () => {
        const baseIndent = 16; // Adjust as needed
        const indent = baseIndent; // * depth;
        return { marginLeft: `${indent}px` };
    };

    if (isSolideFile(node)) {
        return (
            <div onClick={openFile} style={getIndentStyle()}>
                <span className="cursor-pointer flex space-x-2"><FileBox /> {name}</span>
            </div>
        );
    }

    return (
        <div className="border-l dark:border-white" style={getIndentStyle()}>
            <div>
                <span onClick={node ? handleToggle : () => { }} className="cursor-pointer flex">
                    {isExpanded ? <ChevronDown /> : <ChevronRight />} {name}
                </span>
            </div>
            {isExpanded && node && (
                <ul style={{ listStyleType: 'none' }}>
                    {Object.entries(node).map(([childName, childNode]) => (
                        <li key={childName}>
                            <FileTreeNode name={childName} node={childNode} depth={depth + 1} />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

interface FileTreeProps
    extends React.HTMLAttributes<HTMLDivElement> {
    name?: string;
}

export const FileTree = ({ name = "root", className }: FileTreeProps) => {
    const { folder } = useSolideFile();

    if (!folder) {
        return <div className={cn("w-[350px]", className)}>Empty</div>
    }

    return (
        <div className={cn("w-[350px]", className)}>
            <FileTreeNode name={name} node={folder} depth={0} />
        </div>
    );
};