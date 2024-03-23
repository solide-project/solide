import { cn } from "@/lib/utils"
import { useFileSystem } from "@/components/main/file-explorer/file-provider"

interface IDEHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export function IDEHeader({ children, className }: IDEHeaderProps) {
  const { selectedFile } = useFileSystem()

  return (
    <div
      className="flex items-center justify-center text-center"
      style={{ height: "5vh" }}
    >
      <span className="rounded-md border bg-grayscale-025 px-16 py-1">
        {selectedFile.filePath || "Contract.sol"}
      </span>
    </div>
  )
}
