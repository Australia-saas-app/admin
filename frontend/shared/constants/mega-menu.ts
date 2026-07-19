export type MegaMenuLink = { label: string; href: string; hint?: string };

export type MegaMenuSection = {
  title: string;
  links: MegaMenuLink[];
};

export const MEGA_MENU_SECTIONS: MegaMenuSection[] = [
  {
    title: "Marketplace",
    links: [
      { label: "Electronics", href: "/marketplace" },
      { label: "Fashion", href: "/marketplace" },
      { label: "Vehicles", href: "/transport" },
      { label: "All Products", href: "/marketplace" },
    ],
  },
  {
    title: "Professional Services",
    links: [
      { label: "Associates", href: "/associate" },
      { label: "Technical", href: "/technical" },
      { label: "Construction", href: "/service/construction" },
      { label: "Healthcare", href: "/service/healthcare" },
    ],
  },
  {
    title: "Travel",
    links: [
      { label: "Visa & Travel", href: "/visa-travel" },
      { label: "Visa Processing", href: "/visa" },
      { label: "Hotels & Flights", href: "/visa-travel" },
      { label: "Transport", href: "/transport" },
    ],
  },
  {
    title: "Finance",
    links: [
      { label: "Wallet", href: "/user/wallet" },
      { label: "Online Banking", href: "/online-banking" },
      { label: "Investments", href: "/service/investment" },
      { label: "Donations", href: "/service/donations" },
    ],
  },
  {
    title: "Business",
    links: [
      { label: "Associates / CRM", href: "/associate" },
      { label: "Business Account", href: "/account/business/login" },
      { label: "Advertising", href: "/advertising" },
      { label: "Contact Sales", href: "/contact" },
    ],
  },
  {
    title: "Technology",
    links: [
      { label: "Technical Projects", href: "/technical" },
      { label: "Developers", href: "/careers" },
      { label: "AI Services", href: "/technical" },
      { label: "Software", href: "/technical" },
    ],
  },
  {
    title: "Learning",
    links: [
      { label: "Courses", href: "/courses" },
      { label: "Create Course", href: "/courses/create" },
      { label: "Careers / Jobs", href: "/careers" },
      { label: "Blog Guides", href: "/blogs" },
    ],
  },
  {
    title: "More",
    links: [
      { label: "Real Estate", href: "/real-estate" },
      { label: "Gallery", href: "/gallery" },
      { label: "Notice Board", href: "/notice" },
      { label: "Branches", href: "/branch" },
      { label: "Our Team", href: "/our-teams" },
      { label: "Sitemap", href: "/sitemap" },
      { label: "Support", href: "/contact" },
    ],
  },
];

/** Primary top-bar links (single-row header). */
export const PRIMARY_NAV: ReadonlyArray<{
  label: string;
  href: string;
  mega?: boolean;
}> = [
  { label: "Home", href: "/" },
  { label: "Feed", href: "/marketplace" },
  { label: "Services", href: "/associate", mega: true },
  { label: "Notice", href: "/notice" },
  { label: "Our Team", href: "/our-teams" },
  { label: "Associate", href: "/associate" },
  { label: "Branch", href: "/branch" },
  { label: "Blog", href: "/blogs" },
];

/** Marketplace / vertical categories (mega menu + mobile extras). */
export const CATEGORY_NAV = [
  { label: "Home", href: "/" },
  { label: "Marketplace", href: "/marketplace" },
  { label: "Services", href: "/associate" },
  { label: "Jobs", href: "/careers" },
  { label: "Courses", href: "/courses" },
  { label: "Travel", href: "/visa-travel" },
  { label: "Business", href: "/associate" },
  { label: "Technology", href: "/technical" },
  { label: "Real Estate", href: "/real-estate" },
  { label: "Transport", href: "/transport" },
] as const;

export const CATEGORY_NAV_MORE = [
  { label: "Gallery", href: "/gallery" },
  { label: "Notice", href: "/notice" },
  { label: "Our Team", href: "/our-teams" },
  { label: "Branches", href: "/branch" },
  { label: "Blog", href: "/blogs" },
  { label: "Visa", href: "/visa" },
  { label: "Healthcare", href: "/service/healthcare" },
  { label: "Construction", href: "/service/construction" },
  { label: "Contact", href: "/contact" },
  { label: "Sitemap", href: "/sitemap" },
] as const;

export const MOBILE_BOTTOM_NAV = [
  { label: "Home", href: "/", icon: "home" as const },
  { label: "Search", href: "/search", icon: "search" as const },
  { label: "Messages", href: "/user/messages", icon: "messages" as const },
  { label: "Wallet", href: "/user/wallet", icon: "wallet" as const },
  { label: "Profile", href: "/user/dashboard", icon: "profile" as const },
] as const;
