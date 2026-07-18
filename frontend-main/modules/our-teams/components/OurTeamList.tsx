"use client";

import { useMemo, useState } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { PublicPageShell } from "@/src/modules/shared/components/public/PublicPageShell";
import TeamCard from "./TeamCard";
import { OurTeam } from "../types/ourTeam.type";
import { MOCK_TEAM_MEMBERS } from "../data/mock-team";

interface Props {
  initialData?: OurTeam[];
}

const PAGE_SIZE = 12;

export default function OurTeamList({ initialData = [] }: Props) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  // Prefer live API data; fall back to diversified mock set when backend is offline
  const teamData = initialData.length > 0 ? initialData : MOCK_TEAM_MEMBERS;

  const filtered = useMemo(() => {
    const visibleData = teamData.filter((team) => team.isVisible);
    if (!query) return visibleData;
    const q = query.toLowerCase();
    return visibleData.filter(
      (m) =>
        m.firstName.toLowerCase().includes(q) ||
        m.lastName.toLowerCase().includes(q) ||
        (m.position || "").toLowerCase().includes(q) ||
        (m.department || "").toLowerCase().includes(q)
    );
  }, [teamData, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const startResult = filtered.length > 0 ? (page - 1) * PAGE_SIZE + 1 : 0;
  const endResult = Math.min(filtered.length, page * PAGE_SIZE);

  const getPageItems = () => {
    const items: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) items.push(i);
    } else {
      items.push(1);

      if (page > 3) {
        items.push("—");
      }

      let middlePages: number[] = [];
      if (page <= 3) {
        middlePages = [2, 3];
      } else if (page >= totalPages - 3) {
        middlePages = [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1];
      } else {
        middlePages = [page - 1, page, page + 1];
      }

      middlePages.forEach((p) => {
        if (p > 1 && p < totalPages) {
          items.push(p);
        }
      });

      if (page < totalPages - 3) {
        items.push("—");
      }

      items.push(totalPages);
    }
    return items;
  };

  const pageItems = getPageItems();

  return (
    <PublicPageShell
      title="Our Team"
      subtitle="Meet the people behind our platform — leadership, operations, and regional specialists."
      badge="Team"
    >
      <div className="flex items-center justify-end pb-4">
        <div className="flex items-center h-8 w-[220px] border border-slate-300 rounded-sm overflow-hidden bg-card">
          <input
            type="text"
            placeholder="Search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            className="flex-1 h-full px-2.5 text-xs focus:outline-none placeholder-slate-400 bg-card"
          />
          <button
            type="button"
            className="h-full w-8 bg-primary hover:bg-primary/90 text-white flex items-center justify-center transition-colors shrink-0"
          >
            <Search className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Grid of Team Cards — 4 columns matching design */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {pageData.map((team) => (
          <TeamCard key={team.id} {...team} />
        ))}
      </div>

      {/* Pagination Row */}
      {filtered.length > 0 && (
        <div className="flex items-center justify-between pt-4">
          {/* Results Summary */}
          <div className="text-xs font-semibold text-slate-500">
            Showing {startResult} To {endResult} of {filtered.length} Results
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center gap-0.5">
            {/* Prev button */}
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="w-8 h-8 flex items-center justify-center bg-primary hover:bg-primary/90 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Page numbers */}
            {pageItems.map((item, idx) => {
              if (item === "—") {
                return (
                  <span
                    key={`sep-${idx}`}
                    className="w-8 h-8 flex items-center justify-center text-slate-400 select-none text-xs font-bold"
                  >
                    —
                  </span>
                );
              }

              const isCurrent = item === page;
              return (
                <button
                  key={`page-${item}`}
                  onClick={() => setPage(item as number)}
                  className={`w-8 h-8 flex items-center justify-center text-xs font-bold transition-colors ${
                    isCurrent
                      ? "bg-primary text-white"
                      : "bg-card text-slate-600 border border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {item}
                </button>
              );
            })}

            {/* Next button */}
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="w-8 h-8 flex items-center justify-center bg-primary hover:bg-primary/90 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </PublicPageShell>
  );
}
