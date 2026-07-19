"use client";

import React, { useState } from "react";
import { Search, ChevronDown, Check, ArrowUp, ArrowDown, User } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

interface DashboardMainViewProps {
  variant: "affiliate" | "business";
}

// Recharts line chart mock data
const chartData = [
  { name: "JAN", Increase: 10, Decrease: 5 },
  { name: "FEB", Increase: 35, Decrease: 20 },
  { name: "MAR", Increase: 25, Decrease: 30 },
  { name: "APR", Increase: 12, Decrease: 15 },
  { name: "MAY", Increase: 45, Decrease: 25 },
  { name: "JUN", Increase: 30, Decrease: 10 },
  { name: "JUL", Increase: 55, Decrease: 28 },
  { name: "AGU", Increase: 40, Decrease: 22 },
  { name: "SEP", Increase: 58, Decrease: 18 },
  { name: "OCT", Increase: 50, Decrease: 30 },
  { name: "NOV", Increase: 32, Decrease: 28 },
  { name: "DEC", Increase: 48, Decrease: 15 },
];

export default function DashboardMainView({ variant }: DashboardMainViewProps) {
  const [withdrawSearch, setWithdrawSearch] = useState("");
  const [earningSearch, setEarningSearch] = useState("");

  // Sorting state for Tables (Up/Down)
  const [withdrawSort, setWithdrawSort] = useState<"Up" | "Down">("Down");
  const [earningSort, setEarningSort] = useState<"Up" | "Down">("Up");

  // Pagination for Withdraw table
  const [withdrawPage, setWithdrawPage] = useState(1);
  // Pagination for Earning table
  const [earningPage, setEarningPage] = useState(1);

  // Withdraw History Data
  const withdrawData = [
    {
      id: "1hk45H",
      method: "Stripe",
      amount: "6 INR",
      date: "03 Feb 2025, 2:05 PM (UTC)",
      status: "Complete",
    },
    {
      id: "1hk45H",
      method: "PayPal",
      amount: "6 INR",
      date: "03 Feb 2025, 2:05 PM (UTC)",
      status: "Complete",
    },
    {
      id: "1hk45H",
      method: "Stripe",
      amount: "6 INR",
      date: "03 Feb 2025, 2:05 PM (UTC)",
      status: "Complete",
    },
    {
      id: "1hk45H",
      method: "PayPal",
      amount: "6 INR",
      date: "03 Feb 2025, 2:05 PM (UTC)",
      status: "Complete",
    },
    {
      id: "1hk45H",
      method: "Stripe",
      amount: "6 INR",
      date: "03 Feb 2025, 2:05 PM (UTC)",
      status: "Complete",
    },
  ];

  // Earning History Data
  const earningData = [
    { id: "1hk45H", subcategory: "office", commission: "6 PKG", status: "Complete" },
    { id: "1hk45H", subcategory: "office", commission: "6 INR", status: "Complete" },
    { id: "1hk45H", subcategory: "office", commission: "6 EUR", status: "Complete" },
    { id: "1hk45H", subcategory: "office", commission: "6 INR", status: "Complete" },
    { id: "1hk45H", subcategory: "office", commission: "6 INR", status: "Complete" },
    { id: "1hk45H", subcategory: "office", commission: "6 INR", status: "Complete" },
    { id: "1hk45H", subcategory: "office", commission: "6 PKG", status: "Complete" },
    { id: "1hk45H", subcategory: "office", commission: "6 EUR", status: "Complete" },
    { id: "1hk45H", subcategory: "office", commission: "6 USD", status: "Complete" },
    { id: "1hk45H", subcategory: "office", commission: "6 USD", status: "Complete" },
    { id: "1hk45H", subcategory: "office", commission: "6 USD", status: "Complete" },
  ];

  return (
    <div className="flex bg-[#e6ecf5] min-h-screen font-sans">
      {/* LEFT SIDEBAR */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col items-center py-8">
        {/* User Card */}
        <div className="flex flex-col items-center mb-10">
          <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-gray-100 shadow-sm bg-gray-200 mb-3">
            <img
              src="https://ui-avatars.com/api/?name=Mr+Jack&background=random"
              alt="Mr Jack"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-1 right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center">
              <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
            </div>
          </div>
          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold mb-2">
            verify
          </span>
          <h2 className="text-lg font-bold text-gray-900 leading-none mb-1">Mr Jack</h2>
          <span className="text-xs text-gray-500 font-medium">ID : 00001</span>
        </div>

        {/* Navigation Menu */}
        <nav className="w-full px-4 flex-1">
          <ul className="space-y-1">
            <li>
              <a
                href="#"
                className="flex items-center gap-4 px-4 py-3 rounded text-gray-600 font-medium hover:bg-gray-50"
              >
                Profile
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center gap-4 px-4 py-3 rounded bg-primary text-white font-medium shadow-sm"
              >
                Dashboard
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center gap-4 px-4 py-3 rounded text-gray-600 font-medium hover:bg-gray-50"
              >
                Services
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center gap-4 px-4 py-3 rounded text-gray-600 font-medium hover:bg-gray-50"
              >
                Transaction
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center gap-4 px-4 py-3 rounded text-gray-600 font-medium hover:bg-gray-50"
              >
                Settings
              </a>
            </li>
          </ul>
        </nav>

        {/* Logout at bottom */}
        <div className="w-full px-4 mt-auto">
          <a
            href="#"
            className="flex items-center gap-4 px-4 py-3 rounded text-gray-600 font-medium hover:bg-gray-50"
          >
            Logout
          </a>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-6 space-y-6">
        {/* KPI Stats Cards Row */}
        <div className="grid grid-cols-6 gap-4">
          <div className="bg-white rounded p-4 shadow-sm border border-gray-100">
            <p className="text-xs text-primary font-bold mb-1">Total Project</p>
            <h3 className="text-xl font-bold text-gray-900">150</h3>
          </div>
          <div className="bg-white rounded p-4 shadow-sm border border-gray-100">
            <p className="text-xs text-primary font-bold mb-1">Pending Project</p>
            <h3 className="text-xl font-bold text-gray-900">10</h3>
          </div>
          <div className="bg-white rounded p-4 shadow-sm border border-gray-100">
            <p className="text-xs text-primary font-bold mb-1">Successful Projects</p>
            <h3 className="text-xl font-bold text-gray-900">100</h3>
          </div>
          <div className="bg-white rounded p-4 shadow-sm border border-gray-100">
            <p className="text-xs text-primary font-bold mb-1">Total Commission</p>
            <h3 className="text-xl font-bold text-gray-900">$150</h3>
          </div>
          <div className="bg-white rounded p-4 shadow-sm border border-gray-100">
            <p className="text-xs text-primary font-bold mb-1">Total Withdrawn</p>
            <h3 className="text-xl font-bold text-gray-900">$100</h3>
          </div>
          <div className="bg-white rounded p-4 shadow-sm border border-gray-100 flex items-center justify-between col-span-1">
            <div>
              <p className="text-xs text-primary font-bold mb-1">Current Balance</p>
              <h3 className="text-xl font-bold text-gray-900">$50</h3>
            </div>
            <button className="bg-primary hover:bg-primary/90 text-white text-xs font-bold px-3 py-1.5 rounded transition-colors shadow-sm">
              Withdraw
            </button>
          </div>
        </div>

        {/* Content Layout Split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT 2 COLUMNS (Contains Chart OR Rank & Withdraw History) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Overview / Chart section (only in Business variant) */}
            {variant === "business" && (
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-md font-bold text-gray-900">Overview</h3>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-800">
                      <span className="w-3 h-3 rounded-full bg-[#0091ff]"></span> Increase
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                      <span className="w-3 h-3 rounded-full bg-gray-400"></span> Decrease
                    </div>

                    <div className="flex gap-2 text-xs">
                      <div className="relative">
                        <select className="appearance-none border border-gray-200 rounded px-3 py-1 bg-white pr-6 text-gray-600 focus:outline-none">
                          <option>2016</option>
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-500" />
                      </div>
                      <div className="relative">
                        <select className="appearance-none border border-gray-200 rounded px-3 py-1 bg-white pr-6 text-gray-600 focus:outline-none">
                          <option>July</option>
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-500" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={chartData}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#6b7280" }} />
                      <YAxis tick={{ fontSize: 10, fill: "#6b7280" }} />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="Increase"
                        stroke="#0091ff"
                        strokeWidth={2.5}
                        dot={{ r: 4 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="Decrease"
                        stroke="#9ca3af"
                        strokeWidth={2.5}
                        dot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Rank & Level Panel (only in Affiliate variant) */}
            {variant === "affiliate" && (
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-md font-bold text-gray-900">Rank & Level</h3>
                  <div className="flex items-center gap-4 text-xs font-semibold text-primary">
                    <span>1.5%</span>
                    <span>Rank- 654</span>
                  </div>
                </div>

                <div className="relative pt-6 pb-2">
                  {/* Floating tooltip bubble for value */}
                  <div
                    className="absolute -top-1 bg-[#0091ff] text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-4 after:border-transparent after:border-t-[#0091ff]"
                    style={{ left: "85.71%", transform: "translateX(-50%)" }}
                  >
                    85.71
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3">
                    <div
                      className="bg-[#0091ff] h-3 rounded-full"
                      style={{ width: "85.71%" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            {/* Withdraw History Table */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-md font-bold text-gray-900">Withdraw History</h3>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search"
                      value={withdrawSearch}
                      onChange={(e) => setWithdrawSearch(e.target.value)}
                      className="pl-8 pr-3 py-1.5 bg-white border border-gray-250 rounded text-xs focus:outline-none w-48"
                    />
                  </div>
                  <button
                    onClick={() => setWithdrawSort(withdrawSort === "Up" ? "Down" : "Up")}
                    className="flex items-center gap-1 border border-gray-250 rounded px-3 py-1.5 text-xs text-gray-600 font-bold bg-white"
                  >
                    {withdrawSort}
                    {withdrawSort === "Up" ? (
                      <ArrowUp className="w-3.5 h-3.5" />
                    ) : (
                      <ArrowDown className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-primary text-white font-bold uppercase">
                      <th className="p-3">Transaction ID</th>
                      <th className="p-3">Method</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Date & Time</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {withdrawData.map((item, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 text-gray-700">
                        <td className="p-3 font-semibold">{item.id}</td>
                        <td className="p-3">{item.method}</td>
                        <td className="p-3">{item.amount}</td>
                        <td className="p-3 text-gray-500">{item.date}</td>
                        <td className="p-3">
                          <span className="bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded text-[10px]">
                            {item.status}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <button className="bg-primary hover:bg-primary/90 text-white text-[10px] font-bold px-3 py-1 rounded transition-colors">
                            VIEW
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between mt-4 text-xs font-bold text-gray-500">
                <span>Showing 1 to 5 of 97 results</span>
                <div className="flex gap-1">
                  <button className="px-2.5 py-1 rounded border border-gray-200 hover:bg-gray-50">
                    &lt; Previous
                  </button>
                  <button className="px-2.5 py-1 rounded bg-primary text-white">1</button>
                  <button className="px-2.5 py-1 rounded border border-gray-200 hover:bg-gray-50">
                    2
                  </button>
                  <button className="px-2.5 py-1 rounded border border-gray-200 hover:bg-gray-50">
                    3
                  </button>
                  <button className="px-2.5 py-1 rounded border border-gray-200 hover:bg-gray-50">
                    4
                  </button>
                  <button className="px-2.5 py-1 rounded border border-gray-200 hover:bg-gray-50">
                    Next &gt;
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN (Earning History Table) */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 h-fit">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-md font-bold text-gray-900">Earning History</h3>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search"
                    value={earningSearch}
                    onChange={(e) => setEarningSearch(e.target.value)}
                    className="pl-8 pr-3 py-1.5 bg-white border border-gray-250 rounded text-xs focus:outline-none w-28"
                  />
                </div>
                <button
                  onClick={() => setEarningSort(earningSort === "Up" ? "Down" : "Up")}
                  className="flex items-center gap-1 border border-gray-250 rounded px-2 py-1.5 text-xs text-gray-600 font-bold bg-white"
                >
                  {earningSort}
                  {earningSort === "Up" ? (
                    <ArrowUp className="w-3.5 h-3.5" />
                  ) : (
                    <ArrowDown className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-primary text-white font-bold uppercase">
                    <th className="p-3">ID</th>
                    <th className="p-3">Subcategory</th>
                    <th className="p-3">Commission</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {earningData.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 text-gray-700">
                      <td className="p-3 font-semibold">{item.id}</td>
                      <td className="p-3 text-gray-500">{item.subcategory}</td>
                      <td className="p-3 font-medium text-gray-800">{item.commission}</td>
                      <td className="p-3">
                        <span className="bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded text-[10px]">
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination for Earning history as seen in Page 332.png */}
            <div className="flex justify-end gap-1 mt-4 text-xs font-bold text-gray-500">
              <button className="px-2 py-1 rounded border border-gray-200 hover:bg-gray-50">
                &lt; Previous
              </button>
              <button className="px-2.5 py-1 rounded bg-primary text-white">1</button>
              <button className="px-2.5 py-1 rounded border border-gray-200 hover:bg-gray-50">
                2
              </button>
              <button className="px-2.5 py-1 rounded border border-gray-200 hover:bg-gray-50">
                3
              </button>
              <button className="px-2.5 py-1 rounded border border-gray-200 hover:bg-gray-50">
                4
              </button>
              <button className="px-2 py-1 rounded border border-gray-200 hover:bg-gray-50">
                Next &gt;
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
