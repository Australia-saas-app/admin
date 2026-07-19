import { BlogCard, MAP_STATS, Metric } from "../types/home.type";

export const METRICS: Metric[] = [
  { id: "m1", value: "150+", label: "Countries Served" },
  { id: "m2", value: "12K+", label: "Active Customers" },
  { id: "m3", value: "700+", label: "Service Listings" },
  { id: "m4", value: "24/7", label: "Support Coverage" },
  { id: "m5", value: "15K+", label: "Completed Projects" },
  { id: "m6", value: "500+", label: "Team Members" },
  { id: "m7", value: "2K+", label: "Associate Partners" },
  { id: "m8", value: "12+", label: "Years of Experience" },
];

export const HOME_BLOGS_CARD_DATA: BlogCard[] = [
  {
    id: "ai-everyday-2025",
    title: "The Future of AI in Everyday Life: What to Expect in 2025",
    category: "Technology",
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=600&q=80",
    date: "15 May 2024",
    href: "/blogs/ai-everyday-2025",
  },
  {
    id: "cybersecurity-threats-business",
    title: "Top 10 Cybersecurity Threats Facing Businesses Today",
    category: "Cyber Security",
    image:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80",
    date: "12 May 2024",
    href: "/blogs/cybersecurity-threats-business",
  },
  {
    id: "cloud-transforming-small-business",
    title: "How Cloud Computing is Transforming Small Businesses",
    category: "Cloud",
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    date: "10 May 2024",
    href: "/blogs/cloud-transforming-small-business",
  },
];

export const HOME_BLOG_SECTION_DATA: MAP_STATS = {
  mapImage:
    "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80",
  stats: [
    { value: 160, label: "Markets" },
    { value: 150, label: "Countries" },
    { value: 156, label: "Currencies" },
  ],
};

export const PLATFORM_TAGLINE =
  "System DB connects users, affiliates, and businesses through unified dashboards, secure wallets, and professional service marketplaces.";
