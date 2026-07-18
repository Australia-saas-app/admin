"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Search, ChevronDown, Globe, Zap, User, FileText, BookOpen, Calendar } from "lucide-react";
import { useCountryFilterEffect } from "@/src/shared/hooks/use-country-filter-effect";
import { PublicPageShell } from "@/src/modules/shared/components/public/PublicPageShell";
import { PublicDetailModal } from "@/src/modules/shared/components/public/PublicDetailModal";
import { PublicContactModal } from "@/src/modules/shared/components/public/PublicContactModal";
import { Button } from "@/src/components/ui/button";
import { useFormatMoney } from "@/src/shared/hooks/use-format-money";

// Course filters based on design
const FILTER_SECTIONS = [
  { label: "Delivery mode", options: ["All", "Online", "Offline", "Hybrid"] },
  { label: "Course Type", options: ["All", "Full Time", "Part Time"] },
  { label: "Current status", options: ["All", "Active", "Upcoming", "Closed"] },
  { label: "Campus / venue", options: ["All", "Main Campus", "Online Portal"] },
  { label: "Country", options: ["All", "Japan", "Canada", "USA"] },
  { label: "State", options: ["All", "Tokyo", "Quebec", "Vermont", "Ontario", "California"] },
  { label: "City", options: ["All", "Tokyo", "Montreal", "Burlington", "Toronto", "Los Angeles"] },
  { label: "Skill level", options: ["All", "Beginner", "Intermediate", "Advanced"] },
  { label: "Certificate", options: ["All", "Included", "Not included"] },
  { label: "Language", options: ["All", "English", "Japanese", "French"] },
  { label: "Features", options: ["All", "Certificate", "Free Ebooks", "Live sessions"] },
];

// Simple deterministic pseudo-random generator
const pseudoRandom = (seed: number) => {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
};

// Grid card items - Deterministic mock data to prevent SSR hydration errors
const MOCK_JOBS = [
  {
    id: 1,
    price: "4652",
    discount: "25%",
    author: "Mr tast",
    title: "International Online Course Platfor...",
    category: "Web Development",
    lang: "English",
    level: "Beginner",
    students: "20",
    cert: "yes",
    modules: "10",
    date: "25 sep 2023",
    timeAgo: "3 Day Ago",
    country: "Canada",
    city: "Toronto",
  },
  {
    id: 2,
    price: "2100",
    discount: "10%",
    author: "Dr Smith",
    title: "Advanced Machine Learning & AI",
    category: "Data Science",
    lang: "English",
    level: "Advanced",
    students: "45",
    cert: "yes",
    modules: "24",
    date: "10 Oct 2023",
    timeAgo: "1 Week Ago",
    country: "USA",
    city: "Los Angeles",
  },
  {
    id: 3,
    price: "850",
    discount: "15%",
    author: "Yuki Sato",
    title: "Japanese Language Mastery (N5-N3)",
    category: "Languages",
    lang: "Japanese",
    level: "Beginner",
    students: "120",
    cert: "yes",
    modules: "15",
    date: "01 Nov 2023",
    timeAgo: "2 Days Ago",
    country: "Japan",
    city: "Tokyo",
  },
  {
    id: 4,
    price: "3400",
    discount: "30%",
    author: "Sarah Lee",
    title: "UI/UX Design Masterclass 2024",
    category: "Design",
    lang: "English",
    level: "Intermediate",
    students: "80",
    cert: "yes",
    modules: "12",
    date: "15 Dec 2023",
    timeAgo: "5 Hrs Ago",
    country: "Canada",
    city: "Montreal",
  },
  {
    id: 5,
    price: "550",
    discount: "5%",
    author: "John Doe",
    title: "Introduction to Cloud Computing",
    category: "IT & Software",
    lang: "English",
    level: "Beginner",
    students: "300",
    cert: "yes",
    modules: "8",
    date: "20 Jan 2024",
    timeAgo: "1 Month Ago",
    country: "USA",
    city: "Vermont",
  },
  ...Array.from({ length: 45 }).map((_, idx) => {
    const prng1 = pseudoRandom(idx * 10);
    const prng2 = pseudoRandom(idx * 20);
    const prng3 = pseudoRandom(idx * 30);
    const prng4 = pseudoRandom(idx * 40);
    const prng5 = pseudoRandom(idx * 50);

    return {
      id: idx + 6,
      price: (Math.floor(prng1 * 5000) + 500).toString(),
      discount: `${Math.floor(prng2 * 50) + 5}%`,
      author: `Instructor ${idx + 1}`,
      title: `Professional Certification Course ${idx + 1}`,
      category: idx % 2 === 0 ? "Engineering" : "Business",
      lang: idx % 3 === 0 ? "French" : "English",
      level: idx % 2 === 0 ? "Intermediate" : "Beginner",
      students: (Math.floor(prng3 * 200) + 10).toString(),
      cert: "yes",
      modules: (Math.floor(prng4 * 20) + 5).toString(),
      date: `0${Math.floor(prng5 * 9) + 1} Mar 2024`,
      timeAgo: `${Math.floor(prng1 * 10) + 1} Days Ago`,
      country: idx % 2 === 0 ? "Canada" : "Japan",
      city: idx % 2 === 0 ? "Toronto" : "Tokyo",
    };
  }),
];

