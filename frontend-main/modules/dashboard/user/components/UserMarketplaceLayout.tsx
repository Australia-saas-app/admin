"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Heart, Gavel, ShoppingCart, ExternalLink } from "lucide-react";
import { useLocale } from "@/src/shared/context/locale.provider";
import { useIsDemoAccount } from "@/src/shared/hooks/use-is-demo-account";
import { DashboardTablePagination } from "@/src/modules/dashboard/shared/components/DashboardTablePagination";
import { USER_MARKETPLACE } from "../data/user-demo-data";

const PAGE_SIZE = 8;

const TYPE_ICONS = {
  Purchase: ShoppingCart,
  Saved: Heart,
  Bid: Gavel,
} as const;

function marketplaceHref(item: (typeof USER_MARKETPLACE)[number]) {
  if (item.type === "Purchase") return `/user/orders?highlight=${item.id}`;
  if (item.type === "Bid") return `/marketplace?item=${item.id}&bid=1`;
  return `/marketplace?item=${item.id}&saved=1`;
}

function actionLabel(type: string) {
  if (type === "Purchase") return "View order";
  if (type === "Bid") return "Continue bid";
  return "View listing";
}

export default function UserMarketplaceLayout() {
  const { t } = useLocale();
  const { demoOrEmpty } = useIsDemoAccount();
  const marketplaceData = demoOrEmpty(USER_MARKETPLACE, [] as typeof USER_MARKETPLACE);
  const router = useRouter();
  const p = t.userPages.marketplace;
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let rows = marketplaceData;
    if (typeFilter !== "All") rows = rows.filter((r) => r.type === typeFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter(
        (r) => r.title.toLowerCase().includes(q) || r.id.toLowerCase().includes(q)
      );
    }
    return rows;
  }, [search, typeFilter, marketplaceData]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">{p.title}</h1>
          <p className="text-sm text-gray-500 mt-1">{p.subtitle}</p>
        </div>
        <Link
          href="/marketplace"
          className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-primary/90"
        >
          {p.browseMarketplace}
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          {
            label: p.purchases,
            value: String(marketplaceData.filter((m) => m.type === "Purchase").length),
          },
          {
            label: p.saved,
            value: String(marketplaceData.filter((m) => m.type === "Saved").length),
          },
          { label: p.bids, value: String(marketplaceData.filter((m) => m.type === "Bid").length) },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm text-center"
          >
            <p className="text-xs font-bold text-primary">{s.label}</p>
            <p className="text-xl font-bold text-gray-900 mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-md font-bold text-gray-900">{p.activity}</h3>
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
                className="w-full sm:w-44 rounded border border-gray-200 py-1.5 pr-3 pl-8 text-xs focus:outline-none"
              />
            </div>
            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setPage(1);
              }}
              className="rounded border border-gray-200 px-3 py-1.5 text-xs"
            >
              {["All", "Purchase", "Saved", "Bid"].map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="space-y-3">
          {pageData.length === 0 ? (
            <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 px-4 py-10 text-center text-sm text-gray-500">
              No marketplace activity yet. Browse the marketplace to purchase, save, or bid on
              items.
            </div>
          ) : (
            pageData.map((item) => {
              const Icon = TYPE_ICONS[item.type as keyof typeof TYPE_ICONS] ?? ShoppingCart;
              const href = marketplaceHref(item);
              return (
                <div
                  key={item.id}
                  role="link"
                  tabIndex={0}
                  onClick={() => router.push(href)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      router.push(href);
                    }
                  }}
                  className="flex items-center gap-4 rounded-lg border border-gray-100 p-4 hover:bg-gray-50/50 cursor-pointer transition-colors"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-sm text-gray-900">{item.title}</p>
                    <p className="text-xs text-gray-500">
                      {item.type} · {item.id} · {item.date}
                    </p>
                  </div>
                  <div className="text-right shrink-0 space-y-1">
                    <p className="font-bold text-sm text-gray-900">{item.price}</p>
                    <span className="text-[10px] font-bold text-primary">{item.status}</span>
                    <Link
                      href={href}
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center justify-end gap-1 text-[10px] font-bold text-primary hover:underline"
                    >
                      {actionLabel(item.type)}
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              );
            })
          )}
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
