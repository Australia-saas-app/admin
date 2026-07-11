"use client"

import Modal from "@/src/shared/ui/ui/modal"
import React from "react"
import GlobalBranchForm from "./GlobalBranchForm"

type Props = {
  isOpen: boolean
  onClose: () => void
  onCreate: (payload: { name: string; call?: string; email?: string; officeAddress?: string; socialLinks?: Array<{ platform: string; url: string }>; flag?: File | null }) => void
}

const GlobalBranchCreateModal: React.FC<Props> = ({ isOpen, onClose, onCreate }) => {
  const handleSubmit = (data: any, flag?: File | null, socialLinks?: Array<{ platform: string; url: string }>) => {
    onCreate({ name: data.name, call: data.call, email: data.email, officeAddress: data.officeAddress, socialLinks, flag })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Global Branch" size="md">
      <GlobalBranchForm onSubmit={handleSubmit} onCancel={onClose} />
    </Modal>
  )
}

export default GlobalBranchCreateModal
