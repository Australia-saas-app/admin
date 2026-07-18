"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ChevronDown, MessageCircle, Search, UserPlus } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import { useIsDemoAccount } from "@/src/shared/hooks/use-is-demo-account";
import {
  DEMO_PENALTY_ITEMS,
  DEMO_PROJECTS,
  DEMO_SKIP_PROJECTS,
  PAGE_SIZE,
  PENALTY_STATS,
  type PenaltyItem,
  type PenaltyStatus,
  type ProjectItem,
  type ProjectStatus,
  type SkipProjectItem,
  type SkipStatus,
} from "../data/technical-demo-data";
import RecordDetailDrawer, { type DetailField } from "./RecordDetailDrawer";
import AppModal from "./AppModal";
import { getOrCreateProjectThread, type DashboardRole } from "@/src/shared/lib/messages-store";

const TABS = ["Project", "Assign Project", "Skip Project", "Penalty"] as const;
type TabKey = (typeof TABS)[number];

const DATE_FILTERS = ["Last 7 days", "Last 30 days", "Last 90 days", "All time"] as const;

function penaltyDaysForFilter(filter: (typeof DATE_FILTERS)[number]): number | null {
  if (filter === "Last 7 days") return 7;
  if (filter === "Last 30 days") return 30;
  if (filter === "Last 90 days") return 90;
  return null;
}

function resolveDashboardRole(pathname?: string | null): DashboardRole {
  if (pathname?.startsWith("/affiliate") || pathname?.includes("/dashboard/affiliate"))
    return "affiliate";
  if (pathname?.startsWith("/business") || pathname?.includes("/dashboard/business"))
    return "business";
  if (pathname?.startsWith("/user") || pathname?.includes("/dashboard/user")) return "user";
  return "user";
}

function getTechnicalBase(pathname?: string | null) {
  return (
    pathname
      ?.replace(/\/assign-project\/?$/, "")
      .replace(/\/skip-project\/?$/, "")
      .replace(/\/penalty\/?$/, "")
      .replace(/\/$/, "") ?? ""
  );
}

function renderSkipStatus(status: SkipStatus) {
  switch (status) {
    case "PendingHold":
      return (
        <span className="inline-block rounded-md bg-[#e8dff5] px-3 py-1.5 text-[10px] font-bold text-[#6b4fa3]">
          Pending / hold
        </span>
      );
    case "Paid":
      return <span className="text-[11px] font-bold text-green-600">Paid</span>;
    case "Cancel":
      return (
        <span className="inline-block rounded-md bg-[#f7d6d3] px-3 py-1.5 text-[10px] font-bold text-red-700">
          Cancel
        </span>
      );
  }
}

function renderPenaltyStatus(status: PenaltyStatus) {
  switch (status) {
    case "Complete":
      return (
        <span className="inline-block rounded-md bg-[#d1fad7] px-3 py-1.5 text-[10px] font-bold text-green-700">
          Complete
        </span>
      );
    case "Deactive":
      return (
        <span className="inline-block rounded-md bg-[#f7d6d3] px-3 py-1.5 text-[10px] font-bold text-red-700">
          Deactive
        </span>
      );
    case "Pending":
      return (
        <span className="inline-block rounded-md bg-[#f2e7d5] px-3 py-1.5 text-[10px] font-bold text-amber-800">
          Pending
        </span>
      );
    case "Review":
      return (
        <span className="inline-block rounded-md bg-[#d6e4ff] px-3 py-1.5 text-[10px] font-bold text-blue-700">
          Review
        </span>
      );
  }
}

