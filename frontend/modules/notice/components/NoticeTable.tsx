"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { PublicPageShell } from "@/src/modules/shared/components/public/PublicPageShell";
import type { Notice } from "../types/notice.type";
import NoticeViewer from "./NoticeViewer";
import { formatNoticeDate } from "../data/mock-notices";

interface Props {
  initialData?: Notice[];
}

const PAGE_SIZE = 10;

export default function NoticeTable({ initialData = [] }: Props) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [viewer, setViewer] = useState<{ content: string; title: string } | null>(null);

  const filtered = useMemo(() => {
    if (!query.trim()) return initialData;
    const q = query.toLowerCase();
    return initialData.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        n.type.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q)
    );
  }, [initialData, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageStart = (safePage - 1) * PAGE_SIZE;
  const pageData = filtered.slice(pageStart, pageStart + PAGE_SIZE);

  return (
    <PublicPageShell
      title="Notice Board"
      subtitle="Official announcements, policy updates, and platform notices."
      badge="Notices"
    >
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div className="flex w-full sm:w-auto sm:max-w-[280px] ml-auto">
            <input
              type="text"
              placeholder="Search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              className="border border-border rounded-l-md px-2.5 py-1 bg-card text-[11px] outline-none w-full focus:ring-1 focus:ring-[#2f3d58]/20"
            />
            <button
              type="button"
              className="rounded-r-md px-2.5 py-1 bg-primary hover:bg-primary/90 transition-colors"
              aria-label="Search notices"
            >
              <Search className="h-3 w-3 text-white" />
            </button>
          </div>
        </div>

        <div className="bg-card rounded-md border border-border overflow-hidden shadow-sm">
          <div className="hidden sm:grid grid-cols-[48px_1fr_108px_72px] bg-[#4f6484] text-white px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wide">
            <div className="text-center">SL</div>
            <div>Title</div>
            <div className="text-center">Published Date</div>
            <div className="text-center">Action</div>
          </div>

          <div className="divide-y divide-border">
            {pageData.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground text-[11px]">
                No notices found
              </div>
            ) : (
              pageData.map((notice, index) => {
                const sl = pageStart + index + 1;
                return (
                  <div
                    key={notice.id || index}
                    className="p-3 sm:grid sm:grid-cols-[48px_1fr_108px_72px] sm:items-center sm:px-2 sm:py-2 text-[11px] text-[#455c83]"
                  >
                    <div className="mb-2 flex items-center gap-2 sm:mb-0 sm:justify-center">
                      <span className="bg-[#4f6484] text-white w-6 h-6 flex items-center justify-center rounded text-[10px] font-semibold shrink-0">
                        {sl}
                      </span>
                      <span className="text-[10px] text-muted-foreground sm:hidden">
                        {formatNoticeDate(notice.publishAt || notice.createdAt)}
                      </span>
                    </div>

                    <div className="pr-2 min-w-0 leading-tight mb-2 sm:mb-0">
                      <p className="font-semibold text-[#2f3d58] text-[10px] mb-0.5">
                        {notice.type}
                      </p>
                      <p className="text-[#455c83] line-clamp-2 text-[10px]">{notice.title}</p>
                    </div>

                    <div className="hidden sm:block text-center text-[#455c83] text-[10px]">
                      {formatNoticeDate(notice.publishAt || notice.createdAt)}
                    </div>

                    <div className="flex sm:justify-center">
                      <button
                        type="button"
                        onClick={() => setViewer({ content: notice.content, title: notice.title })}
                        className="bg-[#4f6484] hover:bg-[#3f5271] text-white text-[10px] font-medium h-7 sm:h-6 px-4 sm:px-3 rounded transition-colors"
                      >
                        View
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {filtered.length > PAGE_SIZE && (
          <div className="flex justify-between items-center mt-3 text-[10px] text-[#2f3d58]">
            <span>
              Showing {pageStart + 1} to {Math.min(pageStart + PAGE_SIZE, filtered.length)} of{" "}
              {filtered.length} results
            </span>
            <div className="flex gap-1">
              <button
                type="button"
                disabled={safePage === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-2 py-1 rounded border border-border disabled:opacity-50"
              >
                Prev
              </button>
              <button
                type="button"
                disabled={safePage === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-2 py-1 rounded border border-border disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {viewer && (
          <NoticeViewer
            content={viewer.content}
            title={viewer.title}
            onClose={() => setViewer(null)}
          />
        )}
      </div>
    </PublicPageShell>
  );
}
