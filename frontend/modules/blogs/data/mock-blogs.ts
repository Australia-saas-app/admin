import type { BlogProps } from "../types/blog.type";

interface BlogSeed {
  id?: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  featuredImage: string;
  createdAt: string;
}

/** Homepage “Latest News” cards — each has a dedicated `/blogs/[id]` page. */
const FEATURED_HOME_BLOGS: BlogSeed[] = [
  {
    id: "ai-everyday-2025",
    title: "The Future of AI in Everyday Life: What to Expect in 2025",
    excerpt:
      "From smarter assistants to on-device models, here’s how AI will show up in daily work and home life next year.",
    content: [
      "Artificial intelligence is moving from novelty demos into everyday tools people already use — messaging apps, photo libraries, customer support, and workplace software.",
      "In 2025, expect three shifts: lighter on-device models that protect privacy, AI copilots baked into business dashboards, and clearer governance so teams know when a suggestion needs human review.",
      "For marketplace and service platforms, the biggest wins will come from personalized discovery, faster support triage, and drafting that still leaves final decisions with people.",
      "If you’re preparing your business, start with one high-volume workflow (search, quotes, or tickets), measure accuracy, and expand only after users trust the results.",
    ].join("\n\n"),
    category: "Technology",
    featuredImage:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80",
    createdAt: "2024-05-15T10:00:00.000Z",
  },
  {
    id: "cybersecurity-threats-business",
    title: "Top 10 Cybersecurity Threats Facing Businesses Today",
    excerpt:
      "Phishing, credential stuffing, and supply-chain risk still dominate — here’s what to prioritize this quarter.",
    content: [
      "Most business breaches still start with stolen credentials or a convincing phishing message, not exotic zero-days.",
      "The threats to watch closely: phishing and business email compromise, weak MFA gaps, exposed cloud storage, ransomware, insecure APIs, shadow IT, vendor access, malware on unmanaged devices, social engineering of support staff, and unpatched edge services.",
      "Practical defenses that move the needle: enforce phishing-resistant MFA, shorten session lifetimes, review admin access monthly, and keep an inventory of every third-party integration with wallet or customer data.",
      "On Veror-style platforms, treat escrow, messaging, and KYC uploads as high-value surfaces — audit logs and least-privilege roles matter as much as firewalls.",
    ].join("\n\n"),
    category: "Cyber Security",
    featuredImage:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80",
    createdAt: "2024-05-12T09:00:00.000Z",
  },
  {
    id: "cloud-transforming-small-business",
    title: "How Cloud Computing is Transforming Small Businesses",
    excerpt:
      "Cloud tools let small teams ship like enterprises — without owning a data center or a huge IT staff.",
    content: [
      "Small businesses once needed capital for servers and specialists. Cloud platforms flipped that: pay for what you use, scale when demand spikes, and turn features on without a migration project.",
      "The biggest changes we see: remote-ready collaboration, managed databases that handle backups automatically, and SaaS wallets/CRM tools that connect through secure APIs.",
      "Cost control still matters. Tag resources, set budgets, and prefer managed services over self-hosted stacks unless you have a clear reason to operate infrastructure.",
      "For service marketplaces, cloud hosting also means faster global rollout — new regions, CDN-backed media, and analytics that help affiliates and businesses see what converts.",
    ].join("\n\n"),
    category: "Cloud",
    featuredImage:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
    createdAt: "2024-05-10T11:30:00.000Z",
  },
];