function renderStatus(status: ProjectStatus, onPay?: () => void) {
  switch (status) {
    case "payment":
      return (
        <button
          type="button"
          onClick={onPay}
          className="min-w-[7rem] rounded-md bg-[#e8d5b5] px-3 py-1.5 text-[10px] font-bold text-gray-800 shadow-sm"
        >
          payment
        </button>
      );
    case "PAYMENT":
      return (
        <button
          type="button"
          onClick={onPay}
          className="min-w-[7rem] rounded-md bg-[#f2d9c4] px-3 py-2 text-[10px] font-extrabold text-gray-700"
        >
          PAYMENT
        </button>
      );
    case "WAITING":
      return (
        <button
          type="button"
          className="min-w-[7rem] rounded-md bg-[#f7d6d3] px-3 py-2 text-[10px] font-extrabold text-red-700"
        >
          WAITING
        </button>
      );
    case "Working":
      return (
        <button
          type="button"
          onClick={onPay}
          className="min-w-[7rem] rounded-md bg-[#d6e4ff] px-3 py-1.5 text-[10px] font-bold text-blue-700 shadow-sm"
        >
          Pay Now
          <span className="mt-0.5 block text-[8px] font-medium text-blue-500">Working</span>
        </button>
      );
    case "Completed":
      return (
        <button
          type="button"
          onClick={onPay}
          className="min-w-[7rem] rounded-md bg-[#d1fad7] px-3 py-1.5 text-[10px] font-bold text-green-700 shadow-sm"
        >
          Pay Now
          <span className="mt-0.5 block text-[8px] font-medium text-green-600">Completed</span>
        </button>
      );
  }
}

function getPageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) {
    return total >= 10 ? [1, 2, 3, 4, "...", 9, 10] : [1, 2, 3, 4, "...", total - 1, total];
  }
  if (current >= total - 3) return [1, "...", total - 3, total - 2, total - 1, total];
  return [1, "...", current - 1, current, current + 1, "...", total];
}

