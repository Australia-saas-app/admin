"use client";
import Chart from "chart.js/auto";
import React, { useEffect, useRef } from "react";
import { Inter } from "next/font/google";

const inter = Inter({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

export const TrafficLocationChart: React.FC = () => {
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    const ctx = document.getElementById("trafficLocationNew") as HTMLCanvasElement;
    if (!ctx) return;

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    // Define premium solid colors for the doughnut
    const colors = [
      "rgba(139, 92, 246, 1)", // Purple 500
      "rgba(59, 130, 246, 1)", // Blue 500
      "rgba(20, 184, 166, 1)", // Teal 500
      "rgba(209, 213, 219, 1)", // Gray 300
    ];

    chartRef.current = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["United States", "Canada", "Mexico", "Other"],
        datasets: [
          {
            label: "Location",
            data: [38.6, 22.5, 30.8, 8.1],
            backgroundColor: colors,
            borderWidth: 0,
            spacing: 5,
            hoverOffset: 10,
            borderRadius: 8,
          },
        ],
      },
      options: {
        responsive: true,
        cutout: "75%",
        animation: {
          animateScale: true,
          animateRotate: true,
          duration: 2000,
          easing: "easeOutQuart",
        },
        plugins: {
          legend: {
            display: false, // We will build a custom HTML legend
          },
          tooltip: {
            backgroundColor: "rgba(15, 23, 42, 0.9)",
            titleColor: "#fff",
            bodyColor: "#e2e8f0",
            bodyFont: {
              size: 13,
              family: "Inter",
            },
            padding: 12,
            cornerRadius: 12,
            displayColors: true,
            boxPadding: 6,
            callbacks: {
              label: function (context) {
                return ` ${context.label}: ${context.raw}%`;
              },
            },
          },
        },
        maintainAspectRatio: false,
        layout: {
          padding: 10,
        },
      },
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  const legendData = [
    { label: "United States", value: "38.6%", color: "bg-purple-500" },
    { label: "Mexico", value: "30.8%", color: "bg-teal-500" },
    { label: "Canada", value: "22.5%", color: "bg-blue-500" },
    { label: "Other", value: "8.1%", color: "bg-gray-300" },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm p-6 flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className={`${inter.className} text-gray-900 dark:text-gray-100 text-lg font-bold tracking-tight`}>
          Traffic Location
        </h2>
        <button className="w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center transition-colors text-gray-400 hover:text-purple-600">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
        </button>
      </div>
      
      <div className="flex-1 flex flex-col xl:flex-row items-center justify-center gap-8 w-full h-[300px]">
        {/* Doughnut Chart Canvas */}
        <div className="relative w-[200px] h-[200px] xl:w-[220px] xl:h-[220px] shrink-0">
          <canvas id="trafficLocationNew"></canvas>
          {/* Inner overlay text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">38<span className="text-xl">%</span></span>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">USA</span>
          </div>
        </div>

        {/* Custom Legend */}
        <div className="flex flex-col gap-4 w-full max-w-[200px]">
          {legendData.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between group/item">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${item.color} shadow-sm transition-transform group-hover/item:scale-125`}></div>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300 transition-colors group-hover/item:text-gray-900 dark:group-hover/item:text-white">{item.label}</span>
              </div>
              <span className="text-sm font-bold text-gray-900 dark:text-white">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrafficLocationChart;
