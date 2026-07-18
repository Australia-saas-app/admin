"use client";

import { useMemo, useState } from "react";
import { Search, Users, Copy } from "lucide-react";
import { toast } from "sonner";
import { useLocale } from "@/src/shared/context/locale.provider";
import { useIsDemoAccount } from "@/src/shared/hooks/use-is-demo-account";
import { useUser } from "@/src/context/user.provider";
import { getAffiliateReferralCode } from "@/src/shared/lib/demo-user";
import { DashboardTablePagination } from "@/src/modules/dashboard/shared/components/DashboardTablePagination";
import { AFFILIATE_REFERRALS } from "../data/affiliate-demo-data";

const PAGE_SIZE = 8;
const STATUS_COLORS: Record<string, string> = {
  Active: "bg-green-100 text-green-700",
  Converted: "bg-blue-100 text-blue-700",
  Pending: "bg-amber-100 text-amber-700",
};

export default function AffiliateReferralsLayout() {
  const { t } = useLocale();
  const { user } = useUser();
  const { demoOrEmpty } = useIsDemoAccount();
  const referrals = demoOrEmpty(AFFILIATE_REFERRALS, [] as typeof AFFILIATE_REFERRALS);
  const referralCode = getAffiliateReferralCode(user);
  const p = t.affiliatePages.referrals;
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let rows = referrals;
    if (filter !== "All") rows = rows.filter((r) => r.service === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.email.toLowerCase().includes(q) ||
          r.id.toLowerCase().includes(q)
      );
    }
    return rows;
  }, [search, filter, referrals]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const services = ["All", ...Array.from(new Set(referrals.map((r) => r.service)))];

  const copyLink = () => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    navigator.clipboard?.writeText(`${origin}/?ref=${referralCode}`);
    toast.success(p.linkCopied);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">{p.title}</h1>
          <p className="text-sm text-gray-500 mt-1">{p.subtitle}</p>
          <p className="text-xs text-gray-400 mt-1 font-mono">Your code: {referralCode}</p>
        </div>
        <button
          type="button"
          onClick={copyLink}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-primary/90"
        >
          <Copy className="h-4 w-4" /> {p.copyLink}
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: p.totalReferrals, value: String(referrals.length) },
          { label: p.active, value: String(referrals.filter((r) => r.status === "Active").length) },
          {
            label: p.converted,
            value: String(referrals.filter((r) => r.status === "Converted").length),
          },
          { label: p.totalCommission, value: referrals.length ? "$135" : "$0" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <p className="text-xs font-bold text-primary">{s.label}</p>
            <p className="text-xl font-bold text-gray-900 mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <h3 className="text-md font-bold text-gray-900">{p.referralList}</h3>
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
                className="w-full sm:w-48 rounded border border-gray-200 py-1.5 pr-3 pl-8 text-xs focus:outline-none"
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
              {services.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs min-w-[600px]">
            <thead>
              <tr className="bg-primary font-bold text-white uppercase">
                <th className="p-3">ID</th>
                <th className="p-3">{p.name}</th>
                <th className="p-3">{p.email}</th>
                <th className="p-3">{p.service}</th>
                <th className="p-3">{p.commission}</th>
                <th className="p-3">{p.status}</th>
                <th className="p-3">{p.date}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pageData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-500">
                    No referrals yet. Share your link to get started.
                  </td>
                </tr>
              ) : (
                pageData.map((row) => (
                  <tr key={row.id} className="text-gray-700 hover:bg-gray-50">
                    <td className="p-3 font-semibold">{row.id}</td>
                    <td className="p-3">{row.name}</td>
                    <td className="p-3 text-gray-500">{row.email}</td>
                    <td className="p-3">{row.service}</td>
                    <td className="p-3 font-medium">{row.commission}</td>
                    <td className="p-3">
                      <span
                        className={`rounded px-2 py-0.5 text-[10px] font-bold ${STATUS_COLORS[row.status] ?? "bg-gray-100 text-gray-600"}`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="p-3 text-gray-500">{row.date}</td>
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
