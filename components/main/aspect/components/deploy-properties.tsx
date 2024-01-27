"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { Trash } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface DeployPropertiesProps extends React.HTMLAttributes<HTMLDivElement> {
  setProperties: Function
}

export function DeployProperties({ setProperties }: DeployPropertiesProps) {
  const [items, setItems] = useState<Record<string, string>>({} as any)
  const [newKey, setNewKey] = useState<string>("")
  const [newValue, setNewValue] = useState<string>("")

  useEffect(() => {
    // Whenever items change, update the parent component's properties
    setProperties(items)
  }, [items])

  const handleAddItem = () => {
    if (newKey && newValue) {
      setItems((prevItems) => ({ ...prevItems, [newKey]: newValue }))
      setNewKey("")
      setNewValue("")
    }
  }

  const handleDeleteItem = (itemKey: string) => {
    setItems((prevItems: any) => {
      const updatedItems = { ...prevItems }
      delete updatedItems[itemKey]
      return updatedItems
    })
  }

  return (
    <div>
      <div className="grid grid-cols-12 gap-2">
        <div className="col-span-12 lg:col-span-6">
          <label>
            Key:
            <Input
              type="text"
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
            />
          </label>
        </div>
        <div className="col-span-12 lg:col-span-6">
          <label>
            Value:
            <Input
              type="text"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
            />
          </label>
        </div>
      </div>

      <div>
        <Button className="my-2" size="sm" onClick={handleAddItem}>
          Add Property
        </Button>

        <div>
          {Object.entries(items).map(([key, val]: [string, string]) => (
            <div>
              <div key={key} className="flex items-center space-x-3">
                <label htmlFor={key}>{`${key}: ${
                  val.length > 12 ? val.slice(0, 12) + "..." : val
                }`}</label>
                <Trash
                  onClick={() => handleDeleteItem(key)}
                  size={16}
                  color="red"
                  className="cursor-pointer"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
