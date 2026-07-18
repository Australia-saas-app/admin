"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { useLocale } from "@/src/shared/context/locale.provider";
import { useIsDemoAccount } from "@/src/shared/hooks/use-is-demo-account";
import { DashboardTablePagination } from "@/src/modules/dashboard/shared/components/DashboardTablePagination";
import { USER_ORDERS } from "../data/user-demo-data";

const PAGE_SIZE = 8;

const STATUS_COLORS: Record<string, string> = {
  Shipped: "bg-blue-100 text-blue-700",
  Active: "bg-green-100 text-green-700",
  Completed: "bg-emerald-100 text-emerald-700",
  Delivered: "bg-emerald-100 text-emerald-700",
  Scheduled: "bg-violet-100 text-violet-700",
  Processing: "bg-amber-100 text-amber-700",
};

export default function UserOrdersLayout() {
  const { t } = useLocale();
  const { demoOrEmpty } = useIsDemoAccount();
  const orders = demoOrEmpty(USER_ORDERS, [] as typeof USER_ORDERS);
  const p = t.userPages.orders;
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let rows = orders;
    if (filter !== "All") rows = rows.filter((r) => r.service === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.id.toLowerCase().includes(q) ||
          r.service.toLowerCase().includes(q)
      );
    }
    return rows;
  }, [search, filter, orders]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const services = ["All", ...Array.from(new Set(orders.map((o) => o.service)))];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">{p.title}</h1>
        <p className="text-sm text-gray-500 mt-1">{p.subtitle}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: p.totalOrders, value: String(orders.length) },
          {
            label: p.active,
            value: String(
              orders.filter((o) => o.status === "Active" || o.status === "Processing").length
            ),
          },
          {
            label: p.completed,
            value: String(
              orders.filter((o) => o.status === "Completed" || o.status === "Delivered").length
            ),
          },
          { label: p.totalSpent, value: orders.length ? "$8,949" : "$0" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <p className="text-xs font-bold text-primary">{s.label}</p>
            <p className="text-xl font-bold text-gray-900 mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-md font-bold text-gray-900">{p.orderHistory}</h3>
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
                className="w-full sm:w-48 rounded border border-gray-200 py-1.5 pr-3 pl-8 text-xs focus:outline-none"
              />
            </div>
            <select
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value);
                setPage(1);
              }}
              className="rounded border border-gray-200 px-3 py-1.5 text-xs text-gray-700"
            >
              {services.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs min-w-[560px]">
            <thead>
              <tr className="bg-primary text-white uppercase font-bold">
                <th className="p-3 text-left">{p.orderId}</th>
                <th className="p-3 text-left">{p.service}</th>
                <th className="p-3 text-left">{p.item}</th>
                <th className="p-3 text-left">{p.amount}</th>
                <th className="p-3 text-left">{p.status}</th>
                <th className="p-3 text-left">{p.date}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pageData.map((order) => (
                <tr key={order.id} className="text-gray-700 hover:bg-gray-50">
                  <td className="p-3 font-semibold">{order.id}</td>
                  <td className="p-3">{order.service}</td>
                  <td className="p-3 font-medium">{order.title}</td>
                  <td className="p-3">{order.amount}</td>
                  <td className="p-3">
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-bold ${STATUS_COLORS[order.status] ?? "bg-gray-100 text-gray-600"}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="p-3 text-gray-500">{order.date}</td>
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

      <p className="text-xs text-gray-500">
        {p.browseMore}{" "}
        <Link href="/marketplace" className="text-primary font-semibold hover:underline">
          {p.marketplace}
        </Link>
        {" · "}
        <Link href="/courses" className="text-primary font-semibold hover:underline">
          {p.courses}
        </Link>
      </p>
    </div>
  );
}
