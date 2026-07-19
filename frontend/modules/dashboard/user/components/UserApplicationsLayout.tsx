"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search, FileText, Briefcase } from "lucide-react";
import { useLocale } from "@/src/shared/context/locale.provider";
import { useUser } from "@/src/context/user.provider";
import { getUserIdFromAuthUser } from "@/src/shared/lib/demo-user";
import { getApplicationsForUser, type ApplicationRecord } from "@/src/shared/lib/application-store";
import { DashboardTablePagination } from "@/src/modules/dashboard/shared/components/DashboardTablePagination";

const PAGE_SIZE = 8;

const TYPE_LABELS: Record<ApplicationRecord["type"], string> = {
  job: "Careers",
  technical: "Technical",
  service: "Service",
};

const STATUS_COLORS: Record<string, string> = {
  submitted: "bg-amber-100 text-amber-700",
  reviewing: "bg-blue-100 text-blue-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

const BROWSE_LINKS = [
  { href: "/careers", label: "Careers" },
  { href: "/technical", label: "Technical projects" },
  { href: "/marketplace", label: "Marketplace" },
];

export default function UserApplicationsLayout() {
  const { t } = useLocale();
  const { user } = useUser();
  const userId = getUserIdFromAuthUser(user) ?? "";
  const p = t.userPages.applications;
  const [applications, setApplications] = useState<ApplicationRecord[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!userId) return;
    setApplications(getApplicationsForUser(userId));
  }, [userId]);

  const filtered = useMemo(() => {
    let rows = applications;
    if (filter !== "All") rows = rows.filter((r) => r.type === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter(
        (r) =>
          r.itemTitle.toLowerCase().includes(q) ||
          r.id.toLowerCase().includes(q) ||
          TYPE_LABELS[r.type].toLowerCase().includes(q)
      );
    }
    return rows;
  }, [applications, search, filter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const stats = {
    total: applications.length,
    pending: applications.filter((a) => a.status === "submitted" || a.status === "reviewing")
      .length,
    approved: applications.filter((a) => a.status === "approved").length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">{p.title}</h1>
        <p className="mt-1 text-sm text-gray-500">{p.subtitle}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        {[
          { label: p.total, value: String(stats.total) },
          { label: p.pending, value: String(stats.pending) },
          { label: p.approved, value: String(stats.approved) },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <p className="text-xs font-bold text-primary">{s.label}</p>
            <p className="mt-1 text-xl font-bold text-gray-900">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <h3 className="text-md font-bold text-gray-900">{p.history}</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="relative">
              <Search className="absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={p.search}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full rounded border border-gray-200 py-1.5 pr-3 pl-8 text-xs focus:outline-none sm:w-48"
              />
            </div>
            <select
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value);
                setPage(1);
              }}
              className="rounded border border-gray-200 px-2 py-1.5 text-xs focus:outline-none"
            >
              <option value="All">All types</option>
              <option value="job">Careers</option>
              <option value="technical">Technical</option>
              <option value="service">Service</option>
            </select>
          </div>
        </div>

        {pageData.length === 0 ? (
          <div className="py-12 text-center">
            <Briefcase className="mx-auto mb-3 h-10 w-10 text-gray-300" />
            <p className="text-sm font-medium text-gray-700">{p.emptyTitle}</p>
            <p className="mt-1 text-sm text-gray-500">{p.emptyHint}</p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {BROWSE_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-lg border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-xs">
                <thead>
                  <tr className="bg-primary font-bold text-white uppercase">
                    <th className="p-3">ID</th>
                    <th className="p-3">{p.type}</th>
                    <th className="p-3">{p.listing}</th>
                    <th className="p-3">{p.status}</th>
                    <th className="p-3">{p.submitted}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {pageData.map((row) => (
                    <tr key={row.id} className="text-gray-700 hover:bg-gray-50">
                      <td className="p-3 font-semibold">{row.id}</td>
                      <td className="p-3">{TYPE_LABELS[row.type]}</td>
                      <td className="p-3 max-w-[220px] truncate">{row.itemTitle}</td>
                      <td className="p-3">
                        <span
                          className={`rounded px-2 py-0.5 text-[10px] font-bold capitalize ${
                            STATUS_COLORS[row.status] ?? "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {row.status}
                        </span>
                      </td>
                      <td className="p-3 text-gray-500">
                        {new Date(row.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <DashboardTablePagination
              current={page}
              total={totalPages}
              pageSize={PAGE_SIZE}
              totalItems={filtered.length}
              onChange={setPage}
            />
          </>
        )}
      </div>
    </div>
  );
}
