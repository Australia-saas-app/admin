"use client";
import Chart from "chart.js/auto";
import React, { useEffect, useRef } from "react";
import { Inter } from "next/font/google";

const inter = Inter({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export const MarketingSeoChart: React.FC = () => {
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    const ctx = document.getElementById("marketingSeoNew") as HTMLCanvasElement;
    if (!ctx) return;

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    // Creating subtle gradients for the bars
    const gradientPurple = ctx.getContext("2d")?.createLinearGradient(0, 0, 0, 400);
    gradientPurple?.addColorStop(0, "rgba(139, 92, 246, 0.8)"); // Purple 500
    gradientPurple?.addColorStop(1, "rgba(139, 92, 246, 0.2)");

    const gradientTeal = ctx.getContext("2d")?.createLinearGradient(0, 0, 0, 400);
    gradientTeal?.addColorStop(0, "rgba(20, 184, 166, 0.8)"); // Teal 500
    gradientTeal?.addColorStop(1, "rgba(20, 184, 166, 0.2)");

    chartRef.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        datasets: [
          {
            label: "Marketing & SEO",
            data: [12000, 25000, 17000, 28000, 15000, 22000, 19000, 27000, 16000, 30000, 18000, 24000],
            backgroundColor: [
              gradientPurple as any,
              gradientTeal as any,
              gradientPurple as any,
              gradientTeal as any,
              gradientPurple as any,
              gradientTeal as any,
              gradientPurple as any,
              gradientTeal as any,
              gradientPurple as any,
              gradientTeal as any,
              gradientPurple as any,
              gradientTeal as any,
            ],
            borderRadius: 6,
            borderSkipped: false,
            barThickness: 16,
            maxBarThickness: 20,
            hoverBackgroundColor: "rgba(139, 92, 246, 1)",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 2000,
          easing: "easeOutExpo",
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            backgroundColor: "rgba(15, 23, 42, 0.9)",
            titleColor: "#fff",
            bodyColor: "#e2e8f0",
            bodyFont: { size: 13, family: "Inter" },
            titleFont: { size: 14, family: "Inter", weight: "bold" },
            padding: 12,
            cornerRadius: 12,
            displayColors: true,
            boxPadding: 4,
            callbacks: {
              label: function (context) {
                return ` ${context.label}: ${context.raw}`;
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 35000,
            ticks: {
              stepSize: 10000,
              callback: function (value) {
                return value === 0 ? "0" : Number(value) / 1000 + "K";
              },
              padding: 10,
              font: { family: "Inter", size: 11 },
              color: "#94a3b8", // slate-400
            },
            grid: {
              display: true,
              color: "rgba(203, 213, 225, 0.2)", // very light slate
              drawTicks: false,
            },
            border: { display: false, dash: [5, 5] },
          },
          x: {
            grid: { display: false },
            border: { display: false },
            ticks: {
              padding: 10,
              font: { family: "Inter", size: 10, weight: "bold" },
              color: "#64748b", // slate-500
              maxRotation: 0,
            },
          },
        },
        layout: {
          padding: { top: 20, bottom: 10, left: 0, right: 0 },
        },
      },
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  return (
    <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm p-6 flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className={`${inter.className} text-gray-900 dark:text-gray-100 text-lg font-bold tracking-tight`}>
          Marketing & SEO
        </h2>
        <div className="flex gap-2">
          <button className="px-3 py-1 text-xs font-bold rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 transition-colors">
            Monthly
          </button>
          <button className="px-3 py-1 text-xs font-semibold rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors">
            Yearly
          </button>
        </div>
      </div>
      <div className="flex-1 min-h-[250px] relative w-full h-[300px]">
        <canvas id="marketingSeoNew"></canvas>
      </div>
    </div>
  );
};

export default MarketingSeoChart;