const BLOG_SEEDS: BlogSeed[] = [
  {
    title: "Stunning Design",
    excerpt: "Short description of the project and why it matters for modern digital experiences.",
    content:
      "Explore how thoughtful design systems improve usability across web and mobile products.",
    category: "Design",
    featuredImage: "/real-estate-property-hands.jpg",
    createdAt: "2024-11-12T10:00:00.000Z",
  },
  {
    title: "Construction Milestones in 2024",
    excerpt: "Key infrastructure projects delivered ahead of schedule across three continents.",
    content:
      "A recap of major construction wins and lessons learned from cross-border coordination.",
    category: "Construction",
    featuredImage: "/construction-site-building.jpg",
    createdAt: "2024-11-15T09:00:00.000Z",
  },
  {
    title: "Building Stronger Technical Teams",
    excerpt: "How distributed engineering squads ship faster without sacrificing quality.",
    content: "Practices for code review, release cadence, and async collaboration at scale.",
    category: "Technical",
    featuredImage: "/technology-team-meeting.jpg",
    createdAt: "2024-11-18T14:30:00.000Z",
  },
  {
    title: "Real Estate Market Outlook",
    excerpt: "Demand trends for residential and commercial listings in Q4.",
    content: "Analyst notes on pricing, inventory, and buyer sentiment in major cities.",
    category: "Real Estate",
    featuredImage: "/real-estate-property-hands.jpg",
    createdAt: "2024-11-22T11:00:00.000Z",
  },
  {
    title: "Visa Processing Updates",
    excerpt: "New turnaround estimates for Schengen, UK, and North American applications.",
    content:
      "Seasonal volume changes and document requirements partners should communicate to clients.",
    category: "Visa & Travel",
    featuredImage:
      "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=600&q=80",
    createdAt: "2024-11-25T08:15:00.000Z",
  },
  {
    title: "Marketplace Seller Success Stories",
    excerpt: "Three vendors share how they doubled revenue after optimizing listings.",
    content: "Tips on photography, shipping policies, and customer response times.",
    category: "Marketplace",
    featuredImage:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=600&q=80",
    createdAt: "2024-11-28T16:45:00.000Z",
  },
  {
    title: "Courses Cohort Highlights",
    excerpt: "Graduates from the October technical program present capstone projects.",
    content: "Spotlight on cloud migration, API design, and product analytics case studies.",
    category: "Courses",
    featuredImage: "/technology-team-meeting.jpg",
    createdAt: "2024-12-02T10:20:00.000Z",
  },
  {
    title: "Global Branch Expansion",
    excerpt: "New offices open in Tunisia, Dubai, and Toronto with extended support hours.",
    content: "Local teams will offer in-person consultations for business and affiliate partners.",
    category: "Company",
    featuredImage:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80",
    createdAt: "2024-12-05T13:00:00.000Z",
  },
  {
    title: "Affiliate Program Growth",
    excerpt: "Commission structures refreshed to reward long-term partner performance.",
    content: "Overview of tier changes, payout timelines, and reporting dashboard updates.",
    category: "Affiliate",
    featuredImage: "/construction-site-building.jpg",
    createdAt: "2024-12-10T09:30:00.000Z",
  },
  {
    title: "Transport Logistics Innovation",
    excerpt: "Route optimization tools reduce delivery delays during peak season.",
    content: "Pilot results from automated dispatch and real-time fleet tracking.",
    category: "Transport",
    featuredImage:
      "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80",
    createdAt: "2024-12-15T12:10:00.000Z",
  },
  {
    title: "Healthcare Partner Network",
    excerpt: "Clinics onboarded in five new regions for telehealth referrals.",
    content: "How verified providers connect with users through the platform directory.",
    category: "Healthcare",
    featuredImage:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80",
    createdAt: "2024-12-18T15:40:00.000Z",
  },
  {
    title: "Year-End Security Review",
    excerpt: "Summary of platform hardening, audits, and user account protection features.",
    content:
      "Recommended actions for businesses enabling two-factor authentication before January.",
    category: "Security",
    featuredImage: "/technology-team-meeting.jpg",
    createdAt: "2024-12-23T07:55:00.000Z",
  },
];

export const TOTAL_NEWS_RESULTS = 97;

function toMockBlog(seed: BlogSeed, index: number, id: string): BlogProps {
  const slug = seed.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return {
    id,
    title: seed.title,
    slug,
    excerpt: seed.excerpt,
    content: seed.content,
    category: seed.category,
    tags: [seed.category.toLowerCase()],
    featuredImage: seed.featuredImage,
    isVisible: true,
    viewCount: 120 + index * 45,
    likeCount: 10 + index * 3,
    authorId: "admin",
    author: {
      fullName: "Editorial Team",
      email: "news@demo.com",
    },
    createdAt: seed.createdAt,
    updatedAt: seed.createdAt,
    deletedAt: null,
  };
}

export const MOCK_BLOGS: BlogProps[] = [
  ...FEATURED_HOME_BLOGS.map((seed, i) => toMockBlog(seed, i, seed.id!)),
  ...BLOG_SEEDS.map((seed, i) => toMockBlog(seed, i + FEATURED_HOME_BLOGS.length, String(i + 1))),
];

export function formatBlogCardDate(iso: string): string {
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    const months = [
      "JAN.",
      "FEB.",
      "MAR.",
      "APR.",
      "MAY.",
      "JUN.",
      "JUL.",
      "AUG.",
      "SEP.",
      "OCT.",
      "NOV.",
      "DEC.",
    ];
    return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
  } catch {
    return iso;
  }
}

export function formatBlogFilterDate(iso: string): string {
  try {
    const d = new Date(iso + "T12:00:00");
    if (isNaN(d.getTime())) return "SELECT DATE";
    const months = [
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUN",
      "JUL",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC",
    ];
    return `${d.getDate()} ${months[d.getMonth()]}, ${d.getFullYear()}`;
  } catch {
    return "SELECT DATE";
  }
}

export function getMockBlogById(id: string): BlogProps | undefined {
  return MOCK_BLOGS.find((b) => b.id === id || b.slug === id);
}

export const HOME_FEATURED_BLOG_IDS = [
  "ai-everyday-2025",
  "cybersecurity-threats-business",
  "cloud-transforming-small-business",
] as const;
