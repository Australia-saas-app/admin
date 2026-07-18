"use client"

import { FileText } from "lucide-react"
import AppModal from "./AppModal"

export interface DetailField {
  label: string
  value: string
}

interface RecordDetailDrawerProps {
  open: boolean
  title: string
  subtitle?: string
  status?: string
  fields: DetailField[]
  onClose: () => void
  actions?: React.ReactNode
}

function statusTone(status: string) {
  const normalized = status.toLowerCase()
  if (normalized.includes("complete") || normalized.includes("active") || normalized.includes("published")) {
    return "bg-emerald-50 text-emerald-700 ring-emerald-600/20"
  }
  if (normalized.includes("pending") || normalized.includes("draft")) {
    return "bg-amber-50 text-amber-700 ring-amber-600/20"
  }
  if (normalized.includes("fail") || normalized.includes("block") || normalized.includes("suspend")) {
    return "bg-red-50 text-red-700 ring-red-600/20"
  }
  return "bg-slate-50 text-slate-700 ring-slate-600/20"
}

export default function RecordDetailDrawer({
  open,
  title,
  subtitle,
  status,
  fields,
  onClose,
  actions,
}: RecordDetailDrawerProps) {
  return (
    <AppModal
      open={open}
      onClose={onClose}
      title={title}
      description={subtitle}
      size="lg"
      icon={<FileText className="h-5 w-5" />}
      badge={
        status ? (
          <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1 ${statusTone(status)}`}>
            {status}
          </span>
        ) : undefined
      }
      footer={actions}
    >
      <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {fields.map((field) => (
          <div
            key={field.label}
            className="rounded-xl border border-gray-100 bg-gray-50/60 px-4 py-3.5"
          >
            <dt className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{field.label}</dt>
            <dd className="mt-1.5 text-sm font-medium text-gray-900 break-words">{field.value}</dd>
          </div>
        ))}
      </dl>
    </AppModal>
  )
}

export { RecordDetailDrawer as RecordDetailModal }
