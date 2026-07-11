"use client";

import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import {
  RefreshCcw, Maximize, ClipboardList, Mail,
  Settings, Camera, UserCircle, Image as ImageIcon,
  Video, FileText, Headphones, ArrowUpToLine, ArrowDownToLine, MoreVertical
} from "lucide-react";



const StorageGauge = () => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const myChartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;
    const ctx = chartRef.current;

    if (myChartRef.current) {
      myChartRef.current.destroy();
    }

    myChartRef.current = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Used", "Free"],
        datasets: [{
          data: [75, 25],
          backgroundColor: ["#3b82f6", "#e0e7ff"], // blue-500 and blue-100
          borderWidth: 0,
          borderRadius: 20, // Rounded ends for the gauge
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        rotation: -90,
        circumference: 180,
        cutout: "80%",
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false },
        }
      }
    });

    return () => {
      if (myChartRef.current) {
        myChartRef.current.destroy();
      }
    };
  }, []);

  return (
    <div className="relative w-full h-[120px] mt-4">
      <canvas ref={chartRef}></canvas>
      <div className="absolute inset-0 flex flex-col justify-end items-center pointer-events-none pb-2 text-center">
        <span className="text-2xl font-bold text-blue-500 leading-none">75GB</span>
        <span className="text-[10px] font-bold text-blue-500 mt-1 leading-none">used of 100GB</span>
      </div>
    </div>
  );
};

const FolderCard = ({ title, items, icon: Icon, colorClass }: { title: string, items: string, icon: any, colorClass: string }) => (
  <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] flex flex-col items-start w-full transition-transform hover:-translate-y-1 relative">
    <button className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
      <MoreVertical size={16} />
    </button>
    <div className={`p-3 rounded-full mb-4 ${colorClass}`}>
      <Icon size={20} className="text-blue-600 dark:text-blue-400" />
    </div>
    <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm mb-1">{title}</h3>
    <p className="text-[11px] text-slate-400 font-medium">{items} Items</p>
  </div>
);

export default function FilesLayout() {
  return (
    <div className="p-4 sm:p-6 w-full max-w-full overflow-hidden min-h-[85vh] bg-slate-50 dark:bg-slate-950 flex flex-col">

      {/* Main Content Area */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm flex-1 flex flex-col xl:flex-row gap-8">

        {/* Left Side: Folders and Main Area */}
        <div className="flex-1 flex flex-col">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <FolderCard title="Image" items="246" icon={ImageIcon} colorClass="bg-blue-50 dark:bg-blue-900/30" />
            <FolderCard title="Video" items="246" icon={Video} colorClass="bg-blue-50 dark:bg-blue-900/30" />
            <FolderCard title="Documents" items="246" icon={FileText} colorClass="bg-blue-50 dark:bg-blue-900/30" />
            <FolderCard title="Audio" items="246" icon={Headphones} colorClass="bg-blue-50 dark:bg-blue-900/30" />
          </div>

          <div className="flex-1 flex items-center justify-center mt-12 min-h-[200px]">
            <p className="text-[11px] text-slate-500 font-medium">Shows how much data and storage a all service has.</p>
          </div>
        </div>

        {/* Right Side: Sidebar Monitoring */}
        <div className="w-full xl:w-[320px] flex flex-col gap-4">

          {/* Memory Section */}
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-100 dark:border-slate-800">
            <h3 className="text-[11px] font-bold text-slate-500 mb-3">Memory</h3>
            {/* Multi-segment Progress Bar */}
            <div className="flex h-1.5 w-full rounded-full overflow-hidden mb-3">
              <div className="bg-green-500 h-full" style={{ width: "34.5%" }}></div>
              <div className="bg-yellow-400 h-full" style={{ width: "29%" }}></div>
              <div className="bg-orange-500 h-full" style={{ width: "5.5%" }}></div>
              <div className="bg-slate-200 dark:bg-slate-700 h-full flex-1"></div>
            </div>
            <div className="text-right text-[9px] font-bold text-slate-400 mb-3">51.1/64.0 GB</div>

            <div className="grid grid-cols-4 gap-1 text-[9px]">
              <div>
                <p className="text-slate-500 font-bold">Pressure</p>
                <p className="text-slate-400">34.5 %</p>
              </div>
              <div>
                <p className="text-slate-500 font-bold">App</p>
                <p className="text-slate-400">29.0 GB</p>
              </div>
              <div>
                <p className="text-slate-500 font-bold">Wired</p>
                <p className="text-slate-400">5.5 GB</p>
              </div>
              <div>
                <p className="text-slate-500 font-bold">Compressed</p>
                <p className="text-slate-400">16.6 GB</p>
              </div>
            </div>
          </div>

          {/* Storage Section */}
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-100 dark:border-slate-800">
            <h3 className="text-[11px] font-bold text-slate-500 mb-3">Storage</h3>
            <div className="flex h-1.5 w-full rounded-full overflow-hidden mb-2 bg-slate-200 dark:bg-slate-700">
              <div className="h-full bg-gradient-to-r from-green-500 via-yellow-400 to-orange-500" style={{ width: "90%" }}></div>
            </div>
            <div className="text-right text-[9px] font-bold text-slate-400">1.8/2.0 TB</div>
          </div>

          {/* Network Section */}
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-100 dark:border-slate-800">
            <h3 className="text-[11px] font-bold text-slate-500 mb-4">Network</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300">10.0.1.60</span>
                <ClipboardList size={10} className="text-slate-400" />
              </div>
              <div className="flex gap-4 text-[9px]">
                <div>
                  <p className="text-slate-500 font-bold">Upload</p>
                  <p className="text-slate-400 flex items-center gap-1"><ArrowUpToLine size={10} /> 10.0 KB/s</p>
                </div>
                <div>
                  <p className="text-slate-500 font-bold">Download</p>
                  <p className="text-slate-400 flex items-center gap-1"><ArrowDownToLine size={10} /> 15.0 KB/s</p>
                </div>
              </div>
            </div>
          </div>

          {/* Storage Details */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-5 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] mt-2">
            <h3 className="text-[13px] font-bold text-slate-700 dark:text-slate-200 text-center mb-2">Storage Details</h3>

            <StorageGauge />

            <div className="flex flex-col gap-4 mt-6">
              {/* Documents */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-blue-50 dark:bg-blue-900/30 rounded-md">
                      <FileText size={12} className="text-blue-500" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Documents</span>
                  </div>
                  <span className="text-[10px] font-medium text-slate-400">5,674s</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden ml-7 w-[calc(100%-28px)]">
                  <div className="bg-blue-600 h-full" style={{ width: "65%" }}></div>
                </div>
              </div>

              {/* Videos */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-blue-50 dark:bg-blue-900/30 rounded-md">
                      <Video size={12} className="text-blue-500" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Videos</span>
                  </div>
                  <span className="text-[10px] font-medium text-slate-400">1,624</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden ml-7 w-[calc(100%-28px)]">
                  <div className="bg-green-500 h-full" style={{ width: "25%" }}></div>
                </div>
              </div>

              {/* Images */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-blue-50 dark:bg-blue-900/30 rounded-md">
                      <ImageIcon size={12} className="text-blue-500" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Images</span>
                  </div>
                  <span className="text-[10px] font-medium text-slate-400">5,515</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden ml-7 w-[calc(100%-28px)]">
                  <div className="bg-orange-500 h-full" style={{ width: "45%" }}></div>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
