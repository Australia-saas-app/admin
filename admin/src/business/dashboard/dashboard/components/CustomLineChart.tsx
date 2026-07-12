"use client";
import Chart from "chart.js/auto";
import React, { useEffect, useRef } from "react";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];

const visitorData = {
  totalUsers:      [4000,  5500,  7000,  8000,  19500, 22000, 26000],
  totalAgent:      [3500,  5000,  6500,  7000,  14000, 16000, 18000],
  newVisitors:     [3000,  4500,  5500,  4000,  8000,  10000, 9500],
  oldVisitors:     [5500,  6000,  7500,  6000,  11000, 8000,  10000],
  lastMonthVis:    [2500,  3000,  4000,  2500,  5500,  6500,  8000],
  avgVisitors:     [2000,  2500,  3000,  2000,  4000,  5000,  6500],
};

const legend = [
  { label: "Total Users",           color: "#EAB308" },
  { label: "Total Agent",           color: "#1e293b" },
  { label: "New visitors",          color: "#3B82F6" },
  { label: "Old visitors",          color: "#A855F7" },
  { label: "Last month's visitors", color: "#94a3b8", dashed: true },
  { label: "Average visitors",      color: "#94a3b8", dashed: true, lighter: true },
];

export const CustomLineChart: React.FC = () => {
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    const ctx = document.getElementById("visitorAnalyticsChart") as HTMLCanvasElement;
    if (!ctx) return;

    const datasets = [
      {
        label: "Total Users",
        data: visitorData.totalUsers,
        borderColor: "#EAB308",
        backgroundColor: "transparent",
        borderWidth: 2.5,
        tension: 0.4,
        fill: false,
        pointBackgroundColor: "#EAB308",
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: "Total Agent",
        data: visitorData.totalAgent,
        borderColor: "#1e293b",
        backgroundColor: "transparent",
        borderWidth: 2.5,
        tension: 0.4,
        fill: false,
        pointBackgroundColor: "#1e293b",
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: "New visitors",
        data: visitorData.newVisitors,
        borderColor: "#3B82F6",
        backgroundColor: "transparent",
        borderWidth: 2,
        tension: 0.4,
        fill: false,
        pointBackgroundColor: "#3B82F6",
        pointRadius: 3,
        pointHoverRadius: 5,
      },
      {
        label: "Old visitors",
        data: visitorData.oldVisitors,
        borderColor: "#A855F7",
        backgroundColor: "transparent",
        borderWidth: 2,
        tension: 0.4,
        fill: false,
        pointBackgroundColor: "#A855F7",
        pointRadius: 3,
        pointHoverRadius: 5,
      },
      {
        label: "Last month's visitors",
        data: visitorData.lastMonthVis,
        borderColor: "#94a3b8",
        backgroundColor: "transparent",
        borderWidth: 1.5,
        borderDash: [6, 4],
        tension: 0.4,
        fill: false,
        pointBackgroundColor: "#ffffff",
        pointBorderColor: "#94a3b8",
        pointBorderWidth: 1.5,
        pointRadius: 3,
        pointHoverRadius: 5,
      },
      {
        label: "Average visitors",
        data: visitorData.avgVisitors,
        borderColor: "#cbd5e1",
        backgroundColor: "transparent",
        borderWidth: 1.5,
        borderDash: [4, 4],
        tension: 0.4,
        fill: false,
        pointBackgroundColor: "#ffffff",
        pointBorderColor: "#cbd5e1",
        pointBorderWidth: 1.5,
        pointRadius: 3,
        pointHoverRadius: 5,
      },
    ];

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    chartRef.current = new Chart(ctx, {
      type: "line",
      data: { labels: months, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "#ffffff",
            titleColor: "#1e293b",
            bodyColor: "#475569",
            borderColor: "#e2e8f0",
            borderWidth: 1,
            padding: 12,
            cornerRadius: 8,
            callbacks: {
              label: (ctx: any) => `${ctx.dataset.label} : ${ctx.parsed.y.toLocaleString()}`,
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: "#94a3b8", font: { size: 12 } },
            border: { display: false },
          },
          y: {
            beginAtZero: true,
            max: 28000,
            grid: { color: "rgba(226,232,240,0.6)" },
            ticks: {
              color: "#94a3b8",
              font: { size: 11 },
              stepSize: 6500,
              callback: (v: any) => v.toLocaleString(),
            },
            border: { display: false },
          },
        },
        interaction: { intersect: false, mode: "index" },
      },
    } as any);

    return () => { chartRef.current?.destroy(); };
  }, []);

  return (
    <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm p-6 flex flex-col h-full">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-base font-semibold text-gray-900 dark:text-white">Visitor Analytics</h2>
        <p className="text-xs text-slate-400 mt-0.5">Monthly visitor trends and statistics</p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-4 gap-y-1.5 mb-5">
        {legend.map((l) => (
          <div key={l.label} className="flex items-center gap-1.5">
            <span
              className="inline-block w-3 h-3 rounded-full border-2"
              style={{
                backgroundColor: l.dashed ? "transparent" : l.color,
                borderColor: l.color,
                borderStyle: l.dashed ? "dashed" : "solid",
              }}
            />
            <span className="text-[11px] text-slate-500 font-medium">{l.label}</span>
          </div>
        ))}
      </div>

      {/* Chart Canvas */}
      <div className="relative flex-1 w-full min-h-[260px]">
        <canvas id="visitorAnalyticsChart" />
      </div>
    </div>
  );
};

export default CustomLineChart;
