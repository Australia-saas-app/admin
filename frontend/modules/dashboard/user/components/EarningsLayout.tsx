"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Search } from "lucide-react";
import { UserStatsRow } from "./UserStatsRow";
import { DashboardTablePagination } from "@/src/modules/dashboard/shared/components/DashboardTablePagination";
import { EARNING_ROWS } from "@/src/modules/dashboard/shared/data/dashboard-demo-data";
import { useLocale } from "@/src/shared/context/locale.provider";
import { useIsDemoAccount } from "@/src/shared/hooks/use-is-demo-account";

const PAGE_SIZE = 8;

const DEMO_EARNING_SUMMARY = [
  { key: "thisMonth" as const, value: "$48" },
  { key: "lastMonth" as const, value: "$62" },
  { key: "totalEarned" as const, value: "$310" },
  { key: "pending" as const, value: "$12" },
];

const EMPTY_EARNING_SUMMARY = [
  { key: "thisMonth" as const, value: "$0" },
  { key: "lastMonth" as const, value: "$0" },
  { key: "totalEarned" as const, value: "$0" },
  { key: "pending" as const, value: "$0" },
];

export default function UserEarningsLayout() {
  const { t } = useLocale();
  const { demoOrEmpty } = useIsDemoAccount();
  const earningRows = demoOrEmpty(EARNING_ROWS, [] as typeof EARNING_ROWS);
  const summaryValues = demoOrEmpty(DEMO_EARNING_SUMMARY, EMPTY_EARNING_SUMMARY);
  const p = t.userPages.earnings;
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"Up" | "Down">("Down");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    if (!search.trim()) return earningRows;
    const q = search.toLowerCase();
    return earningRows.filter(
      (r) =>
        r.id.toLowerCase().includes(q) ||
        r.subcategory.toLowerCase().includes(q) ||
        r.commission.toLowerCase().includes(q)
    );
  }, [search, earningRows]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">{p.title}</h1>
        <p className="text-sm text-gray-500 mt-1">{p.subtitle}</p>
      </div>

      <UserStatsRow />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {summaryValues.map((item) => (
          <div key={item.key} className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <p className="text-xs font-bold text-primary">{p[item.key]}</p>
            <p className="text-xl font-bold text-gray-900 mt-1">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-md font-bold text-gray-900">{p.earningHistory}</h3>
          <div className="flex gap-2">
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
                className="w-full sm:w-48 rounded border border-gray-200 bg-white py-1.5 pr-3 pl-8 text-xs focus:outline-none"
              />
            </div>
            <button
              type="button"
              onClick={() => setSort(sort === "Up" ? "Down" : "Up")}
              className="flex items-center gap-1 rounded border border-gray-200 bg-white px-3 py-1.5 text-xs font-bold text-gray-600"
            >
              {sort}
              {sort === "Up" ? (
                <ArrowUp className="h-3.5 w-3.5" />
              ) : (
                <ArrowDown className="h-3.5 w-3.5" />
              )}
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs min-w-[480px]">
            <thead>
              <tr className="bg-primary font-bold text-white uppercase">
                <th className="p-3">ID</th>
                <th className="p-3">Subcategory</th>
                <th className="p-3">Commission</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pageData.map((item, idx) => (
                <tr key={`${item.id}-${idx}`} className="text-gray-700 hover:bg-gray-50">
                  <td className="p-3 font-semibold">{item.id}</td>
                  <td className="p-3 text-gray-500">{item.subcategory}</td>
                  <td className="p-3 font-medium">{item.commission}</td>
                  <td className="p-3">
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-bold ${item.status === "Complete" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}
                    >
                      {item.status}
                    </span>
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
      </div>
    </div>
  );
}
