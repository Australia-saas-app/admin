"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, Bell } from "lucide-react";
import { toast } from "sonner";
import { useLocale } from "@/src/shared/context/locale.provider";
import { useIsDemoAccount } from "@/src/shared/hooks/use-is-demo-account";
import { BUSINESS_NOTICES } from "../data/business-demo-data";

export default function BusinessNoticesLayout() {
  const { t } = useLocale();
  const { demoOrEmpty } = useIsDemoAccount();
  const notices = demoOrEmpty(BUSINESS_NOTICES, [] as typeof BUSINESS_NOTICES);
  const p = t.businessPages.notices;
  const [search, setSearch] = useState("");
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    let rows = notices.map((n) => ({ ...n, read: readIds.has(n.id) }));
    if (showUnreadOnly) rows = rows.filter((n) => !n.read);
    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter(
        (n) => n.title.toLowerCase().includes(q) || n.category.toLowerCase().includes(q)
      );
    }
    return rows;
  }, [search, showUnreadOnly, readIds, notices]);

  const unreadCount = notices.filter((n) => !readIds.has(n.id)).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">{p.title}</h1>
          <p className="text-sm text-gray-500 mt-1">{p.subtitle}</p>
        </div>
        {unreadCount > 0 && (
          <button
            type="button"
            onClick={() => {
              setReadIds(new Set(notices.map((n) => n.id)));
              toast.success(p.allMarkedRead);
            }}
            className="text-sm font-semibold text-primary hover:underline"
          >
            {p.markAllRead}
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <p className="text-xs font-bold text-primary">{p.total}</p>
          <p className="text-xl font-bold mt-1">{notices.length}</p>
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 shadow-sm">
          <p className="text-xs font-bold text-amber-700">{p.unread}</p>
          <p className="text-xl font-bold text-amber-900 mt-1">{unreadCount}</p>
        </div>
        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm col-span-2 lg:col-span-1">
          <p className="text-xs font-bold text-primary">{p.publicBoard}</p>
          <Link
            href="/notice"
            className="text-sm font-semibold text-primary mt-1 inline-block hover:underline"
          >
            {p.viewPublic}
          </Link>
        </div>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row gap-3 border-b border-gray-100 p-4">
          <div className="relative flex-1">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={p.search}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-200 py-2 pl-10 pr-4 text-sm focus:outline-none"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={showUnreadOnly}
              onChange={(e) => setShowUnreadOnly(e.target.checked)}
              className="accent-primary"
            />
            {p.unreadOnly}
          </label>
        </div>
        <div className="divide-y divide-gray-100">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-sm text-gray-500">{p.noNotices}</div>
          ) : (
            filtered.map((notice) => (
              <div
                key={notice.id}
                className={`flex items-start gap-4 p-4 hover:bg-gray-50/50 ${!notice.read ? "bg-blue-50/30" : ""}`}
              >
                <div
                  className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${!notice.read ? "bg-primary text-white" : "bg-gray-100 text-gray-400"}`}
                >
                  <Bell className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p
                      className={`text-sm ${!notice.read ? "font-bold text-gray-900" : "font-medium text-gray-700"}`}
                    >
                      {notice.title}
                    </p>
                    {!notice.read && (
                      <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-white">
                        {p.new}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {notice.category} · {notice.date}
                  </p>
                </div>
                {!notice.read && (
                  <button
                    type="button"
                    onClick={() => {
                      setReadIds((prev) => new Set([...prev, notice.id]));
                      toast.success(p.markedRead);
                    }}
                    className="shrink-0 text-xs font-semibold text-primary hover:underline"
                  >
                    {p.markRead}
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
