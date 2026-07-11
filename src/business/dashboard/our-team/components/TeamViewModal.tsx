"use client"

import { Badge } from "@/src/shared/ui/ui/badge"
import { Modal } from "@/src/shared/ui/ui/modal"
import Image from "next/image"
import React from "react"

interface TeamMember {
    firstName?: string | null
    lastName?: string | null
    position?: string | null
    department?: string | null
    employeeId?: string | null
    salary?: string | number | null
    bio?: string | null
    photoUrl?: string | null
    linkedinUrl?: string | null
    isVisible?: boolean
    displayOrder?: number | null
    createdAt?: string | null
    updatedAt?: string | null
}

interface TeamViewModalProps {
    isOpen: boolean
    onClose: () => void
    data: TeamMember | null
    loading?: boolean
}

const formatDateTime = (value?: string | null) => {
    if (!value) return "N/A"
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return "N/A"
    return date.toLocaleString()
}

const formatSalary = (value?: string | number | null) => {
    if (value === null || value === undefined || value === "") return "N/A"
    const numeric = typeof value === "number" ? value : Number(value)
    if (Number.isNaN(numeric)) return String(value)
    return `$${numeric.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export const TeamViewModal: React.FC<TeamViewModalProps> = ({ isOpen, onClose, data, loading }) => {
    if (!isOpen) return null

    const fullName = [data?.firstName, data?.lastName].filter(Boolean).join(" ") || "Unnamed Team Member"
    const initials = `${data?.firstName?.[0] || ""}${data?.lastName?.[0] || ""}` || "TM"
    const hasLinkedin = Boolean(data?.linkedinUrl)
    const bioHtml = data?.bio?.trim() ? data.bio : "<i>No bio provided.</i>"

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="View Team Member" size="lg">
            <div className="flex flex-col gap-6 py-4">
                {loading ? (
                    <div className="text-center py-10 text-gray-500 italic">Loading details...</div>
                ) : !data ? (
                    <div className="text-center py-10 text-red-500">Failed to load details.</div>
                ) : (
                    <div className="space-y-6">
                        <div className="flex gap-6 items-start">
                            <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-100 border-2 border-primary/20 shrink-0">
                                {data.photoUrl ? (
                                    <Image src={data.photoUrl} alt={fullName} fill className="object-cover" unoptimized />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-primary text-3xl font-bold">
                                        {initials}
                                    </div>
                                )}
                            </div>
                            <div className="space-y-2 py-2">
                                <h1 className="text-2xl font-bold text-gray-900">{fullName}</h1>
                                <p className="text-blue-600 font-semibold">{data.position || "No position"}</p>
                                <div className="flex gap-2">
                                    <Badge className={data.isVisible ? "bg-green-500" : "bg-gray-500"}>
                                        {data.isVisible ? "Visible" : "Hidden"}
                                    </Badge>
                                    <Badge variant="outline">Order: {data.displayOrder ?? 0}</Badge>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t pt-4 text-sm">
                            <div>
                                <p className="text-gray-500 uppercase text-[10px] font-bold tracking-wider">Employee ID</p>
                                <p className="text-gray-900">{data.employeeId || "N/A"}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 uppercase text-[10px] font-bold tracking-wider">Department</p>
                                <p className="text-gray-900">{data.department || "N/A"}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 uppercase text-[10px] font-bold tracking-wider">Salary</p>
                                <p className="text-gray-900">{formatSalary(data.salary)}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 uppercase text-[10px] font-bold tracking-wider">LinkedIn</p>
                                {hasLinkedin ? (
                                    <a href={data.linkedinUrl || "#"} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                                        View Profile
                                    </a>
                                ) : (
                                    <p className="text-gray-900">N/A</p>
                                )}
                            </div>
                            <div>
                                <p className="text-gray-500 uppercase text-[10px] font-bold tracking-wider">Created At</p>
                                <p className="text-gray-900">{formatDateTime(data.createdAt)}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 uppercase text-[10px] font-bold tracking-wider">Updated At</p>
                                <p className="text-gray-900">{formatDateTime(data.updatedAt)}</p>
                            </div>
                        </div>

                        <div className="space-y-2 border-t pt-4">
                            <p className="text-gray-500 uppercase text-[10px] font-bold tracking-wider">Bio</p>
                            <div className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: bioHtml }} />
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    )
}
