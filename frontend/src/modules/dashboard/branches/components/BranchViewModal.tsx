"use client"

import { Modal } from "@/src/components/ui/modal"
import { Badge } from "@/src/components/ui/badge"
import React from "react"
import FormatDate from "@/src/utils/FormatDate"

interface BranchViewModalProps {
  isOpen: boolean
  onClose: () => void
  data: any | null
  loading?: boolean
}

export const BranchViewModal: React.FC<BranchViewModalProps> = ({ isOpen, onClose, data, loading }) => {
  if (!isOpen) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="View Branch" size="lg">
      <div className="flex flex-col gap-6 py-4">
        {loading ? (
          <div className="text-center py-10 text-gray-500 italic">Loading details...</div>
        ) : !data ? (
          <div className="text-center py-10 text-red-500">Failed to load details.</div>
        ) : (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{data.branchName}</h1>
              <p className="text-gray-500">{data.address}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 border-y py-4 text-sm">
              <div>
                <p className="text-gray-500 uppercase text-[10px] font-bold tracking-wider">Phone</p>
                <p className="text-gray-900 font-medium">{data.phone || "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-500 uppercase text-[10px] font-bold tracking-wider">Email</p>
                <p className="text-gray-900 font-medium">{data.emailAddress || data.email || "N/A"}</p>
              </div>
              <div className="mt-4">
                <p className="text-gray-500 uppercase text-[10px] font-bold tracking-wider">Working Hours</p>
                <p className="text-gray-900">{data.workingHours || "N/A"}</p>
              </div>
              <div className="mt-4">
                <p className="text-gray-500 uppercase text-[10px] font-bold tracking-wider">Created At</p>
                <p className="text-gray-900">{data.createdAt ? FormatDate(data.createdAt) : "N/A"}</p>
              </div>
              <div className="mt-4">
                <p className="text-gray-500 uppercase text-[10px] font-bold tracking-wider">Visibility</p>
                <Badge className={data.isVisible ? "bg-green-500" : "bg-gray-500"}>
                  {data.isVisible ? "Visible" : "Hidden"}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-gray-500 uppercase text-[10px] font-bold tracking-wider">Working Days</p>
              <div className="flex flex-wrap gap-2">
                {Array.isArray(data.workingDays) && data.workingDays.length > 0 ? (
                  data.workingDays.map((day: string, idx: number) => (
                    <Badge key={idx} variant="outline">{day}</Badge>
                  ))
                ) : (
                  <span className="text-gray-400 italic text-sm">No working days listed.</span>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-gray-500 uppercase text-[10px] font-bold tracking-wider">Services Provided</p>
              <div className="flex flex-wrap gap-2">
                {Array.isArray(data.services) && data.services.length > 0 ? (
                  data.services.map((service: string, idx: number) => (
                    <Badge key={idx} variant="outline" className="text-primary border-primary/30">
                      {service}
                    </Badge>
                  ))
                ) : (
                  <span className="text-gray-400 italic text-sm">No services listed.</span>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-gray-500 uppercase text-[10px] font-bold tracking-wider">Social Links</p>
              <div className="space-y-1 text-sm">
                {Array.isArray(data.socialLinks) && data.socialLinks.length > 0 ? (
                  data.socialLinks.map((link: any, idx: number) => (
                    <a
                      key={idx}
                      href={link?.url || "#"}
                      target="_blank"
                      rel="noreferrer"
                      className="block text-blue-600 hover:underline"
                    >
                      {link?.name || "Link"}: {link?.url || "N/A"}
                    </a>
                  ))
                ) : (
                  <span className="text-gray-400 italic text-sm">No social links.</span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}