function PaginationFooter({
  start,
  end,
  totalItems,
  page,
  totalPages,
  pageNumbers,
  onPageChange,
}: {
  start: number;
  end: number;
  totalItems: number;
  page: number;
  totalPages: number;
  pageNumbers: (number | "...")[];
  onPageChange: (page: number) => void;
}) {
  return (
    <div className="mt-5 flex flex-col gap-3 border-t border-gray-100 pt-4 text-xs font-bold text-gray-500 sm:flex-row sm:items-center sm:justify-between">
      <span>
        Showing {start} To {end} of {totalItems} Results
      </span>
      <div className="flex flex-wrap items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
          className="rounded border border-gray-200 px-2.5 py-1 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          &lt; Previous
        </button>
        {pageNumbers.map((item, idx) =>
          item === "..." ? (
            <span key={`ellipsis-${idx}`} className="px-1 text-gray-400">
              ...
            </span>
          ) : (
            <button
              key={item}
              type="button"
              onClick={() => onPageChange(item)}
              className={`min-w-[2rem] rounded px-2.5 py-1 ${
                page === item ? "bg-primary text-white" : "border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {item}
            </button>
          )
        )}
        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="rounded border border-gray-200 px-2.5 py-1 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next &gt;
        </button>
      </div>
    </div>
  );
}

function PenaltyStatsSidebar() {
  return (
    <aside className="w-full shrink-0 space-y-2 lg:w-52">
      {PENALTY_STATS.map((stat) => (
        <div
          key={stat.label}
          className="flex items-center justify-between rounded-lg border border-gray-100 bg-[#f8fafc] px-3 py-2.5 text-xs"
        >
          <span className="text-gray-500">{stat.label}</span>
          <span className="font-bold text-gray-800">{stat.value}</span>
        </div>
      ))}
      <button
        type="button"
        className="mt-3 w-full rounded-lg border border-gray-200 bg-white py-2.5 text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
      >
        API key
      </button>
    </aside>
  );
}

const TechnicalProjectLayout: React.FC<{ initialTab?: TabKey }> = ({ initialTab = "Project" }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { isDemo, isReady, demoOrEmpty } = useIsDemoAccount();
  const dashboardRole = resolveDashboardRole(pathname);
  const projectSource = useMemo(
    () => demoOrEmpty(DEMO_PROJECTS, [] as typeof DEMO_PROJECTS),
    [isDemo, isReady]
  );
  const penaltySource = useMemo(
    () => demoOrEmpty(DEMO_PENALTY_ITEMS, [] as typeof DEMO_PENALTY_ITEMS),
    [isDemo, isReady]
  );
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [dateFilter, setDateFilter] = useState<(typeof DATE_FILTERS)[number]>("Last 7 days");
  const [activeTab, setActiveTab] = useState<TabKey>(initialTab);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailTitle, setDetailTitle] = useState("");
  const [detailFields, setDetailFields] = useState<DetailField[]>([]);
  const [detailProject, setDetailProject] = useState<ProjectItem | null>(null);
  const [assignOpen, setAssignOpen] = useState(false);
  const [assignTarget, setAssignTarget] = useState<ProjectItem | null>(null);
  const [assignee, setAssignee] = useState("");
  const [assignedIds, setAssignedIds] = useState<Set<string>>(new Set());
  const [skipItems, setSkipItems] = useState<SkipProjectItem[]>([]);

  const dashboardBase = pathname?.replace(/\/technical.*$/, "") ?? "/user";
  const paymentPath = `${dashboardBase}/technical/payment`;
  const messagesPath = `${dashboardBase}/messages`;

  useEffect(() => {
    setSkipItems(isDemo ? [...DEMO_SKIP_PROJECTS] : []);
  }, [isDemo]);

  const openProjectDetail = (project: ProjectItem) => {
    setDetailProject(project);
    setDetailTitle(project.name);
    setDetailFields([
      { label: "Project ID", value: project.id },
      { label: "Type", value: project.projectType },
      { label: "Sub Category", value: project.subCategory },
      { label: "Budget", value: project.budget },
      { label: "Duration", value: `${project.durationStart} – ${project.durationEnd}` },
      { label: "Status", value: project.status },
    ]);
    setDetailOpen(true);
  };

  const goToPayment = () => router.push(paymentPath);

  const goToProjectMessages = (project: ProjectItem) => {
    const thread = getOrCreateProjectThread({
      role: dashboardRole,
      projectId: project.id,
      projectName: project.name,
      participant: "Project team",
    });
    router.push(`${messagesPath}?thread=${thread.id}`);
  };

  useEffect(() => {
    if (pathname?.endsWith("/assign-project")) setActiveTab("Assign Project");
    else if (pathname?.endsWith("/skip-project")) setActiveTab("Skip Project");
    else if (pathname?.endsWith("/penalty")) setActiveTab("Penalty");
    else if (
      initialTab === "Project" &&
      !pathname?.match(/\/(assign-project|skip-project|penalty)\/?$/)
    ) {
      setActiveTab((current) =>
        ["Assign Project", "Skip Project", "Penalty"].includes(current) ? "Project" : current
      );
    }
  }, [pathname, initialTab]);

  const filteredProjects = useMemo(() => {
    if (!search.trim()) return projectSource;
    const q = search.toLowerCase();
    return projectSource.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.projectType.toLowerCase().includes(q) ||
        p.subCategory.toLowerCase().includes(q) ||
        p.budget.toLowerCase().includes(q) ||
        p.status.toLowerCase().includes(q)
    );
  }, [search, projectSource]);

  const filteredSkip = useMemo(() => {
    let rows = skipItems;
    if (!search.trim()) return rows;
    const q = search.toLowerCase();
    return rows.filter(
      (p) =>
        p.subCategory.toLowerCase().includes(q) ||
        p.earnings.toLowerCase().includes(q) ||
        p.dateTime.toLowerCase().includes(q) ||
        p.status.toLowerCase().includes(q)
    );
  }, [search, skipItems]);

  const filteredPenalty = useMemo(() => {
    const maxDays = penaltyDaysForFilter(dateFilter);
    let rows = penaltySource;
    if (maxDays !== null) {
      const cutoff = Date.now() - maxDays * 24 * 60 * 60 * 1000;
      rows = rows.filter((p) => new Date(p.recordedAt).getTime() >= cutoff);
    }
    if (!search.trim()) return rows;
    const q = search.toLowerCase();
    return rows.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.subCategory.toLowerCase().includes(q) ||
        p.amount.toLowerCase().includes(q) ||
        p.status.toLowerCase().includes(q)
    );
  }, [search, dateFilter, penaltySource]);

  const isSkipView = activeTab === "Skip Project";
  const isPenaltyView = activeTab === "Penalty";
  const isAssignView = activeTab === "Assign Project";

  const activeList = isSkipView ? filteredSkip : isPenaltyView ? filteredPenalty : filteredProjects;

  const totalPages = Math.max(1, Math.ceil(activeList.length / PAGE_SIZE));
  const pageData = activeList.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const start = activeList.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const end = Math.min(page * PAGE_SIZE, activeList.length);
  const pageNumbers = getPageNumbers(page, totalPages);

  const handleAssignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignTarget || !assignee.trim()) {
      toast.error("Enter a team member email or name to assign.");
      return;
    }
    await new Promise((r) => setTimeout(r, 350));
    setAssignedIds((prev) => new Set(prev).add(assignTarget.id));
    setAssignOpen(false);
    setAssignee("");
    toast.success(`${assignTarget.name} assigned to ${assignee.trim()}.`);
  };

  const updateSkipStatus = (id: string, status: SkipStatus) => {
    setSkipItems((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)));
    toast.success(`Skip request updated to ${status}.`);
  };

  const handleTabClick = (tab: TabKey) => {
    setActiveTab(tab);
    setPage(1);
    setSearch("");
    const base = getTechnicalBase(pathname);

    if (tab === "Assign Project") {
      router.push(`${base}/assign-project`);
      return;
    }
    if (tab === "Skip Project") {
      router.push(`${base}/skip-project`);
      return;
    }
    if (tab === "Penalty") {
      router.push(`${base}/penalty`);
      return;
    }
    if (tab === "Project" && pathname?.match(/\/(assign-project|skip-project|penalty)\/?$/)) {
      router.push(base);
    }
  };

  return (
    <div className="min-h-full">
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm md:p-6">
        <div className="mb-5 flex items-center justify-between gap-4 border-b border-gray-100 pb-5">
          <div className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => handleTabClick(tab)}
                className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold whitespace-nowrap transition-colors ${
                  activeTab === tab
                    ? "bg-primary text-white shadow-sm"
                    : "bg-[#eef1f5] text-gray-600 hover:bg-[#e4e8ee]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {isPenaltyView && (
              <div className="relative">
                <select
                  value={dateFilter}
                  onChange={(e) => {
                    setDateFilter(e.target.value as (typeof DATE_FILTERS)[number]);
                    setPage(1);
                  }}
                  className="h-9 appearance-none rounded-lg border border-gray-200 bg-white py-0 pr-8 pl-3 text-xs text-gray-700 outline-none focus:border-primary"
                >
                  {DATE_FILTERS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute top-1/2 right-2 h-3.5 w-3.5 -translate-y-1/2 text-gray-500" />
              </div>
            )}
            <div className="relative w-[155px]">
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search"
                className="h-9 w-full rounded-lg border border-gray-200 bg-white pr-10 pl-3 text-xs text-gray-700 outline-none focus:border-primary"
              />
              <button
                type="button"
                aria-label="Search"
                className="absolute top-0 right-0 flex h-9 w-9 items-center justify-center rounded-r-lg bg-primary text-white"
              >
                <Search className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {activeTab === "Project" && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[960px] border-collapse text-left text-xs">
              <thead>
                <tr className="bg-primary text-[11px] font-bold uppercase tracking-wide text-white">
                  <th className="rounded-tl-lg px-3 py-3">Project Name</th>
                  <th className="px-3 py-3">Project Type</th>
                  <th className="px-3 py-3">Sub Category</th>
                  <th className="px-3 py-3">Earnings</th>
                  <th className="px-3 py-3">Duration</th>
                  <th className="px-3 py-3">Connect</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="rounded-tr-lg px-3 py-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {(pageData as ProjectItem[]).map((project, index) => (
                  <tr
                    key={project.id}
                    className={`text-gray-700 ${index % 2 === 0 ? "bg-white" : "bg-[#f3f6fb]"}`}
                  >
                    <td className="max-w-[200px] px-3 py-3 font-semibold text-gray-900">
                      {project.name}
                    </td>
                    <td className="px-3 py-3">{project.projectType}</td>
                    <td className="px-3 py-3">{project.subCategory}</td>
                    <td className="px-3 py-3 font-medium">{project.budget}</td>
                    <td className="px-3 py-3 leading-snug text-gray-500">
                      <span className="block font-semibold text-gray-700">
                        {project.durationStart}
                      </span>
                      <span className="block text-[10px]">{project.durationEnd}</span>
                    </td>
                    <td className="px-3 py-3">
                      <button
                        type="button"
                        onClick={() => goToProjectMessages(project)}
                        className="relative inline-flex items-center gap-1 rounded-md bg-primary px-3 py-2 text-[10px] font-bold text-white transition-colors hover:bg-primary/90"
                      >
                        <MessageCircle className="h-3.5 w-3.5" />
                        Message
                        {project.messageCount > 0 && (
                          <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#1e2a4a] px-1 text-[8px] font-bold text-white">
                            {project.messageCount}
                          </span>
                        )}
                      </button>
                    </td>
                    <td className="px-3 py-3">{renderStatus(project.status, goToPayment)}</td>
                    <td className="px-3 py-3 text-center">
                      <button
                        type="button"
                        onClick={() => openProjectDetail(project)}
                        className="rounded-md bg-primary px-4 py-2 text-[10px] font-bold text-white transition-colors hover:bg-primary/90"
                      >
                        VIEW
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {isAssignView && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] border-collapse text-left text-xs">
              <thead>
                <tr className="bg-primary text-[11px] font-bold uppercase tracking-wide text-white">
                  <th className="rounded-tl-lg px-3 py-3">Project Title</th>
                  <th className="px-3 py-3">Project Type</th>
                  <th className="px-3 py-3">Sub Category</th>
                  <th className="px-3 py-3">Budget</th>
                  <th className="px-3 py-3">Duration</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="rounded-tr-lg px-3 py-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {(pageData as ProjectItem[]).map((project, index) => (
                  <tr
                    key={project.id}
                    className={`text-gray-700 ${index % 2 === 0 ? "bg-white" : "bg-[#f3f6fb]"}`}
                  >
                    <td className="max-w-[220px] px-3 py-3 font-semibold text-gray-900">
                      {project.name}
                    </td>
                    <td className="px-3 py-3">{project.projectType}</td>
                    <td className="px-3 py-3">{project.subCategory}</td>
                    <td className="px-3 py-3 font-medium">{project.budget}</td>
                    <td className="px-3 py-3 leading-snug text-gray-500">
                      <span className="block font-semibold text-gray-700">
                        {project.durationStart}
                      </span>
                      <span className="block text-[10px]">{project.durationEnd}</span>
                    </td>
                    <td className="px-3 py-3">{renderStatus(project.status, goToPayment)}</td>
                    <td className="px-3 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {assignedIds.has(project.id) ? (
                          <span className="rounded-md bg-green-100 px-3 py-1.5 text-[10px] font-bold text-green-700">
                            Assigned
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setAssignTarget(project);
                              setAssignOpen(true);
                            }}
                            className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-[10px] font-bold text-white hover:bg-primary/90"
                          >
                            <UserPlus className="h-3 w-3" />
                            Assign
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => openProjectDetail(project)}
                          className="rounded-md border border-gray-200 px-3 py-1.5 text-[10px] font-bold text-gray-700 hover:bg-gray-50"
                        >
                          VIEW
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {isSkipView && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left text-xs">
              <thead>
                <tr className="bg-primary text-[11px] font-bold uppercase tracking-wide text-white">
                  <th className="rounded-tl-lg px-3 py-3">Sub Category</th>
                  <th className="px-3 py-3">Earnings</th>
                  <th className="px-3 py-3">Date &amp; Time</th>
                  <th className="rounded-tr-lg px-3 py-3">Status</th>
                  <th className="rounded-tr-lg px-3 py-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {(pageData as SkipProjectItem[]).map((item, index) => (
                  <tr
                    key={item.id}
                    className={`text-gray-700 ${index % 2 === 0 ? "bg-white" : "bg-[#f3f6fb]"}`}
                  >
                    <td className="px-3 py-3">{item.subCategory}</td>
                    <td className="px-3 py-3 font-medium">{item.earnings}</td>
                    <td className="px-3 py-3 text-gray-600">{item.dateTime}</td>
                    <td className="px-3 py-3">{renderSkipStatus(item.status)}</td>
                    <td className="px-3 py-3 text-center">
                      {item.status === "PendingHold" && (
                        <div className="flex justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => updateSkipStatus(item.id, "Paid")}
                            className="rounded bg-green-600 px-2 py-1 text-[10px] font-bold text-white hover:bg-green-700"
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            onClick={() => updateSkipStatus(item.id, "Cancel")}
                            className="rounded border border-gray-200 px-2 py-1 text-[10px] font-bold text-gray-700 hover:bg-gray-50"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {isPenaltyView && (
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
            <div className="min-w-0 flex-1 overflow-x-auto">
              <table className="w-full min-w-[520px] border-collapse text-left text-xs">
                <thead>
                  <tr className="bg-primary text-[11px] font-bold uppercase tracking-wide text-white">
                    <th className="rounded-tl-lg px-3 py-3">Project Title</th>
                    <th className="px-3 py-3">Sub Category</th>
                    <th className="px-3 py-3">Amount</th>
                    <th className="rounded-tr-lg px-3 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {(pageData as PenaltyItem[]).map((item, index) => (
                    <tr
                      key={item.id}
                      className={`text-gray-700 ${index % 2 === 0 ? "bg-white" : "bg-[#f3f6fb]"}`}
                    >
                      <td className="max-w-[220px] px-3 py-3 font-semibold text-gray-900">
                        {item.title}
                      </td>
                      <td className="px-3 py-3">{item.subCategory}</td>
                      <td className="px-3 py-3 font-medium">{item.amount}</td>
                      <td className="px-3 py-3">{renderPenaltyStatus(item.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <PenaltyStatsSidebar />
          </div>
        )}

        {(activeTab === "Project" || isAssignView || isSkipView || isPenaltyView) && (
          <PaginationFooter
            start={start}
            end={end}
            totalItems={activeList.length}
            page={page}
            totalPages={totalPages}
            pageNumbers={pageNumbers}
            onPageChange={setPage}
          />
        )}
      </div>

      <RecordDetailDrawer
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        title={detailTitle}
        fields={detailFields}
        actions={
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => detailProject && goToProjectMessages(detailProject)}
              className="flex-1 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Open Messages
            </button>
            <button
              type="button"
              onClick={goToPayment}
              className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90"
            >
              Go to Payment
            </button>
          </div>
        }
      />

      <AppModal
        open={assignOpen}
        onClose={() => {
          setAssignOpen(false);
          setAssignee("");
        }}
        title="Assign project"
        description={assignTarget ? `Assign "${assignTarget.name}" to a team member.` : undefined}
        icon={<UserPlus className="h-5 w-5" />}
        footer={
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setAssignOpen(false)}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="assign-project-form"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90"
            >
              Assign project
            </button>
          </div>
        }
      >
        <form id="assign-project-form" onSubmit={handleAssignSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Team member email
            </label>
            <input
              type="email"
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
              placeholder="developer@company.com"
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-primary"
              required
            />
          </div>
        </form>
      </AppModal>
    </div>
  );
};

export default TechnicalProjectLayout;
