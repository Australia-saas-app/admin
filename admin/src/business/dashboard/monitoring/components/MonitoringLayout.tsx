"use client";

import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import { Play, RotateCw, Search, Database, Zap, FileCode2, LineChart, Activity } from "lucide-react";

const gaugeNeedlePlugin = {
  id: "gaugeNeedle",
  afterDatasetDraw(chart: any, args: any, options: any) {
    const { ctx, config, data, chartArea: { top, bottom, left, right, width, height } } = chart;
    ctx.save();
    
    // Calculate needle angle
    const needleValue = data.datasets[0].needleValue || 0;
    const dataTotal = data.datasets[0].data.reduce((a: number, b: number) => a + b, 0);
    const angle = Math.PI + (1 / dataTotal * needleValue * Math.PI);
    
    const cx = width / 2;
    // For a half doughnut, the center y is at the bottom of the chart area.
    const cy = chart.chartArea.bottom;
    
    const needleColor = options.needleColor || "#64748b";
    
    // Get inner radius to make needle reach the arc exactly
    const meta = chart.getDatasetMeta(0);
    const innerRadius = meta.data[0] ? meta.data[0].innerRadius : 30;
    const needleLength = innerRadius - 2;

    // Draw Needle
    ctx.translate(cx, cy);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(0, -3);
    ctx.lineTo(needleLength, 0); // extend exactly to the arc
    ctx.lineTo(0, 3);
    ctx.fillStyle = needleColor;
    ctx.fill();
    
    // Draw Needle Center dot
    ctx.translate(-cx, -cy);
    ctx.beginPath();
    ctx.arc(cx, cy, 6, 0, 10);
    ctx.fillStyle = "#333";
    ctx.fill();
    ctx.restore();
  }
};

const Gauge = ({ 
  id, title, color, value, max, unit, labelLeft, labelRight, needleColor 
}: { 
  id: string, title: string, color: string, value: number, max: number, unit: string, labelLeft: string, labelRight: string, needleColor?: string 
}) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const myChartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;
    const ctx = chartRef.current;

    // Destroy existing chart if it exists
    if (myChartRef.current) {
        myChartRef.current.destroy();
    }

    myChartRef.current = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Value", "Remaining"],
        datasets: [{
          data: [value, max - value],
          backgroundColor: [color, "#e2e8f0"],
          borderWidth: 0,
          needleValue: value // custom property for the plugin
        } as any]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        rotation: -90,
        circumference: 180,
        cutout: "75%",
        layout: {
            padding: {
                bottom: 10
            }
        },
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false },
          gaugeNeedle: {
            needleColor: needleColor || "#64748b"
          }
        } as any
      },
      plugins: [gaugeNeedlePlugin]
    });

    return () => {
      if (myChartRef.current) {
          myChartRef.current.destroy();
      }
    };
  }, [value, max, color, needleColor]);

  return (
    <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 flex flex-col items-center shadow-sm w-full relative">
      <h3 className="text-[11px] font-bold text-slate-500 mb-2 whitespace-nowrap">{title}</h3>
      <div className="w-full h-[100px] flex justify-center">
        <canvas ref={chartRef}></canvas>
      </div>
      <div className="w-full flex justify-center items-center text-center -mt-1">
        <span className="text-xl font-bold text-slate-800 dark:text-slate-100 leading-none">{value}</span>
      </div>
      <div className="flex justify-between w-full text-[9px] text-slate-400 font-medium px-2 mt-2">
        <div className="flex flex-col items-start"><span className="text-slate-700 dark:text-slate-300 font-bold">{labelLeft}</span><span>{unit}</span></div>
        <div className="flex flex-col items-end"><span className="text-slate-700 dark:text-slate-300 font-bold">{labelRight}</span></div>
      </div>
    </div>
  );
};

