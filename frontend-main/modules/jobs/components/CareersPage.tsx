"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Search, ChevronDown } from "lucide-react";
import { useCountryFilterEffect } from "@/src/shared/hooks/use-country-filter-effect";
import { PublicPageShell } from "@/src/modules/shared/components/public/PublicPageShell";
import { PublicApplyModal } from "@/src/modules/shared/components/public/PublicApplyModal";
import { PublicContactModal } from "@/src/modules/shared/components/public/PublicContactModal";
import { PublicDetailModal } from "@/src/modules/shared/components/public/PublicDetailModal";
import { Button } from "@/src/components/ui/button";

// Mock data matching the design
const FILTERS = [
  { label: "Division", options: ["All", "government", "Non-government"] },
  {
    label: "Category",
    options: ["All", "Web dev", "App dev", "Engineering", "Design", "Marketing"],
  },
  { label: "Work type", options: ["All", "Full Time", "Part Time", "Contract", "Freelance"] },
  { label: "Country", options: ["All", "canada", "japan", "usa", "uk"] },
  { label: "State", options: ["All", "ontario", "bc", "california", "texas"] },
  { label: "City", options: ["All", "toronto", "vancouver", "tokyo", "london"] },
  { label: "status", options: ["All", "Closed", "Ongoing", "End"] },
  { label: "salary", options: ["All", "0.00 - 300", "400 - 700", "800 - 1100", "1200 - 1500+"] },
];

const MOCK_JOBS = [
  {
    id: 1,
    title: "Senior Frontend React Developer",
    type: "Full Time",
    salary: "1200 - 1500+",
    vacancy: 2,
    workingHours: "160 /month",
    location: "Remote",
    languages: "English",
    education: "BSc Computer Science",
    skills: "React, TypeScript, Next.js, Tailwind CSS",
    deadline: "15 Sep 2026",
    postedTime: "2 Days Ago",
    category: "Web dev",
    country: "canada",
    status: "Ongoing",
    division: "Non-government",
  },
  {
    id: 2,
    title: "Housekeeping Room Attendant",
    type: "Part Time",
    salary: "0.00 - 300",
    vacancy: 56,
    workingHours: "80 /month",
    location: "On-site",
    languages: "English, Hindi",
    education: "High School Diploma",
    skills: "Cleaning, Organization, Time Management",
    deadline: "02 Jan 2026",
    postedTime: "2 Months Ago",
    category: "Marketing", // random assignment
    country: "japan",
    status: "Ongoing",
    division: "government",
  },
  {
    id: 3,
    title: "Civil Engineering Project Manager",
    type: "Contract",
    salary: "800 - 1100",
    vacancy: 1,
    workingHours: "180 /month",
    location: "Toronto, Canada",
    languages: "English, French",
    education: "MSc Civil Engineering",
    skills: "AutoCAD, Project Management, Structural Analysis",
    deadline: "30 Nov 2025",
    postedTime: "1 Week Ago",
    category: "Engineering",
    country: "canada",
    status: "Ongoing",
    division: "Non-government",
  },
  {
    id: 4,
    title: "Mobile App Developer (iOS)",
    type: "Full Time",
    salary: "1200 - 1500+",
    vacancy: 3,
    workingHours: "160 /month",
    location: "Remote",
    languages: "English",
    education: "BSc Software Engineering",
    skills: "Swift, iOS SDK, CoreData, UI/UX",
    deadline: "10 Oct 2025",
    postedTime: "3 Weeks Ago",
    category: "App dev",
    country: "usa",
    status: "Ongoing",
    division: "Non-government",
  },
  {
    id: 5,
    title: "UI/UX Product Designer",
    type: "Full Time",
    salary: "400 - 700",
    vacancy: 1,
    workingHours: "160 /month",
    location: "London, UK",
    languages: "English",
    education: "BA Design",
    skills: "Figma, Adobe XD, Sketch, Prototyping",
    deadline: "05 Dec 2025",
    postedTime: "1 Month Ago",
    category: "Design",
    country: "uk",
    status: "Closed",
    division: "Non-government",
  },
  {
    id: 6,
    title: "Government Public Relations Officer",
    type: "Contract",
    salary: "400 - 700",
    vacancy: 2,
    workingHours: "120 /month",
    location: "Remote",
    languages: "English, Spanish",
    education: "BSc Marketing",
    skills: "SEO, Content Strategy, Google Analytics",
    deadline: "20 Aug 2025",
    postedTime: "5 Days Ago",
    category: "Marketing",
    country: "usa",
    status: "Ongoing",
    division: "government",
  },
  ...Array.from({ length: 45 }).map((_, i) => ({
    id: i + 10,
    title: `Software Engineer - Platform Team ${i + 1}`,
    type: i % 3 === 0 ? "Contract" : "Full Time",
    salary: i % 2 === 0 ? "800 - 1100" : "1200 - 1500+",
    vacancy: (i % 5) + 1,
    workingHours: "160 /month",
    location: "Remote",
    languages: "English",
    education: "BSc Computer Science",
    skills: "Node.js, Express, MongoDB, AWS",
    deadline: "31 Dec 2025",
    postedTime: `${(i % 10) + 1} Days Ago`,
    category: i % 2 === 0 ? "Web dev" : "Engineering",
    country: i % 2 === 0 ? "canada" : "usa",
    status: "Ongoing",
    division: "Non-government",
  })),
];

