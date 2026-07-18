"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { AffiliateStatsRow } from "./AffiliateStatsRow";
import { DashboardTablePagination } from "@/src/modules/dashboard/shared/components/DashboardTablePagination";
import { EARNING_ROWS } from "@/src/modules/dashboard/shared/data/dashboard-demo-data";
import { useLocale } from "@/src/shared/context/locale.provider";
import { useIsDemoAccount } from "@/src/shared/hooks/use-is-demo-account";

const PAGE_SIZE = 8;
const DEMO_SUMMARY = [
  { key: "thisMonth" as const, value: "$186" },
  { key: "lastMonth" as const, value: "$142" },
  { key: "totalEarned" as const, value: "$1,250" },
  { key: "pending" as const, value: "$45" },
];
const EMPTY_SUMMARY = [
  { key: "thisMonth" as const, value: "$0" },
  { key: "lastMonth" as const, value: "$0" },
  { key: "totalEarned" as const, value: "$0" },
  { key: "pending" as const, value: "$0" },
];

export default function AffiliateEarningsLayout() {
  const { t } = useLocale();
  const { demoOrEmpty } = useIsDemoAccount();
  const p = t.affiliatePages.earnings;
  const earningSource = demoOrEmpty(EARNING_ROWS, [] as typeof EARNING_ROWS);
  const summary = demoOrEmpty(DEMO_SUMMARY, EMPTY_SUMMARY);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    if (!search.trim()) return earningSource;
    const q = search.toLowerCase();
    return earningSource.filter(
      (r) =>
        r.id.toLowerCase().includes(q) ||
        r.subcategory.toLowerCase().includes(q) ||
        r.commission.toLowerCase().includes(q)
    );
  }, [search, earningSource]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">{p.title}</h1>
        <p className="text-sm text-gray-500 mt-1">{p.subtitle}</p>
      </div>
      <AffiliateStatsRow />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {summary.map((item) => (
          <div key={item.key} className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <p className="text-xs font-bold text-primary">{p[item.key]}</p>
            <p className="text-xl font-bold text-gray-900 mt-1">{item.value}</p>
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-md font-bold text-gray-900">{p.commissionHistory}</h3>
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
              className="w-full sm:w-48 rounded border border-gray-200 py-1.5 pr-3 pl-8 text-xs focus:outline-none"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs min-w-[480px]">
            <thead>
              <tr className="bg-primary font-bold text-white uppercase">
                <th className="p-3">ID</th>
                <th className="p-3">{p.category}</th>
                <th className="p-3">{p.commission}</th>
                <th className="p-3">{p.referral}</th>
                <th className="p-3">{p.status}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pageData.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">
                    No commission history yet.
                  </td>
                </tr>
              ) : (
                pageData.map((item, idx) => (
                  <tr key={`${item.id}-${idx}`} className="text-gray-700 hover:bg-gray-50">
                    <td className="p-3 font-semibold">{item.id}</td>
                    <td className="p-3 text-gray-500">{item.subcategory}</td>
                    <td className="p-3 font-medium">{item.commission}</td>
                    <td className="p-3 text-gray-500">REF-{String(40 + idx).padStart(3, "0")}</td>
                    <td className="p-3">
                      <span
                        className={`rounded px-2 py-0.5 text-[10px] font-bold ${item.status === "Complete" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
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
      </div>
    </div>
  );
}
