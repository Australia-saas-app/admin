"use client"

import { Modal } from "@/src/shared/ui/ui/modal"
import React, { useEffect, useState } from "react"
import TeamForm from "./TeamForm" // ✅ Ensure this points to TeamForm, not BlogForm
import { Loader2 } from "lucide-react"
import { PlatformItem, teamService } from "../../services/platform"

type Props = {
    open: boolean
    id: string | null
    onClose: () => void
    onUpdate: (data: any) => void 
}

const TeamEditModal: React.FC<Props> = ({
    open, id, onClose, onUpdate
}) => {
    const [initialData, setInitialData] = useState<PlatformItem | null>(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (open && id) {
            setLoading(true)
            teamService.getItem(id)
                .then((data) => setInitialData(data))
                .finally(() => setLoading(false))
        }
    }, [open, id])

    return (
        <Modal isOpen={open} onClose={onClose} title="Edit Team Member" size="lg">
            {loading ? (
                <div className="flex flex-col items-center justify-center p-10 gap-2">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <p className="text-sm text-gray-500 italic">Fetching details...</p>
                </div>
            ) : (
                <TeamForm
                    initial={initialData}
                    onCancel={onClose}
                    onSubmit={(data: any) => onUpdate(data)}
                />
            )}
        </Modal>
    )
}

export default TeamEditModal