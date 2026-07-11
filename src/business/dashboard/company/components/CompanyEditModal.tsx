"use client"

import { Modal } from "@/src/shared/ui/ui/modal"
import CompanyForm from "./CompanyForm"
import React, { useEffect, useState } from "react"
import { companyService,  PlatformItem } from "../../services/platform"



const CompanyEditModal = ({ isOpen, id, onClose, onUpdate }: any) => {
    const [initialData, setInitialData] = useState<PlatformItem | null>(null)
        const [loading, setLoading] = useState(false)
    
        useEffect(() => {
            if (isOpen && id) {
                setLoading(true)
                companyService.getItem(id)
                    .then((data) => setInitialData(data))
                    .finally(() => setLoading(false))
            }
        }, [isOpen, id])
    
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Edit Company" size="lg">
            <div className="">
                            {loading ? (
                                <div className="p-8 text-center text-gray-500 italic">Loading company info...</div>
                            ) : initialData ? (
                                <CompanyForm
                                    initial={initialData}
                                    onCancel={onClose}
                                    onSubmit={(data: any) => onUpdate(data)} // Sends data back to Page.tsx
                                />
                            ) : (
                                <div className="p-8 text-center text-red-500">Failed to load company info.</div>
                            )}
                        </div>
        </Modal>
    )
}

export default CompanyEditModal
