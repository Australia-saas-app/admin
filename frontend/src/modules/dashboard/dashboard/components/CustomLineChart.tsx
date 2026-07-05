"use client";
import Chart from "chart.js/auto";
import React, { useEffect, useRef } from "react";

export const CustomLineChart: React.FC = () => {
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    const data = {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
      datasets: [
        {
          label: "Total Users",
          data: [10000, 9000, 8000, 10000, 20000, 18000, 20000, 20000],
          borderColor: "#FFB700",
          backgroundColor: "rgba(255, 183, 0, 0.1)",
          borderWidth: 2,
          type: "line",
          tension: 0.4,
          fill: true,
          order: 1,
        },
        {
          label: "Total Projects",
          data: [8000, 10000, 12000, 11000, 14000, 16000, 18000, 19000],
          borderColor: "#4B9CD3",
          backgroundColor: "rgba(75, 156, 211, 0.1)",
          borderWidth: 2,
          type: "line",
          tension: 0.4,
          fill: true,
          order: 1,
        },
        {
          label: "New Visitors",
          data: [5000, 3000, 18000, 15000, 22000, 20000, 15000, 17000],
          borderColor: "#2ED47A",
          backgroundColor: "rgba(46, 212, 122, 0.1)",
          borderWidth: 2,
          type: "line",
          tension: 0.4,
          fill: true,
          order: 1,
        },
        {
          label: "Old Visitors",
          data: [0, 8000, 15000, 12000, 16000, 19000, 14000, 15000],
          borderColor: "#F7685B",
          backgroundColor: "rgba(247, 104, 91, 0.1)",
          borderWidth: 2,
          type: "line",
          tension: 0.4,
          fill: true,
          order: 1,
        },
        {
          label: "Last Month's Visitors",
          data: [5000, 10000, 18000, 5000, 8000, 22000, 25000, 28000],
          borderColor: "#000000",
          backgroundColor: "rgba(0, 0, 0, 0.1)",
          borderWidth: 2,
          type: "line",
          tension: 0.4,
          fill: false,
          order: 1,
          borderDash: [5, 5],
        },
        {
          label: "Average Visitors",
          data: [2000, 5000, 8000, 6000, 10000, 15000, 12000, 14000],
          borderColor: "#885AF8",
          backgroundColor: "rgba(136, 90, 248, 0.1)",
          borderWidth: 2,
          type: "line",
          tension: 0.4,
          fill: true,
          order: 1,
        },
      ],
    };

    const config = {
      type: "line",
      data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: "top" as const,
            align: "start" as const,
            labels: {
              usePointStyle: true,
              pointStyle: "circle",
              padding: 20,
              boxWidth: 6,
              boxHeight: 6,
            },
          },
        },
        scales: {
          x: {
            display: true,
            grid: {
              display: false,
            },
            ticks: {
              padding: 10,
            },
          },
          y: {
            beginAtZero: true,
            max: 30000,
            min: 0,
            position: "left" as const,
            grid: {
              display: false,
            },
            ticks: {
              callback: function (value: any) {
                return value / 1000 + "K";
              },
              padding: 10,
              stepSize: 10000,
              max: 30000,
              min: 0,
            },
          },
        },
        elements: {
          point: {
            radius: 0,
          },
          line: {
            tension: 0.4,
          },
        },
      },
    };

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = document.getElementById("myChart") as HTMLCanvasElement;
    chartRef.current = new Chart(ctx, config as any);
  }, []);

  return (
    <div className="relative mx-auto h-[400px] w-full   bg-[#ffffff] rounded-[20px] shadow-lg">
      <canvas id="myChart" className=""></canvas>
    </div>
  );
};

export default CustomLineChart;
