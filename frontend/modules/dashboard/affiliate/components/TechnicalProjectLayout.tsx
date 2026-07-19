"use client";

import React, { useMemo, useState } from "react";
import { Pagination } from "@/src/components/ui/pagination";
import { Table, TableHeading, TableBody, TableRow, TableColumn } from "@/src/components/table";
import { Button } from "@/src/components/ui/button";
import TabButton from "@/src/components/ui/TabButton";
import { usePathname, useRouter } from "next/navigation";
import { ProjectChatManage } from "@/src/modules/project-chat/ProjectChatManage";
import { SearchInput } from "@/src/components/form/search-input";

interface ProjectItem {
  id: string;
  title: string;
  type: string;
  totalAmount: string;
  dueAmount: string;
  durationStart: string;
  durationEnd: string;
  messageCount: number;
  status: "Payment" | "PAYMENT" | "WAITING" | "Working" | "Completed";
}

const demoProjects: ProjectItem[] = [
  {
    id: "TP-1001",
    title: "Frontend & Backend Module Sriptcode Documents",
    type: "New Build",
    totalAmount: "110 gdc",
    dueAmount: "0.00",
    durationStart: "02 Mar 2026",
    durationEnd: "03 Jan 2027",
    messageCount: 9,
    status: "Payment",
  },
  {
    id: "TP-1002",
    title: "Frontend & Backend Module Sriptcode Documents",
    type: "New Build",
    totalAmount: "110 gdc",
    dueAmount: "110 gdc",
    durationStart: "02 Mar 2026",
    durationEnd: "03 Jan 2027",
    messageCount: 1,
    status: "PAYMENT",
  },
  {
    id: "TP-1003",
    title: "Frontend & Backend Module Sriptcode Documents",
    type: "New Build",
    totalAmount: "110 gdc",
    dueAmount: "120 gdc",
    durationStart: "02 Mar 2026",
    durationEnd: "03 Jan 2027",
    messageCount: 1,
    status: "WAITING",
  },
  {
    id: "TP-1004",
    title: "Frontend & Backend Module Sriptcode Documents",
    type: "Upgrade",
    totalAmount: "110 gdc",
    dueAmount: "140 gdc",
    durationStart: "02 Mar 2026",
    durationEnd: "03 Jan 2027",
    messageCount: 1,
    status: "Working",
  },
  {
    id: "TP-1005",
    title: "Frontend & Backend Module Sriptcode Documents",
    type: "Upgrade",
    totalAmount: "110 gdc",
    dueAmount: "140 usd",
    durationStart: "02 Mar 2026",
    durationEnd: "03 Jan 2027",
    messageCount: 1,
    status: "Completed",
  },
];

const TechnicalProjectLayout: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const PAGE_SIZE = 5;

  const filtered = useMemo(() => {
    if (!search) return demoProjects;
    const q = search.toLowerCase();
    return demoProjects.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.type.toLowerCase().includes(q) ||
        p.status.toLowerCase().includes(q)
    );
  }, [search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const goToPayment = () => {
    if (pathname?.endsWith("/payment")) return;
    router.push(`${pathname.replace(/\/$/, "")}/payment`);
  };

  // Helper to render customized status buttons matching the design
  const renderStatus = (status: ProjectItem["status"]) => {
    switch (status) {
      case "Payment":
        return (
          <button className="w-28 py-1.5 rounded bg-[#ebd7bb] text-gray-800 text-[10px] font-bold shadow-xs hover:opacity-90">
            Pay Now <span className="block text-[8px] font-medium text-gray-500">Payment</span>
          </button>
        );
      case "PAYMENT":
        return (
          <button className="w-28 py-2.5 rounded bg-[#f2e7d5] text-gray-700 text-[10px] font-extrabold hover:opacity-90">
            PAYMENT
          </button>
        );
      case "WAITING":
        return (
          <button className="w-28 py-2.5 rounded bg-[#f7d6d3] text-red-700 text-[10px] font-extrabold hover:opacity-90">
            WAITING
          </button>
        );
      case "Working":
        return (
          <button className="w-28 py-1.5 rounded bg-[#d6e4ff] text-blue-700 text-[10px] font-bold shadow-xs hover:opacity-90">
            Pay Now <span className="block text-[8px] font-medium text-blue-500">Working</span>
          </button>
        );
      case "Completed":
        return (
          <button className="w-28 py-1.5 rounded bg-[#d1fad7] text-green-700 text-[10px] font-bold shadow-xs hover:opacity-90">
            Pay Now <span className="block text-[8px] font-medium text-green-500">Completed</span>
          </button>
        );
    }
  };

  return (
    <div className="p-4 bg-[#f8fafc] min-h-screen">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        {/* Header Tab & Search Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <TabButton label="Project" isActive={true} onClick={() => {}} />
            <TabButton label="Transaction" isActive={false} onClick={goToPayment} />
          </div>
          <SearchInput
            value={search}
            onChange={(v) => {
              setSearch(v);
              setPage(1);
            }}
            placeholder="Search..."
          />
        </div>

        {/* Projects Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-primary text-white font-bold uppercase">
                <th className="p-3">Project Title</th>
                <th className="p-3">Project Type</th>
                <th className="p-3">Total Amount</th>
                <th className="p-3">Due Amount</th>
                <th className="p-3">Duration</th>
                <th className="p-3">Connect</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pageData.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 text-gray-700">
                  <td className="p-3 font-semibold text-gray-900 max-w-xs">{p.title}</td>
                  <td className="p-3">{p.type}</td>
                  <td className="p-3 font-medium">{p.totalAmount}</td>
                  <td className="p-3 font-medium text-gray-900">{p.dueAmount}</td>
                  <td className="p-3 text-gray-500 leading-normal">
                    <span className="block font-semibold">{p.durationStart}</span>
                    <span className="block text-[10px]">{p.durationEnd}</span>
                  </td>
                  <td className="p-3">
                    <div className="relative inline-block">
                      <button className="bg-primary hover:bg-primary/90 text-white text-[10px] font-bold px-3 py-2 rounded flex items-center gap-1 transition-colors">
                        Message
                        <span className="bg-[#1e2a4a] text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold">
                          {p.messageCount}
                        </span>
                      </button>
                    </div>
                  </td>
                  <td className="p-3">{renderStatus(p.status)}</td>
                  <td className="p-3 text-center">
                    <button className="bg-primary hover:bg-primary/90 text-white text-[10px] font-bold px-4 py-2 rounded transition-colors shadow-xs">
                      VIEW
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100 text-xs font-bold text-gray-500">
          <span>
            Showing 1 to {pageData.length} of {filtered.length} Results
          </span>
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
  );
};

export default TechnicalProjectLayout;
