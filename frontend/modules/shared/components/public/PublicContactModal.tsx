"use client"

import { useState } from "react"
import AppModal from "@/src/modules/dashboard/shared/components/AppModal"
import { Button } from "@/src/components/ui/button"
import { toast } from "sonner"

export interface PublicContactModalProps {
  open: boolean
  onClose: () => void
  title?: string
  description?: string
  subject?: string
}

export function PublicContactModal({
  open,
  onClose,
  title = "Get in touch",
  description = "Send us a message and our team will respond within 1–2 business days.",
  subject = "",
}: PublicContactModalProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState(subject)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error("Please complete all fields.")
      return
    }
    setSubmitting(true)
    await new Promise((r) => setTimeout(r, 600))
    setSubmitting(false)
    toast.success("Your request has been submitted. We'll be in touch soon.")
    onClose()
    setName("")
    setEmail("")
    setMessage(subject)
  }

  return (
    <AppModal open={open} onClose={onClose} title={title} description={description} size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Full name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
            placeholder="Your name"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
            placeholder="you@company.com"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
            placeholder="How can we help?"
          />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={submitting} className="bg-primary hover:bg-primary/90">
            {submitting ? "Sending..." : "Submit request"}
          </Button>
        </div>
      </form>
    </AppModal>
  )
}
