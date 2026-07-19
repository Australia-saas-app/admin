"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  Search,
  ArrowRight,
  Bell,
  MessageSquare,
  ShoppingBag,
} from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  CHART_DATA,
  EARNING_ROWS,
  WITHDRAW_ROWS,
  type WithdrawRow,
} from "@/src/modules/dashboard/shared/data/dashboard-demo-data";
import { DashboardTablePagination } from "@/src/modules/dashboard/shared/components/DashboardTablePagination";
import { sortByMoney, sortByString } from "@/src/modules/dashboard/shared/utils/sort-rows";
import RecordDetailDrawer from "@/src/modules/dashboard/shared/components/RecordDetailDrawer";
import { withdrawDetailFields } from "@/src/modules/dashboard/shared/utils/withdraw-detail";
import { useLocale } from "@/src/shared/context/locale.provider";
import { useIsDemoAccount } from "@/src/shared/hooks/use-is-demo-account";
import { UserStatsRow } from "./UserStatsRow";
import { USER_RECENT_ACTIVITY, USER_SERVICE_SHORTCUTS, USER_STATS } from "../data/user-demo-data";

const PAGE_SIZE = 5;

export default function UserDashboardLayout() {
  const { t } = useLocale();
  const { demoOrEmpty } = useIsDemoAccount();
  const u = t.userPages.dashboard;
  const withdrawSource = demoOrEmpty(WITHDRAW_ROWS, [] as typeof WITHDRAW_ROWS);
  const earningSource = demoOrEmpty(EARNING_ROWS, [] as typeof EARNING_ROWS);
  const recentActivity = demoOrEmpty(USER_RECENT_ACTIVITY, [] as typeof USER_RECENT_ACTIVITY);
  const chartData = demoOrEmpty(CHART_DATA, [] as typeof CHART_DATA);
  const userStats = demoOrEmpty(USER_STATS, {
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    totalEarnings: "$0",
    totalWithdrawn: "$0",
    currentBalance: "$0",
    pendingPayments: 0,
    unreadNotices: 0,
    unreadMessages: 0,
  });
  const [withdrawSearch, setWithdrawSearch] = useState("");
  const [earningSearch, setEarningSearch] = useState("");
  const [withdrawSort, setWithdrawSort] = useState<"Up" | "Down">("Down");
  const [earningSort, setEarningSort] = useState<"Up" | "Down">("Up");
  const [withdrawPage, setWithdrawPage] = useState(1);
  const [earningPage, setEarningPage] = useState(1);
  const [withdrawDetailOpen, setWithdrawDetailOpen] = useState(false);
  const [selectedWithdraw, setSelectedWithdraw] = useState<WithdrawRow | null>(null);

  const filteredWithdraw = useMemo(() => {
    let rows = withdrawSearch.trim()
      ? withdrawSource.filter(
          (r) =>
            r.id.toLowerCase().includes(withdrawSearch.toLowerCase()) ||
            r.method.toLowerCase().includes(withdrawSearch.toLowerCase()) ||
            r.amount.toLowerCase().includes(withdrawSearch.toLowerCase()) ||
            r.status.toLowerCase().includes(withdrawSearch.toLowerCase())
        )
      : withdrawSource;
    return sortByMoney(rows, (r) => r.amount, withdrawSort);
  }, [withdrawSearch, withdrawSort, withdrawSource]);

  const filteredEarning = useMemo(() => {
    let rows = earningSearch.trim()
      ? earningSource.filter(
          (r) =>
            r.id.toLowerCase().includes(earningSearch.toLowerCase()) ||
            r.subcategory.toLowerCase().includes(earningSearch.toLowerCase()) ||
            r.commission.toLowerCase().includes(earningSearch.toLowerCase()) ||
            r.status.toLowerCase().includes(earningSearch.toLowerCase())
        )
      : earningSource;
    return sortByMoney(rows, (r) => r.commission, earningSort);
  }, [earningSearch, earningSort, earningSource]);

  const withdrawPages = Math.max(1, Math.ceil(filteredWithdraw.length / PAGE_SIZE));
  const earningPages = Math.max(1, Math.ceil(filteredEarning.length / PAGE_SIZE));
  const withdrawData = filteredWithdraw.slice(
    (withdrawPage - 1) * PAGE_SIZE,
    withdrawPage * PAGE_SIZE
  );
  const earningData = filteredEarning.slice((earningPage - 1) * PAGE_SIZE, earningPage * PAGE_SIZE);

  const quickLinks = [
    { label: t.dashboard.user.wallet, href: "/user/wallet", desc: u.walletDesc },
    { label: t.dashboard.user.earnings, href: "/user/earnings", desc: u.earningsDesc },
    { label: t.dashboard.user.technical, href: "/user/technical", desc: u.technicalDesc },
    { label: t.dashboard.user.orders, href: "/user/orders", desc: u.ordersDesc },
    {
      label: t.dashboard.user.notices,
      href: "/user/notices",
      desc: u.noticesDesc,
      badge: userStats.unreadNotices,
    },
    {
      label: t.dashboard.user.messages,
      href: "/user/messages",
      desc: u.messagesDesc,
      badge: userStats.unreadMessages,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">{u.title}</h1>
        <p className="text-sm text-gray-500 mt-1">{u.subtitle}</p>
      </div>

      <UserStatsRow />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 [&>*]:min-w-0">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="text-md font-bold text-gray-900">{u.overview}</h3>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-800">
                  <span className="h-3 w-3 rounded-full bg-[#0091ff]" />
                  {u.increase}
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                  <span className="h-3 w-3 rounded-full bg-gray-400" />
                  {u.decrease}
                </div>
                <div className="relative">
                  <select className="appearance-none rounded border border-gray-200 bg-white py-1 pr-6 pl-3 text-xs text-gray-600 focus:outline-none">
                    <option>2025</option>
                    <option>2024</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute top-1/2 right-2 h-3 w-3 -translate-y-1/2 text-gray-500" />
                </div>
              </div>
            </div>
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#9ca3af" />
                  <YAxis tick={{ fontSize: 11 }} stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 12 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Increase"
                    stroke="#0091ff"
                    strokeWidth={2}
                    dot={false}
                    name={u.increase}
                  />
                  <Line
                    type="monotone"
                    dataKey="Decrease"
                    stroke="#94a3b8"
                    strokeWidth={2}
                    dot={false}
                    name={u.decrease}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="text-md font-bold text-gray-900">{u.withdrawHistory}</h3>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder={u.search}
                    value={withdrawSearch}
                    onChange={(e) => {
                      setWithdrawSearch(e.target.value);
                      setWithdrawPage(1);
                    }}
                    className="w-48 rounded border border-gray-200 bg-white py-1.5 pr-3 pl-8 text-xs focus:outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setWithdrawSort(withdrawSort === "Up" ? "Down" : "Up")}
                  className="flex items-center gap-1 rounded border border-gray-200 bg-white px-3 py-1.5 text-xs font-bold text-gray-600"
                >
                  {withdrawSort}
                  {withdrawSort === "Up" ? (
                    <ArrowUp className="h-3.5 w-3.5" />
                  ) : (
                    <ArrowDown className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs min-w-[520px]">
                <thead>
                  <tr className="bg-primary font-bold text-white uppercase">
                    <th className="p-3">Transaction ID</th>
                    <th className="p-3">Method</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Date &amp; Time</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {withdrawData.map((item, idx) => (
                    <tr key={`${item.id}-${idx}`} className="text-gray-700 hover:bg-gray-50">
                      <td className="p-3 font-semibold">{item.id}</td>
                      <td className="p-3">{item.method}</td>
                      <td className="p-3">{item.amount}</td>
                      <td className="p-3 text-gray-500">{item.date}</td>
                      <td className="p-3">
                        <span
                          className={`rounded px-2 py-0.5 text-[10px] font-bold ${item.status === "Complete" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedWithdraw(item);
                            setWithdrawDetailOpen(true);
                          }}
                          className="rounded bg-primary px-3 py-1 text-[10px] font-bold text-white hover:bg-primary/90 inline-block"
                        >
                          {u.view}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <DashboardTablePagination
              current={withdrawPage}
              total={withdrawPages}
              pageSize={PAGE_SIZE}
              totalItems={filteredWithdraw.length}
              onChange={setWithdrawPage}
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="text-md font-bold text-gray-900">{u.earningHistory}</h3>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder={u.search}
                    value={earningSearch}
                    onChange={(e) => {
                      setEarningSearch(e.target.value);
                      setEarningPage(1);
                    }}
                    className="w-28 rounded border border-gray-200 bg-white py-1.5 pr-3 pl-8 text-xs focus:outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setEarningSort(earningSort === "Up" ? "Down" : "Up")}
                  className="flex items-center gap-1 rounded border border-gray-200 bg-white px-2 py-1.5 text-xs font-bold text-gray-600"
                >
                  {earningSort}
                  {earningSort === "Up" ? (
                    <ArrowUp className="h-3.5 w-3.5" />
                  ) : (
                    <ArrowDown className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs min-w-[320px]">
                <thead>
                  <tr className="bg-primary font-bold text-white uppercase">
                    <th className="p-3">ID</th>
                    <th className="p-3">Subcategory</th>
                    <th className="p-3">Commission</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {earningData.map((item, idx) => (
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
              current={earningPage}
              total={earningPages}
              pageSize={PAGE_SIZE}
              totalItems={filteredEarning.length}
              onChange={setEarningPage}
              compact
            />
          </div>

          {(userStats.unreadNotices > 0 || userStats.unreadMessages > 0) && (
            <div className="rounded-xl border border-amber-200/80 bg-amber-50/60 p-5 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-amber-900">{u.needsAttention}</h3>
              {userStats.unreadNotices > 0 && (
                <Link
                  href="/user/notices"
                  className="flex items-center gap-2 text-xs font-medium text-amber-800 hover:underline"
                >
                  <Bell className="h-4 w-4" /> {userStats.unreadNotices} {u.unreadNotices}
                </Link>
              )}
              {userStats.unreadMessages > 0 && (
                <Link
                  href="/user/messages"
                  className="flex items-center gap-2 text-xs font-medium text-amber-800 hover:underline"
                >
                  <MessageSquare className="h-4 w-4" /> {userStats.unreadMessages}{" "}
                  {u.unreadMessages}
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {quickLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="group relative rounded-xl border border-gray-100 bg-white p-4 shadow-sm hover:border-primary/30 hover:shadow-md transition-all"
          >
            {link.badge && link.badge > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                {link.badge}
              </span>
            )}
            <p className="font-semibold text-gray-900 text-sm">{link.label}</p>
            <p className="text-[11px] text-gray-500 mt-1 line-clamp-2">{link.desc}</p>
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-primary mt-2 group-hover:underline">
              {u.open} <ArrowRight className="h-3 w-3" />
            </span>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-md font-bold text-gray-900">{u.recentActivity}</h3>
            <Link
              href="/user/profile/user-log"
              className="text-xs font-medium text-primary hover:underline"
            >
              {u.viewAll}
            </Link>
          </div>
          <div className="space-y-0">
            {recentActivity.slice(0, 5).map((item) => (
              <div
                key={item.action}
                className="flex flex-col sm:flex-row sm:justify-between gap-1 py-3 border-b border-gray-100 last:border-0 text-sm"
              >
                <div>
                  <span className="text-gray-700">{item.action}</span>
                  <span className="ml-2 text-[10px] font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                    {item.category}
                  </span>
                </div>
                <span className="text-gray-400 shrink-0 text-xs">{item.date}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <ShoppingBag className="h-5 w-5 text-primary" />
            <h3 className="text-md font-bold text-gray-900">{u.serviceShortcuts}</h3>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {USER_SERVICE_SHORTCUTS.map((svc) => (
              <Link
                key={svc.href}
                href={svc.href}
                className="rounded-lg border border-gray-100 px-3 py-2.5 text-sm hover:bg-gray-50 transition-colors"
              >
                <p className="font-semibold text-gray-800 text-xs">{svc.label}</p>
                <p className="text-[10px] text-gray-500 mt-0.5">{svc.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <RecordDetailDrawer
        open={withdrawDetailOpen}
        onClose={() => setWithdrawDetailOpen(false)}
        title="Withdrawal Details"
        subtitle={selectedWithdraw?.id}
        status={selectedWithdraw?.status}
        fields={selectedWithdraw ? withdrawDetailFields(selectedWithdraw) : []}
      />
    </div>
  );
}
