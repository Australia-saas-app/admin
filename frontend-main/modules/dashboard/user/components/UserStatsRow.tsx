"use client";

import { useLocale } from "@/src/shared/context/locale.provider";
import { useIsDemoAccount } from "@/src/shared/hooks/use-is-demo-account";
import { USER_STATS } from "../data/user-demo-data";

const EMPTY_USER_STATS = {
  totalProjects: 0,
  activeProjects: 0,
  completedProjects: 0,
  totalEarnings: "$0",
  totalWithdrawn: "$0",
  currentBalance: "$0",
  pendingPayments: 0,
  unreadNotices: 0,
  unreadMessages: 0,
} as const;

export function UserStatsRow() {
  const { t } = useLocale();
  const { isDemo } = useIsDemoAccount();
  const u = t.userPages.dashboard;
  const statsSource = isDemo ? USER_STATS : EMPTY_USER_STATS;

  const stats = [
    { label: u.totalProjects, value: String(statsSource.totalProjects) },
    { label: u.activeProjects, value: String(statsSource.activeProjects) },
    { label: u.completedProjects, value: String(statsSource.completedProjects) },
    { label: u.totalEarnings, value: statsSource.totalEarnings },
    { label: u.totalWithdrawn, value: statsSource.totalWithdrawn },
    { label: u.currentBalance, value: statsSource.currentBalance, highlight: true },
  ];

  return (
    <div className="flex flex-wrap items-stretch gap-3">
      {stats.map((stat) => (
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
