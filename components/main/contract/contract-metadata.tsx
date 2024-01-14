"use client";

import { CopyText, CopyTextItem } from "@/components/main/copy-text";
import { Button } from "@/components/ui/button";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronDown, ChevronLeft, ChevronUp } from "lucide-react";
import { useState } from "react";

interface ContractMetadataProps
    extends React.HTMLAttributes<HTMLDivElement> {
    items: CopyTextItem[];
}

export function ContractMetadata({ items }: ContractMetadataProps) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="my-1 gap-2">
            <Collapsible
                open={isOpen}
                onOpenChange={setIsOpen}
            >
                <CollapsibleTrigger className="flex justify-between items-center w-full">
                    <div>
                        Metadata
                    </div>
                    <Button size="icon" variant="secondary">
                        {isOpen ? <ChevronUp /> : <ChevronDown />}
                    </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className=" max-h-[256px] overflow-y-auto">
                    {items.map((item: CopyTextItem, index) => {
                        return (
                            <div key={index} className="">
                                <CopyText title={item.title} payload={item.payload} />
                            </div>
                        )
                    })}
                </CollapsibleContent>
            </Collapsible>
        </div>
    )
}