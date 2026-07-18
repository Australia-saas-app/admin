"use client";

import { useLocale } from "@/src/shared/context/locale.provider";

export function DashboardStatsRow() {
  const { t } = useLocale();

  const stats = [
    { label: t.business.dashboard.totalProject, value: "150" },
    { label: t.business.dashboard.pendingProject, value: "10" },
    { label: t.business.dashboard.successfulProjects, value: "100" },
    { label: t.business.dashboard.totalCommission, value: "$150" },
    { label: t.business.dashboard.totalWithdrawn, value: "$100" },
    { label: t.business.dashboard.currentBalance, value: "$50", highlight: true },
  ];

  return (
    <div className="flex flex-wrap items-stretch gap-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`min-w-[130px] flex-1 rounded border p-4 shadow-sm ${
            "highlight" in stat
              ? "border-primary bg-primary text-white"
              : "border-gray-100 bg-white"
          }`}
        >
          <p
            className={`mb-1 text-xs font-bold ${"highlight" in stat ? "text-white/80" : "text-primary"}`}
          >
            {stat.label}
          </p>
          <h3
            className={`text-xl font-bold ${"highlight" in stat ? "text-white" : "text-gray-900"}`}
          >
            {stat.value}
          </h3>
        </div>
      ))}
    </div>
  );
}
