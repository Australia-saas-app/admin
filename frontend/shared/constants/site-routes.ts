export const SERVICE_ROUTES: Record<string, string> = {
  Technology: "/technical",
  Construction: "/service/construction",
  "Real Estate": "/real-estate",
  "Commercial & Industrial": "/marketplace",
  "Visa & Travel": "/visa-travel",
  Education: "/courses",
  Careers: "/careers",
  Healthcare: "/service/healthcare",
  "Market Place": "/marketplace",
  Business: "/associate",
  Investment: "/service/investment",
  Donations: "/service/donations",
}

export const HIGHLIGHT_ROUTES: Record<string, string> = {
  Technology: "/technical",
  Construction: "/service/construction",
  "Real Estate": "/real-estate",
}

export const DASHBOARD_ROUTE = "/user/dashboard"

export const SITEMAP_SECTIONS = [
  {
    title: "Main",
    links: [
      { label: "Home", href: "/" },
      { label: "Technical", href: "/technical" },
      { label: "Gallery", href: "/gallery" },
      { label: "Notice Board", href: "/notice" },
      { label: "Our Team", href: "/our-teams" },
      { label: "Associates", href: "/associate" },
      { label: "Blog", href: "/blogs" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Careers", href: "/careers" },
      { label: "Courses", href: "/courses" },
      { label: "Marketplace", href: "/marketplace" },
      { label: "Transport", href: "/transport" },
      { label: "Real Estate", href: "/real-estate" },
      { label: "Visa Processing", href: "/visa" },
      { label: "Visa & Travel", href: "/visa-travel" },
      { label: "Global Branches", href: "/branch" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Login", href: "/account/user/login" },
      { label: "Register", href: "/account/user/registration" },
    ],
  },
  {
    title: "Legal & Info",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Advertising Practices", href: "/advertising" },
      { label: "Online Banking", href: "/online-banking" },
      { label: "Sitemap", href: "/sitemap" },
    ],
  },
] as const
