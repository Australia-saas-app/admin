"use client";

import { useLocale } from "@/src/shared/context/locale.provider";
import { AFFILIATE_STATS } from "../data/affiliate-demo-data";
import { useIsDemoAccount } from "@/src/shared/hooks/use-is-demo-account";
import { EMPTY_AFFILIATE_STATS } from "@/src/shared/lib/dashboard-empty-stats";

export function AffiliateStatsRow() {
  const { t } = useLocale();
  const { demoOrEmpty } = useIsDemoAccount();
  const a = t.affiliatePages.dashboard;
  const stats = demoOrEmpty(AFFILIATE_STATS, EMPTY_AFFILIATE_STATS);

  const items = [
    { label: a.totalReferrals, value: String(stats.totalReferrals) },
    { label: a.activeReferrals, value: String(stats.activeReferrals) },
    { label: a.conversionRate, value: stats.conversionRate },
    { label: a.totalCommission, value: stats.totalCommission },
    { label: a.totalWithdrawn, value: stats.totalWithdrawn },
    { label: a.currentBalance, value: stats.currentBalance, highlight: true },
  ];

  return (
    <div className="flex flex-wrap items-stretch gap-3">
      {items.map((stat) => (
        <div
          key={stat.label}
          className={`min-w-[130px] flex-1 rounded-xl border p-4 shadow-sm ${
            stat.highlight ? "border-primary bg-primary text-white" : "border-gray-100 bg-white"
          }`}
        >
          <p
            className={`mb-1 text-xs font-bold ${stat.highlight ? "text-white/80" : "text-primary"}`}
          >
            {stat.label}
          </p>
          <h3 className={`text-xl font-bold ${stat.highlight ? "text-white" : "text-gray-900"}`}>
            {stat.value}
          </h3>
        </div>
      ))}
    </div>
  );
}
