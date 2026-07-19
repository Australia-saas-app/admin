"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Search,
  Mail,
  MailOpen,
  Send,
  PenSquare,
  Inbox,
  FileText,
  Trash2,
  MessageCircle,
} from "lucide-react";
import { toast } from "sonner";
import { useUser } from "@/src/context/user.provider";
import {
  archiveThread,
  getOrCreateProjectThread,
  getThreadsForRole,
  markThreadRead,
  saveDraftThread,
  sendComposedMessage,
  sendThreadMessage,
  type DashboardRole,
  type MessageFolder,
  type MessageThread,
} from "@/src/shared/lib/messages-store";
import AppModal from "./AppModal";

interface DashboardMessagesLayoutProps {
  role: DashboardRole;
  title: string;
  subtitle: string;
  labels: {
    total: string;
    unread: string;
    search: string;
    unreadOnly: string;
    from: string;
    project: string;
    reply: string;
    archive: string;
    selectMessage: string;
    send: string;
    writeMessage: string;
  };
  technicalHref: string;
}

const FOLDERS: { id: MessageFolder; label: string; icon: typeof Inbox }[] = [
  { id: "inbox", label: "Inbox", icon: Inbox },
  { id: "sent", label: "Sent", icon: Send },
  { id: "drafts", label: "Drafts", icon: FileText },
  { id: "deleted", label: "Deleted", icon: Trash2 },
  { id: "live", label: "Live chat", icon: MessageCircle },
];

function getDisplayName(user: ReturnType<typeof useUser>["user"]) {
  if (!user) return "You";
  if ("firstName" in user && user.firstName) {
    return `${user.firstName} ${"lastName" in user && user.lastName ? user.lastName : ""}`.trim();
  }
  if ("name" in user && user.name) return user.name;
  if ("email" in user && user.email) return user.email;
  return "You";
}