export default function CourseCatalog() {
  const { formatUsd } = useFormatMoney();
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [priceRange, setPriceRange] = useState(100);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [searchFilter, setSearchFilter] = useState("Course");
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);

  const [limit, setLimit] = useState(12);
  const [isLimitDropdownOpen, setIsLimitDropdownOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<(typeof MOCK_JOBS)[number] | null>(null);
  const [enrollOpen, setEnrollOpen] = useState(false);

  useCountryFilterEffect("courses", (value) => {
    setActiveFilters((prev) => ({ ...prev, Country: value ?? "All" }));
  });

  const handleSearch = () => {
    setActiveSearch(searchQuery);
  };

  const filteredCourses = useMemo(() => {
    return MOCK_JOBS.filter((course) => {
      if (
        activeSearch &&
        !course.title.toLowerCase().includes(activeSearch.toLowerCase()) &&
        !course.category.toLowerCase().includes(activeSearch.toLowerCase())
      ) {
        return false;
      }
      if (
        activeFilters["Country"] &&
        activeFilters["Country"] !== "All" &&
        course.country !== activeFilters["Country"]
      )
        return false;
      if (
        activeFilters["city"] &&
        activeFilters["city"] !== "All" &&
        course.city !== activeFilters["city"]
      )
        return false;
      // Add more exact match filters here if data supports it
      return true;
    });
  }, [activeSearch, activeFilters]);

  const displayedCourses = filteredCourses.slice(0, limit);
  const totalResults = filteredCourses.length;

  const handleMoreResults = () => {
    setLimit((prev) => Math.min(prev + 12, totalResults));
  };

  return (
    <PublicPageShell
      title="Course Catalog"
      subtitle="Professional courses across development, design, languages, and business skills."
      badge="Learning"
      action={
        <Button asChild className="bg-primary hover:bg-primary/90">
          <Link href="/business/courses/create">Create course</Link>
        </Button>
      }
    >
      <div className="space-y-6">
        <div className="flex flex-col relative max-w-5xl w-full">
          <div className="flex items-center bg-card border border-border rounded-md overflow-hidden shadow-sm h-[46px] w-full">
            <div className="relative h-full flex items-center">
              <button
                onClick={() => setIsSearchDropdownOpen(!isSearchDropdownOpen)}
                className="flex items-center px-4 bg-card border-r border-border text-[13px] text-foreground/80 min-w-[110px] justify-between cursor-pointer hover:bg-muted/60 h-full"
              >
                {searchFilter} <ChevronDown className="w-4 h-4 ml-2 text-muted-foreground/70" />
              </button>
              {isSearchDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-full bg-card shadow-lg border border-border rounded-md py-1 z-50">
                  {["Course", "Certificate"].map((opt) => (
                    <div
                      key={opt}
                      onClick={() => {
                        setSearchFilter(opt);
                        setIsSearchDropdownOpen(false);
                      }}
                      className="px-4 py-2 text-[12px] text-foreground/80 hover:bg-blue-50 hover:text-blue-600 cursor-pointer"
                    >
                      {opt}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <input
              type="text"
              placeholder="International Online Course"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1 px-4 text-[13px] text-foreground focus:outline-none min-w-0 h-full"
            />
            <button
              onClick={handleSearch}
              className="bg-primary text-white w-[52px] h-full flex items-center justify-center hover:bg-primary/90 transition-colors shrink-0"
            >
              <Search className="w-[18px] h-[18px]" />
            </button>
          </div>
        </div>

        <div className="border-b border-border w-full"></div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 relative z-10">
          {/* Left Column Filters Sidebar */}
          <div className="space-y-3 h-fit">
            <div className="p-4 border border-border rounded-lg shadow-sm">
              <div className="space-y-3">
                {FILTER_SECTIONS.map((section) => (
                  <div key={section.label} className="relative">
                    <select
                      value={activeFilters[section.label] || ""}
                      onChange={(e) =>
                        setActiveFilters({ ...activeFilters, [section.label]: e.target.value })
                      }
                      className="w-full appearance-none border border-border bg-card rounded-md py-2.5 px-4 text-sm font-medium text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                    >
                      <option value="">{section.label}</option>
                      {section.options.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/70 pointer-events-none" />
                  </div>
                ))}

                {/* Price Slider */}
                <div className="pt-4 pb-2 px-1">
                  <label className="block text-xs font-bold text-foreground/80 mb-4">Price</label>
                  <div className="relative">
                    <input
                      type="range"
                      min="100"
                      max="2000000"
                      value={priceRange}
                      onChange={(e) => setPriceRange(Number(e.target.value))}
                      className="w-full h-1 bg-muted rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-muted-foreground font-medium mt-2">
                    <span>100</span>
                    <span>200M</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column Catalog List */}
          <div className="lg:col-span-3">
            {/* Sorting Controls */}
            <div className="flex justify-between items-center text-xs font-medium text-foreground/80 bg-card pb-6">
              <span>Top results 1-{Math.min(limit, totalResults)} of 2K</span>
              <div className="flex items-center gap-2">
                <span>Sort by</span>
                <div className="relative">
                  <select className="appearance-none border border-border bg-card rounded-md py-1.5 px-3 pr-8 text-muted-foreground font-medium focus:outline-none cursor-pointer">
                    <option>Oldest</option>
                    <option>Newest</option>
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/70 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Course Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
              {displayedCourses.length > 0 ? (
                displayedCourses.map((item) => (
                  <div
                    key={item.id}
                    className="bg-card rounded-xl overflow-hidden border border-border card-lift shadow-sm relative group flex flex-col cursor-pointer"
                    onClick={() => setSelectedCourse(item)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && setSelectedCourse(item)}
                  >
                    {/* Image Layout */}
                    <div className="aspect-[4/3] bg-muted relative">
                      <img
                        src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=500&q=80"
                        alt="Course Laptop"
                        className="w-full h-full object-cover"
                      />
                      {/* Dark overlay specifically matching the design feeling */}
                      <div className="absolute inset-0 bg-black/10"></div>

                      {/* Badge top right */}
                      <div className="absolute top-3 right-3 bg-[#0ea5e9] text-white text-[11px] font-bold px-2 py-0.5 rounded shadow-sm">
                        {formatUsd(Number(item.price))}
                        <span className="block text-[8px] text-white/90 font-semibold text-right leading-none mb-0.5">
                          {item.discount}
                        </span>
                      </div>

                      {/* Avatar top left */}
                      <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-[#1e293b]/70 backdrop-blur-sm px-2 py-1 rounded-full text-white text-[10px] font-medium shadow-sm">
                        <div className="w-4 h-4 rounded-full bg-gray-300 overflow-hidden flex items-center justify-center">
                          <img
                            src={`https://i.pravatar.cc/150?img=${(item.id % 70) + 1}`}
                            alt="Avatar"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span>{item.author}</span>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="p-4 flex flex-col flex-1">
                      <div className="mb-3">
                        <h3 className="text-[13px] font-bold text-foreground leading-tight mb-1">
                          {item.title}
                        </h3>
                        <span className="text-[10px] text-muted-foreground font-medium">
                          {item.category}
                        </span>
                      </div>

                      {/* Meta Info Grid */}
                      <div className="grid grid-cols-3 gap-y-2.5 gap-x-1 border-t border-border pt-3 text-[10px] text-muted-foreground font-medium mt-auto mb-3">
                        <div className="flex items-center gap-1.5">
                          <Globe className="w-3.5 h-3.5 text-muted-foreground/70" />{" "}
                          <span className="truncate">{item.lang}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Zap className="w-3.5 h-3.5 text-muted-foreground/70" />{" "}
                          <span className="truncate">{item.level}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-muted-foreground/70" />{" "}
                          <span className="truncate">{item.students}</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-muted-foreground/70" />{" "}
                          <span className="truncate">{item.cert}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-muted-foreground/70" />{" "}
                          <span className="truncate">{item.modules}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-muted-foreground/70" />{" "}
                          <span className="truncate">{item.date}</span>
                        </div>
                      </div>

                      <div className="text-[10px] text-muted-foreground/70 font-medium pt-1">
                        {item.timeAgo}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-20 text-muted-foreground">
                  No courses found matching your criteria.
                </div>
              )}
            </div>

            {/* Pagination Container matching Careers exactly */}
            <div className="flex flex-col items-center justify-center pb-6 px-4">
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

                <div className="relative h-full z-20">
                  <button
                    onClick={() => setIsLimitDropdownOpen(!isLimitDropdownOpen)}
                    className="flex items-center px-3 text-xs font-semibold text-white bg-primary hover:bg-primary/90 transition-colors h-full"
                  >
                    {limit} <ChevronDown className="w-3.5 h-3.5 ml-1 opacity-80" />
                  </button>
                  {/* Dropdown for limits */}
                  {isLimitDropdownOpen && (
                    <div className="absolute bottom-full right-0 mt-1 mb-1 bg-card shadow-lg border border-border rounded-md w-[60px] py-1 text-center">
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
          </div>
        </div>
      </div>

      {/* Click outside overlay */}
      {isLimitDropdownOpen && (
        <div className="fixed inset-0 z-10" onClick={() => setIsLimitDropdownOpen(false)}></div>
      )}

      <PublicDetailModal
        open={!!selectedCourse}
        onClose={() => setSelectedCourse(null)}
        title={selectedCourse?.title ?? "Course"}
        subtitle={selectedCourse?.category}
        fields={
          selectedCourse
            ? [
                { label: "Price", value: formatUsd(Number(selectedCourse.price)) },
                { label: "Discount", value: selectedCourse.discount },
                { label: "Instructor", value: selectedCourse.author },
                { label: "Level", value: selectedCourse.level },
                { label: "Language", value: selectedCourse.lang },
                { label: "Students", value: selectedCourse.students },
                { label: "Modules", value: selectedCourse.modules },
                { label: "Certificate", value: selectedCourse.cert },
              ]
            : []
        }
        footer={
          selectedCourse && (
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setSelectedCourse(null)}>
                Close
              </Button>
              <Button
                className="bg-primary hover:bg-primary/90"
                onClick={() => setEnrollOpen(true)}
              >
                Enroll now
              </Button>
            </div>
          )
        }
      />
      <PublicContactModal
        open={enrollOpen}
        onClose={() => setEnrollOpen(false)}
        title="Course enrollment"
        description="Submit your enrollment request and we'll confirm seat availability."
        subject={selectedCourse ? `Enrollment: ${selectedCourse.title}` : "Course enrollment"}
      />
    </PublicPageShell>
  );
}