export default function CareersPage() {
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearch, setActiveSearch] = useState("");

  const [limit, setLimit] = useState(12);
  const [isLimitDropdownOpen, setIsLimitDropdownOpen] = useState(false);
  const [applyOpen, setApplyOpen] = useState(false);
  const [postJobOpen, setPostJobOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<(typeof MOCK_JOBS)[number] | null>(null);

  useCountryFilterEffect("careers", (value) => {
    setSelectedFilters((prev) => ({ ...prev, Country: value ?? "All" }));
  });

  // Trigger search on button click or enter
  const handleSearch = () => {
    setActiveSearch(searchQuery);
  };

  const filteredJobs = useMemo(() => {
    return MOCK_JOBS.filter((job) => {
      // Search matching
      if (
        activeSearch &&
        !job.title.toLowerCase().includes(activeSearch.toLowerCase()) &&
        !job.skills.toLowerCase().includes(activeSearch.toLowerCase())
      ) {
        return false;
      }

      // Filter matching
      if (
        selectedFilters["Division"] &&
        selectedFilters["Division"] !== "All" &&
        job.division !== selectedFilters["Division"]
      )
        return false;
      if (
        selectedFilters["Category"] &&
        selectedFilters["Category"] !== "All" &&
        job.category !== selectedFilters["Category"]
      )
        return false;
      if (
        selectedFilters["Work type"] &&
        selectedFilters["Work type"] !== "All" &&
        job.type !== selectedFilters["Work type"]
      )
        return false;
      if (
        selectedFilters["Country"] &&
        selectedFilters["Country"] !== "All" &&
        job.country !== selectedFilters["Country"]
      )
        return false;
      if (
        selectedFilters["status"] &&
        selectedFilters["status"] !== "All" &&
        job.status !== selectedFilters["status"]
      )
        return false;
      if (
        selectedFilters["salary"] &&
        selectedFilters["salary"] !== "All" &&
        job.salary !== selectedFilters["salary"]
      )
        return false;

      return true;
    });
  }, [activeSearch, selectedFilters]);

  const displayedJobs = filteredJobs.slice(0, limit);
  const totalResults = filteredJobs.length;

  const handleMoreResults = () => {
    setLimit((prev) => Math.min(prev + 12, totalResults));
  };

  return (
    <PublicPageShell
      title="Careers"
      subtitle="Explore open roles across engineering, design, marketing, and operations. Apply directly or post a position for your organization."
      badge="Jobs"
      action={
        <Button className="bg-primary hover:bg-primary/90" onClick={() => setPostJobOpen(true)}>
          Post a job
        </Button>
      }
    >
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row items-start justify-between gap-4 relative z-10">
          <Button variant="outline" onClick={() => setPostJobOpen(true)}>
            Post Job
          </Button>

          <div className="flex flex-col flex-1 max-w-3xl mx-4 relative">
            <div className="flex w-full h-10 shadow-sm rounded-md overflow-hidden border border-border bg-card">
              <div className="flex items-center px-4 bg-card border-r border-border text-sm text-muted-foreground min-w-[100px] justify-between cursor-pointer hover:bg-muted/60">
                Jobs <ChevronDown className="w-4 h-4 ml-2" />
              </div>
              <input
                type="text"
                placeholder="Search jobs by title or skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="flex-1 px-4 text-sm outline-none bg-transparent min-w-0"
              />
              <button
                onClick={handleSearch}
                className="w-10 h-10 bg-primary flex items-center justify-center text-white hover:bg-primary/90 transition-colors shrink-0"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
            {/* Links below search bar */}
            <div className="absolute top-full left-0 flex gap-4 mt-1.5 px-1 text-[11px] text-foreground font-medium">
              <Link href="/careers" className="hover:text-primary">
                Jobs
              </Link>
              <Link href="/our-teams" className="hover:text-primary">
                Our team
              </Link>
            </div>
          </div>

          <Button className="bg-primary hover:bg-primary/90" onClick={() => setApplyOpen(true)}>
            Apply Now
          </Button>
        </div>

        {/* Click outside overlay */}
        {(openFilter || isLimitDropdownOpen) && (
          <div
            className="fixed inset-0 z-0"
            onClick={() => {
              setOpenFilter(null);
              setIsLimitDropdownOpen(false);
            }}
          />
        )}

        {/* Filters Row */}
        <div className="relative z-20">
          <div className="flex flex-wrap gap-2 justify-center lg:justify-between items-start relative">
            {FILTERS.map((filter) => (
              <div key={filter.label} className="relative group min-w-[120px] flex-1 max-w-[140px]">
                <button
                  onClick={() => setOpenFilter(openFilter === filter.label ? null : filter.label)}
                  className={`w-full flex items-center justify-between px-3 py-2 bg-card border rounded-md text-xs font-medium text-foreground/80 transition-colors ${
                    openFilter === filter.label
                      ? "border-blue-300 ring-1 ring-blue-300"
                      : "border-border hover:bg-muted/60"
                  }`}
                >
                  <span className="truncate">{filter.label}</span>
                  <ChevronDown className="w-3.5 h-3.5 ml-1 text-muted-foreground/70 shrink-0" />
                </button>

                {/* Dropdown Options */}
                {openFilter === filter.label && (
                  <div className="absolute top-full left-0 w-full mt-1 bg-card border border-border rounded-md shadow-lg z-30 py-1 max-h-60 overflow-auto">
                    {filter.options.map((opt, idx) => {
                      const isSelected =
                        selectedFilters[filter.label] === opt ||
                        (!selectedFilters[filter.label] && opt === "All");
                      return (
                        <div
                          key={idx}
                          onClick={() => {
                            setSelectedFilters((prev) => ({ ...prev, [filter.label]: opt }));
                            setOpenFilter(null);
                          }}
                          className={`px-3 py-2 text-[11px] cursor-pointer text-center truncate ${
                            isSelected
                              ? "text-blue-600 bg-blue-50 font-semibold"
                              : "text-muted-foreground hover:bg-muted/60 hover:text-blue-600"
                          }`}
                        >
                          {opt}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
            <div className="relative group min-w-[100px] flex-1 max-w-[120px]">
              <button
                onClick={() => setSelectedFilters({})}
                className="w-full flex items-center justify-center px-3 py-2 bg-muted/40 border border-border rounded-md text-xs font-medium text-foreground/80 hover:bg-muted/60 transition-colors"
              >
                <span className="truncate">Clear Filters</span>
              </button>
            </div>
          </div>
        </div>

        {/* Job Grid */}
        <div>
          {displayedJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {displayedJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-card rounded-xl border border-border p-6 card-lift shadow-sm relative cursor-pointer"
                  onClick={() => setSelectedJob(job)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && setSelectedJob(job)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-[17px] font-bold text-[#4a5568] pr-14 leading-tight">
                      {job.title}
                    </h3>
                    <div className="w-12 h-12 bg-card rounded-full border border-blue-100 flex items-center justify-center shrink-0 shadow-sm absolute top-6 right-6">
                      <span className="text-blue-600 font-bold text-[10px]">intel</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2.5 text-xs text-muted-foreground font-medium">
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-3.5 h-3.5 text-muted-foreground/70"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      <span>
                        Job type:{" "}
                        <span className="text-muted-foreground font-normal">{job.type}</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-3.5 h-3.5 text-muted-foreground/70"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>
                        Salary:{" "}
                        <span className="text-muted-foreground font-normal">{job.salary}</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-3.5 h-3.5 text-muted-foreground/70"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      <span>
                        Vacancy:{" "}
                        <span className="text-muted-foreground font-normal">{job.vacancy}</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-3.5 h-3.5 text-muted-foreground/70"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>
                        Working hours:{" "}
                        <span className="text-muted-foreground font-normal">
                          {job.workingHours}
                        </span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-3.5 h-3.5 text-muted-foreground/70"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span>
                        Work Location:{" "}
                        <span className="text-muted-foreground font-normal">{job.location}</span>
                      </span>
                    </div>

                    <div className="col-span-1 sm:col-span-2 flex items-start gap-2 mt-1">
                      <svg
                        className="w-3.5 h-3.5 text-muted-foreground/70 shrink-0 mt-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                        />
                      </svg>
                      <span className="leading-tight">
                        Speaking Language:{" "}
                        <span className="text-muted-foreground font-normal">{job.languages}</span>
                      </span>
                    </div>

                    <div className="col-span-1 sm:col-span-2 flex items-start gap-2">
                      <svg
                        className="w-3.5 h-3.5 text-muted-foreground/70 shrink-0 mt-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M12 14l9-5-9-5-9 5 9 5z" />
                        <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
                        />
                      </svg>
                      <span className="leading-tight">
                        Educational Qualification:{" "}
                        <span className="text-muted-foreground font-normal">{job.education}</span>
                      </span>
                    </div>

                    <div className="col-span-1 sm:col-span-2 flex items-start gap-2">
                      <svg
                        className="w-3.5 h-3.5 text-muted-foreground/70 shrink-0 mt-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                        />
                      </svg>
                      <span className="leading-tight">
                        Skills :{" "}
                        <span className="text-muted-foreground font-normal">{job.skills}</span>
                      </span>
                    </div>

                    <div className="col-span-1 sm:col-span-2 flex items-start gap-2 mt-1">
                      <svg
                        className="w-3.5 h-3.5 text-muted-foreground/70 shrink-0 mt-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span className="leading-tight">
                        Application Deadline:{" "}
                        <span className="text-muted-foreground font-normal">{job.deadline}</span>
                      </span>
                    </div>
                  </div>

                  <div className="absolute bottom-6 right-6">
                    <span className="text-[#3182ce] font-semibold text-xs">{job.postedTime}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-muted-foreground">
              No jobs found matching your filters.
            </div>
          )}
        </div>

        {/* Pagination Container */}
        <div className="flex flex-col items-center justify-center pb-6 px-4 relative z-10">
          <div className="text-[11px] font-bold text-muted-foreground mb-2">
            Showing {totalResults === 0 ? 0 : 1} To {Math.min(limit, totalResults)} of{" "}
            {totalResults} Results
          </div>

          <div className="flex items-center gap-0 bg-primary rounded overflow-hidden shadow-sm h-8">
            <button
              onClick={handleMoreResults}
              disabled={limit >= totalResults}
              className="px-4 text-xs font-semibold text-white bg-primary hover:bg-primary/90 transition-colors border-r border-primary h-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              More Results
            </button>

            <div className="relative h-full">
              <button
                onClick={() => setIsLimitDropdownOpen(!isLimitDropdownOpen)}
                className="flex items-center px-3 text-xs font-semibold text-white bg-primary hover:bg-primary/90 transition-colors h-full"
              >
                {limit} <ChevronDown className="w-3.5 h-3.5 ml-1 opacity-80" />
              </button>
              {/* Dropdown for limits */}
              {isLimitDropdownOpen && (
                <div className="absolute bottom-full right-0 mb-1 bg-card shadow-lg border border-border rounded-md w-[60px] py-1 text-center z-40">
                  {[12, 24, 48, 96].map((num) => (
                    <div
                      key={num}
                      onClick={() => {
                        setLimit(num);
                        setIsLimitDropdownOpen(false);
                      }}
                      className="text-[11px] text-muted-foreground py-1.5 hover:bg-muted/60 hover:text-blue-600 cursor-pointer font-medium"
                    >
                      {num}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <PublicDetailModal
          open={!!selectedJob}
          onClose={() => setSelectedJob(null)}
          title={selectedJob?.title ?? "Job"}
          subtitle={selectedJob ? `${selectedJob.type} · ${selectedJob.location}` : undefined}
          fields={
            selectedJob
              ? [
                  { label: "Salary", value: selectedJob.salary },
                  { label: "Vacancy", value: String(selectedJob.vacancy) },
                  { label: "Working hours", value: selectedJob.workingHours },
                  { label: "Languages", value: selectedJob.languages },
                  { label: "Education", value: selectedJob.education },
                  { label: "Skills", value: selectedJob.skills },
                  { label: "Deadline", value: selectedJob.deadline },
                  { label: "Posted", value: selectedJob.postedTime },
                ]
              : []
          }
          footer={
            selectedJob && (
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setSelectedJob(null)}>
                  Close
                </Button>
                <Button
                  className="bg-primary hover:bg-primary/90"
                  onClick={() => {
                    setApplyOpen(true);
                  }}
                >
                  Apply for this role
                </Button>
              </div>
            )
          }
        />
        <PublicApplyModal
          open={applyOpen}
          onClose={() => setApplyOpen(false)}
          type="job"
          itemId={selectedJob?.id?.toString() ?? "general"}
          itemTitle={selectedJob?.title ?? "General application"}
          title="Job application"
          description="Submit your application and our HR team will review your profile."
        />
        <PublicContactModal
          open={postJobOpen}
          onClose={() => setPostJobOpen(false)}
          title="Post a job"
          description="Tell us about the role you want to publish on our careers board."
          subject="New job posting request"
        />
      </div>
    </PublicPageShell>
  );
}
