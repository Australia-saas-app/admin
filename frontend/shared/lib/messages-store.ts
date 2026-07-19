import { isDemoAccountUserId } from "@/src/shared/lib/demo-user"
import { getStorageUserScope, scopedStorageKey } from "@/src/shared/lib/storage-scope"

export type DashboardRole = "user" | "affiliate" | "business"

export interface ThreadMessage {
  id: string
  from: "me" | "them"
  fromName: string
  body: string
  sentAt: string
}

export type MessageFolder = "inbox" | "sent" | "drafts" | "deleted" | "live"

export interface MessageThread {
  id: string
  role: DashboardRole
  participant: string
  subject: string
  project: string
  projectId?: string
  unread: boolean
  updatedAt: string
  messages: ThreadMessage[]
  folder?: MessageFolder
  draftBody?: string
}

const STORAGE_KEY = "platform_message_threads"

function storageKey() {
  return scopedStorageKey(STORAGE_KEY)
}

function readAll(): MessageThread[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(storageKey())
    if (!raw) return []
    const parsed = JSON.parse(raw) as MessageThread[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeAll(threads: MessageThread[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(storageKey(), JSON.stringify(threads))
}

export function seedThreadsIfEmpty(seed: MessageThread[]) {
  if (!isDemoAccountUserId(getStorageUserScope())) return
  if (readAll().length > 0) return
  writeAll(seed)
}

export function getThreadsForRole(role: DashboardRole): MessageThread[] {
  return readAll()
    .filter((t) => t.role === role)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
}

export function getThreadById(id: string): MessageThread | undefined {
  return readAll().find((t) => t.id === id)
}

export function getOrCreateProjectThread(input: {
  role: DashboardRole
  projectId: string
  projectName: string
  participant?: string
}): MessageThread {
  const existing = readAll().find(
    (t) => t.role === input.role && t.projectId === input.projectId
  )
  if (existing) return existing

  const thread: MessageThread = {
    id: `TH-${input.projectId}`,
    role: input.role,
    participant: input.participant ?? "Project team",
    subject: `Project: ${input.projectName}`,
    project: input.projectName,
    projectId: input.projectId,
    unread: false,
    updatedAt: new Date().toISOString(),
    messages: [
      {
        id: `MSG-${Date.now()}`,
        from: "them",
        fromName: input.participant ?? "Project team",
        body: `Thread opened for ${input.projectName}. Send a message to coordinate milestones, deliverables, or payment.`,
        sentAt: new Date().toISOString(),
      },
    ],
  }
  writeAll([thread, ...readAll()])
  return thread
}

export function markThreadRead(threadId: string) {
  writeAll(
    readAll().map((t) => (t.id === threadId ? { ...t, unread: false } : t))
  )
}

export function archiveThread(threadId: string) {
  writeAll(
    readAll().map((t) => (t.id === threadId ? { ...t, folder: "deleted" as const, unread: false } : t))
  )
}

export function softDeleteThread(threadId: string) {
  archiveThread(threadId)
}

export function saveDraftThread(input: {
  role: DashboardRole
  to: string
  subject: string
  body: string
  threadId?: string
}): MessageThread {
  const threads = readAll()
  if (input.threadId) {
    const index = threads.findIndex((t) => t.id === input.threadId)
    if (index >= 0) {
      const updated: MessageThread = {
        ...threads[index],
        participant: input.to || threads[index].participant,
        subject: input.subject || threads[index].subject,
        draftBody: input.body,
        folder: "drafts",
        updatedAt: new Date().toISOString(),
      }
      const next = [...threads]
      next[index] = updated
      writeAll(next)
      return updated
    }
  }

  const draft: MessageThread = {
    id: `DR-${Date.now().toString().slice(-6)}`,
    role: input.role,
    participant: input.to || "Recipient",
    subject: input.subject || "(No subject)",
    project: "Compose",
    unread: false,
    updatedAt: new Date().toISOString(),
    messages: [],
    folder: "drafts",
    draftBody: input.body,
  }
  writeAll([draft, ...threads])
  return draft
}

export function sendComposedMessage(input: {
  role: DashboardRole
  to: string
  subject: string
  body: string
  senderName: string
  draftId?: string
}): MessageThread {
  const threads = input.draftId ? readAll().filter((t) => t.id !== input.draftId) : readAll()
  const sentAt = new Date().toISOString()
  const thread: MessageThread = {
    id: `SN-${Date.now().toString().slice(-6)}`,
    role: input.role,
    participant: input.to,
    subject: input.subject,
    project: "Direct",
    unread: false,
    updatedAt: sentAt,
    folder: "sent",
    messages: [
      {
        id: `MSG-${Date.now().toString(36)}`,
        from: "me",
        fromName: input.senderName,
        body: input.body,
        sentAt,
      },
    ],
  }
  writeAll([thread, ...threads])
  return thread
}

export function getThreadsByFolder(role: DashboardRole, folder: MessageFolder): MessageThread[] {
  return getThreadsForRole(role).filter((t) => {
    const f = t.folder ?? "inbox"
    if (folder === "inbox") return f === "inbox" || f === "live"
    return f === folder
  })
}

export function sendThreadMessage(threadId: string, body: string, senderName: string): MessageThread | undefined {
  const threads = readAll()
  const index = threads.findIndex((t) => t.id === threadId)
  if (index < 0) return undefined

  const message: ThreadMessage = {
    id: `MSG-${Date.now().toString(36)}`,
    from: "me",
    fromName: senderName,
    body,
    sentAt: new Date().toISOString(),
  }

  const updated: MessageThread = {
    ...threads[index],
    messages: [...threads[index].messages, message],
    updatedAt: message.sentAt,
    unread: false,
    folder: threads[index].folder === "drafts" ? "sent" : threads[index].folder ?? "inbox",
    draftBody: undefined,
  }

  const next = [...threads]
  next[index] = updated
  writeAll(next)
  return updated
}

export function countUnreadForRole(role: DashboardRole): number {
  return getThreadsForRole(role).filter((t) => t.unread).length
}

export function demoToThread(
  role: DashboardRole,
  item: {
    id: string
    from: string
    subject: string
    body: string
    unread: boolean
    date: string
    project?: string
    category?: string
  }
): MessageThread {
  const project = item.project ?? item.category ?? "—"
  return {
    id: item.id,
    role,
    participant: item.from,
    subject: item.subject,
    project,
    projectId: project !== "—" ? project.replace(/\s+/g, "-").toLowerCase() : undefined,
    unread: item.unread,
    updatedAt: item.date,
    messages: [
      {
        id: `${item.id}-1`,
        from: "them",
        fromName: item.from,
        body: item.body,
        sentAt: item.date,
      },
    ],
  }
}
