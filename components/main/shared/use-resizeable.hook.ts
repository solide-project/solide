import { useState } from "react"

export const useResizables = () => {
  const [isFileSytemVisible, setIsFileSytemVisible] = useState(false)
  const toggleFileSytemVisible = () => {
    setIsFileSytemVisible(!isFileSytemVisible)
  }

  const [isEditorVisible, setIsEditorVisible] = useState(true)
  const toggleEditorVisible = () => {
    setIsEditorVisible(!isEditorVisible)
  }

  const [isContractVisible, setIsContractVisible] = useState(true)
  const toggleIsContractVisible = () => {
    setIsContractVisible(!isContractVisible)
  }

  return {
    isFileSytemVisible,
    toggleFileSytemVisible,
    isEditorVisible,
    toggleEditorVisible,
    isContractVisible,
    toggleIsContractVisible,
  }
}