const LineMetrics = ({ id, title, color, data, labels, unit, rightValue }: { id: string, title: string, color: string, data: number[], labels: string[], unit: string, rightValue: string }) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const myChartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;
    const ctx = chartRef.current;

    if (myChartRef.current) {
        myChartRef.current.destroy();
    }

    myChartRef.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [{
          label: title,
          data: data,
          borderColor: color,
          backgroundColor: color + "33", // hex alpha
          borderWidth: 2,
          fill: true,
          tension: 0.3,
          pointRadius: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: { display: true, grid: { display: false } },
          y: { display: true, border: { display: false } }
        }
      }
    });

    return () => {
      if (myChartRef.current) {
          myChartRef.current.destroy();
      }
    };
  }, [data, labels, color, title]);

  return (
    <div className="flex flex-col h-[200px] w-full">
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-[11px] font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap overflow-hidden text-ellipsis mr-2">{title}</h4>
        <div className="text-[10px] font-bold text-right shrink-0">
          <div className="text-slate-400">{unit}</div>
          <div style={{ color: color }}>{rightValue}</div>
        </div>
      </div>
      <div className="flex-1 relative w-full h-full">
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
};

export default function MonitoringLayout() {
  const [activeTab, setActiveTab] = useState("Monitoring");

  const tabs = ["Monitoring", "Database", "Cache", "PHP"];

  const dummyLineLabels = ["11:26", "11:27", "11:28", "11:29", "11:30"];
  const dummyLineData1 = [2, 50, 2, 2, 4];
  const dummyLineData2 = [2.0, 2.0, 2.4, 2.0, 2.0];
  const dummyLineData3 = [0.2, 0.25, 0.2, 0.2, 0.2];
  const dummyLineData4 = [2, 12, 4, 10, 2];

  return (
    <div className="p-4 sm:p-6 w-full max-w-full overflow-hidden min-h-[70vh] bg-slate-50 dark:bg-slate-950">
      
      {/* Gauges Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <Gauge id="g1" title="CPU Usage" color="#f97316" value={6.5} max={17.2} unit="percentage" labelLeft="0.0" labelRight="17.2" needleColor="#94a3b8" />
        <Gauge id="g2" title="Nginx Connections" color="#06b6d4" value={2.0} max={3.0} unit="connections" labelLeft="0.00" labelRight="3.00" needleColor="#94a3b8" />
        <Gauge id="g3" title="Nginx Requests" color="#84cc16" value={10.0} max={24.5} unit="requests/s" labelLeft="0.0" labelRight="24.5" needleColor="#94a3b8" />
        <Gauge id="g4" title="Network IN" color="#3b82f6" value={104.2} max={299.3} unit="kilobits/s" labelLeft="0.0" labelRight="299.3" needleColor="#94a3b8" />
        <Gauge id="g5" title="Network OUT" color="#e2e8f0" value={0.17} max={3.39} unit="megabits/s" labelLeft="0.00" labelRight="3.39" needleColor="#ef4444" />
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 bg-white dark:bg-slate-900 p-2 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm w-full items-center justify-between">
        <div className="flex gap-2 w-full">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 rounded-lg font-bold text-sm transition-all shadow-sm flex items-center justify-center ${
                activeTab === tab
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              }`}
            >
              {tab === "Database" && <Database size={16} className="mr-2 hidden sm:inline" />}
              {tab === "Cache" && <Zap size={16} className="mr-2 hidden sm:inline" />}
              {tab === "PHP" && <FileCode2 size={16} className="mr-2 hidden sm:inline" />}
              {tab === "Monitoring" && <Activity size={16} className="mr-2 hidden sm:inline" />}
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left: Main Metrics */}
        <div className="xl:col-span-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <LineChart className="text-blue-600" size={18} /> Main Metrics
            </h2>
            <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold rounded-md shadow-sm transition-all uppercase tracking-wide">
              See all
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <LineMetrics id="lm1" title="Total CPU utilization (system.cpu)" color="#d946ef" data={dummyLineData1} labels={dummyLineLabels} unit="percentage" rightValue="2.0 user" />
            <LineMetrics id="lm2" title="System RAM (system.ram)" color="#3b82f6" data={dummyLineData3} labels={dummyLineLabels} unit="GiB" rightValue="3.24 free" />
            <LineMetrics id="lm3" title="Active Connections (nginx.connections)" color="#0ea5e9" data={dummyLineData2} labels={dummyLineLabels} unit="connections" rightValue="2.00 active" />
            <LineMetrics id="lm4" title="Requests (nginx.requests)" color="#06b6d4" data={dummyLineData4} labels={dummyLineLabels} unit="requests/s" rightValue="8.4 requests" />
          </div>
        </div>

        {/* Right: Status */}
        <div className="xl:col-span-1 bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 shadow-sm flex flex-col h-full">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <span className="text-blue-600">☑️</span> Status
            </h2>
            <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold rounded-md shadow-sm transition-all uppercase tracking-wide">
              See all
            </button>
          </div>

          <div className="flex flex-col gap-5 flex-1">
            {[
              { label: "CPU", val: "10min cpu usage", num: "7.58%" },
              { label: "Load Average", val: "load average 15", num: "0.32 load" },
              { label: "RAM in use", val: "ram in use", num: "7.78%" },
              { label: "RAM available", val: "ram available", num: "92.2%" },
              { label: "Disk Usage", val: "disk space usage", num: "55.2%" },
              { label: "System Entropy", val: "lowest entropy", num: "2902 entries" },
            ].map((stat, i) => (
              <div key={i} className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800/50 pb-3 last:border-0 last:pb-0">
                <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">{stat.label}</span>
                <div className="flex items-center text-[9px] font-bold rounded-sm overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm">
                  <span className="bg-slate-600 dark:bg-slate-700 text-white px-2 py-0.5">{stat.val}</span>
                  <span className="bg-green-500 text-white px-2 py-0.5">{stat.num}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Bottom: Overview */}
      <div className="mt-6 bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 shadow-sm w-full lg:w-1/2">
        <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-4">Overview</h2>
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800">
                <th className="pb-2 font-bold text-slate-700 dark:text-slate-300">Service Name</th>
                <th className="pb-2 font-bold text-slate-700 dark:text-slate-300">Version</th>
                <th className="pb-2 font-bold text-slate-700 dark:text-slate-300">Status</th>
                <th className="pb-2 font-bold text-slate-700 dark:text-slate-300">PID</th>
                <th className="pb-2 font-bold text-slate-700 dark:text-slate-300">Control</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: "Caddy", ver: "2.8.4", pid: "97765" },
                { name: "Redis", ver: "7.2.4", pid: "1242" },
                { name: "Mailpit", ver: "1.20.5", pid: "1149" },
              ].map((svc, i) => (
                <tr key={i} className="border-b border-slate-100 dark:border-slate-800/50 last:border-0">
                  <td className="py-2.5 font-bold text-slate-600 dark:text-slate-400">{svc.name}</td>
                  <td className="py-2.5 font-medium text-slate-500">{svc.ver}</td>
                  <td className="py-2.5">
                    <span className="bg-green-500 text-white px-2 py-0.5 rounded text-[10px] font-bold shadow-sm">Running</span>
                  </td>
                  <td className="py-2.5 font-medium text-slate-500">{svc.pid}</td>
                  <td className="py-2.5">
                    <div className="flex gap-1.5">
                      <button className="text-orange-500 hover:text-orange-600 p-1 border border-orange-200 bg-orange-50 rounded"><Play size={12} className="fill-current" /></button>
                      <button className="text-blue-500 hover:text-blue-600 p-1 border border-blue-200 bg-blue-50 rounded"><RotateCw size={12} /></button>
                      <button className="text-slate-500 hover:text-slate-700 border border-slate-200 bg-slate-50 rounded p-1"><Search size={12} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
