import type { Notice } from "@/src/business/dashboard/menu/types"

// Demo/mock data. Replace with real API calls when backend is available.
const demoNotices: Notice[] = [
  {
    id: "1",
    title: "Office Notice - New Timings",
    publishDate: "2026-03-02",
    fileUrl: "timings.pdf",
    active: true,
  },
  {
    id: "2",
    title: "Holiday Announcement",
    publishDate: "2026-02-10",
    fileUrl: "holiday.pdf",
    active: true,
  },
  {
    id: "3",
    title: "Maintenance Notice",
    publishDate: "2026-01-22",
    fileUrl: "/image/placeholder-3.jpg",
    active: false,
  },
  {
    id: "4",
    title: "New Policy Update",
    publishDate: "2025-12-15",
    fileUrl: "/image/placeholder-4.jpg",
    active: true,
  },
]

export const fetchNotices = async (): Promise<Notice[]> => {
  // simulate network latency
  await new Promise((r) => setTimeout(r, 0))
  return demoNotices
}

// Note: no default export; import named `fetchNotices` from this module.
