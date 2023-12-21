"use client";

import { CopyText, CopyTextItem } from "@/components/main/copy-text";

interface ContractMetadataProps
    extends React.HTMLAttributes<HTMLDivElement> {
    items: CopyTextItem[];
}

export function ContractMetadata({ items }: ContractMetadataProps) {
    return (
        <div className="container my-1 grid grid-cols-12 gap-4 lg:col-span-4">
            {items.map((item: CopyTextItem, index) => {
                return (
                    <div key={index} className="col-span-12 flex justify-center lg:col-span-4">
                        <CopyText title={item.title} payload={item.payload} />
                    </div>
                )
            })}
        </div>
    )
}