export default function DashboardMessagesLayout({
  role,
  title,
  subtitle,
  labels,
  technicalHref,
}: DashboardMessagesLayoutProps) {
  const { user } = useUser();
  const searchParams = useSearchParams();
  const threadParam = searchParams.get("thread");

  const [threads, setThreads] = useState<MessageThread[]>([]);
  const [folder, setFolder] = useState<MessageFolder>("inbox");
  const [search, setSearch] = useState("");
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [composeOpen, setComposeOpen] = useState(false);
  const [composeTo, setComposeTo] = useState("");
  const [composeSubject, setComposeSubject] = useState("");
  const [composeBody, setComposeBody] = useState("");
  const [editingDraftId, setEditingDraftId] = useState<string | undefined>();

  const refresh = () => setThreads(getThreadsForRole(role));

  useEffect(() => {
    refresh();
  }, [role]);

  useEffect(() => {
    if (!threadParam) return;
    let thread = getThreadsForRole(role).find((t) => t.id === threadParam);
    if (!thread && threadParam.startsWith("TH-")) {
      const projectId = threadParam.replace(/^TH-/, "");
      thread = getOrCreateProjectThread({
        role,
        projectId,
        projectName: projectId,
        participant: "Project team",
      });
    }
    if (thread) {
      setFolder((thread.folder as MessageFolder) ?? "inbox");
      setSelectedId(thread.id);
      markThreadRead(thread.id);
      refresh();
    }
  }, [threadParam, role]);

  const folderThreads = useMemo(() => {
    return threads.filter((t) => {
      const f = (t.folder ?? "inbox") as MessageFolder;
      if (folder === "inbox") return f === "inbox";
      if (folder === "live") return f === "live" || t.project.toLowerCase().includes("support");
      return f === folder;
    });
  }, [threads, folder]);

  const filtered = useMemo(() => {
    let rows = folderThreads;
    if (showUnreadOnly) rows = rows.filter((t) => t.unread);
    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter(
        (t) =>
          t.subject.toLowerCase().includes(q) ||
          t.participant.toLowerCase().includes(q) ||
          t.project.toLowerCase().includes(q)
      );
    }
    return rows;
  }, [folderThreads, search, showUnreadOnly]);

  const selected = filtered.find((t) => t.id === selectedId) ?? filtered[0] ?? null;
  const unreadCount = threads.filter((t) => t.unread && (t.folder ?? "inbox") === "inbox").length;

  const openThread = (id: string) => {
    const thread = threads.find((t) => t.id === id);
    setSelectedId(id);
    if (thread?.folder === "drafts") {
      setEditingDraftId(thread.id);
      setComposeTo(thread.participant);
      setComposeSubject(thread.subject);
      setComposeBody(thread.draftBody ?? "");
      setComposeOpen(true);
      return;
    }
    markThreadRead(id);
    refresh();
  };

  const handleSend = async () => {
    if (!selected || !draft.trim()) {
      toast.error("Enter a message before sending.");
      return;
    }
    sendThreadMessage(selected.id, draft.trim(), getDisplayName(user));
    setDraft("");
    refresh();
    toast.success("Message sent.");
  };

  const handleArchive = () => {
    if (!selected) return;
    archiveThread(selected.id);
    setSelectedId(null);
    refresh();
    toast.success("Moved to Deleted.");
  };

  const handleComposeSend = () => {
    if (!composeTo.trim() || !composeSubject.trim() || !composeBody.trim()) {
      toast.error("To, subject, and message are required.");
      return;
    }
    sendComposedMessage({
      role,
      to: composeTo.trim(),
      subject: composeSubject.trim(),
      body: composeBody.trim(),
      senderName: getDisplayName(user),
      draftId: editingDraftId,
    });
    setComposeOpen(false);
    setComposeTo("");
    setComposeSubject("");
    setComposeBody("");
    setEditingDraftId(undefined);
    setFolder("sent");
    refresh();
    toast.success("Message sent.");
  };

  const handleSaveDraft = () => {
    saveDraftThread({
      role,
      to: composeTo.trim(),
      subject: composeSubject.trim(),
      body: composeBody,
      threadId: editingDraftId,
    });
    setComposeOpen(false);
    setFolder("drafts");
    refresh();
    toast.success("Draft saved.");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">{title}</h1>
          <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditingDraftId(undefined);
            setComposeTo("");
            setComposeSubject("");
            setComposeBody("");
            setComposeOpen(true);
          }}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary/90"
        >
          <PenSquare className="h-4 w-4" />
          Compose
        </button>
      </div>

      <div className="grid max-w-md grid-cols-2 gap-3">
        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <p className="text-xs font-bold text-primary">{labels.total}</p>
          <p className="mt-1 text-xl font-bold text-gray-900">{threads.length}</p>
        </div>
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 shadow-sm">
          <p className="text-xs font-bold text-blue-700">{labels.unread}</p>
          <p className="mt-1 text-xl font-bold text-blue-900">{unreadCount}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {FOLDERS.map((item) => {
          const Icon = item.icon;
          const count = threads.filter(
            (t) => (t.folder ?? "inbox") === item.id || (item.id === "inbox" && !t.folder)
          ).length;
          const active = folder === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setFolder(item.id);
                setSelectedId(null);
              }}
              className={[
                "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold",
                active
                  ? "bg-primary text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50",
              ].join(" ")}
            >
              <Icon className="h-3.5 w-3.5" />
              {item.label}
              <span className={active ? "text-white/80" : "text-gray-400"}>({count})</span>
            </button>
          );
        })}
      </div>

      <div className="grid min-h-[520px] grid-cols-1 gap-4 lg:grid-cols-5">
        <div className="flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm lg:col-span-2">
          <div className="space-y-2 border-b border-gray-100 p-3">
            <div className="relative">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={labels.search}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-gray-200 py-2 pr-3 pl-9 text-sm focus:outline-none"
              />
            </div>
            <label className="flex cursor-pointer items-center gap-2 text-xs text-gray-600">
              <input
                type="checkbox"
                checked={showUnreadOnly}
                onChange={(e) => setShowUnreadOnly(e.target.checked)}
                className="accent-primary"
              />
              {labels.unreadOnly}
            </label>
          </div>
          <div className="flex-1 divide-y divide-gray-100 overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="p-4 text-sm text-gray-500">No conversations in {folder}.</p>
            ) : (
              filtered.map((thread) => (
                <button
                  key={thread.id}
                  type="button"
                  onClick={() => openThread(thread.id)}
                  className={`w-full p-3 text-left transition-colors hover:bg-gray-50 ${
                    selected?.id === thread.id ? "border-l-2 border-l-primary bg-primary/5" : ""
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {thread.unread ? (
                      <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    ) : (
                      <MailOpen className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                    )}
                    <div className="min-w-0">
                      <p
                        className={`truncate text-sm ${thread.unread ? "font-bold text-gray-900" : "text-gray-700"}`}
                      >
                        {thread.subject}
                      </p>
                      <p className="truncate text-xs text-gray-500">
                        {thread.participant} · {new Date(thread.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        <div className="flex min-h-[420px] flex-col rounded-xl border border-gray-100 bg-white shadow-sm lg:col-span-3">
          {selected && selected.folder !== "drafts" ? (
            <>
              <div className="border-b border-gray-100 p-5">
                <h2 className="text-lg font-bold text-gray-900">{selected.subject}</h2>
                <p className="mt-1 text-sm text-gray-500">
                  {labels.from}: {selected.participant}
                </p>
                {selected.project !== "—" && (
                  <Link
                    href={technicalHref}
                    className="mt-2 inline-block text-xs font-semibold text-primary hover:underline"
                  >
                    {labels.project}: {selected.project}
                  </Link>
                )}
              </div>

              <div className="flex-1 space-y-4 overflow-y-auto p-5">
                {selected.messages.length === 0 ? (
                  <p className="text-sm text-gray-500">No messages in this conversation.</p>
                ) : (
                  selected.messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`max-w-[85%] rounded-xl px-4 py-3 text-sm ${
                        msg.from === "me"
                          ? "ml-auto bg-primary text-white"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      <p
                        className={`mb-1 text-[10px] font-bold ${msg.from === "me" ? "text-white/80" : "text-gray-500"}`}
                      >
                        {msg.fromName} · {new Date(msg.sentAt).toLocaleString()}
                      </p>
                      <p className="leading-relaxed whitespace-pre-wrap">{msg.body}</p>
                    </div>
                  ))
                )}
              </div>

              {folder !== "deleted" && (
                <div className="space-y-3 border-t border-gray-100 p-4">
                  <textarea
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    rows={3}
                    placeholder={labels.writeMessage}
                    className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleSend}
                      className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90"
                    >
                      <Send className="h-4 w-4" />
                      {labels.send}
                    </button>
                    <button
                      type="button"
                      onClick={handleArchive}
                      className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      {labels.archive}
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center text-sm text-gray-500">
              {labels.selectMessage}
            </div>
          )}
        </div>
      </div>

      <AppModal
        open={composeOpen}
        onClose={() => setComposeOpen(false)}
        title={editingDraftId ? "Continue draft" : "Compose message"}
        size="lg"
      >
        <div className="space-y-3">
          <input
            value={composeTo}
            onChange={(e) => setComposeTo(e.target.value)}
            placeholder="To"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
          />
          <input
            value={composeSubject}
            onChange={(e) => setComposeSubject(e.target.value)}
            placeholder="Subject"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
          />
          <textarea
            value={composeBody}
            onChange={(e) => setComposeBody(e.target.value)}
            rows={8}
            placeholder="Write your message…"
            className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm"
          />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleComposeSend}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white"
            >
              Send
            </button>
            <button
              type="button"
              onClick={handleSaveDraft}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium"
            >
              Save draft
            </button>
          </div>
        </div>
      </AppModal>
    </div>
  );
}
