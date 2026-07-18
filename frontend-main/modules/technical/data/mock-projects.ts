import type { TechnicalProject } from "../types/project.type"

const PROJECT_TYPES = [
  "new-build",
  "upgrade",
  "troubleshooting",
  "maintenance",
  "installation",
] as const

const SUBCATEGORIES = ["frontend", "backend", "fullstack"] as const
const LANGUAGES = ["english", "hindi", "bengali", "spanish"] as const

function parsePrice(priceRange: string): number {
  return Number(priceRange.replace(/[^0-9.]/g, "")) || 0
}

function getCategoryFilter(category: string): TechnicalProject["categoryFilter"] {
  if (category === "Mobile Development") return "mobile"
  if (["Web Development", "Design", "Technical Writing"].includes(category)) return "web"
  return "software"
}

type RawProject = Omit<
  TechnicalProject,
  "categoryFilter" | "projectType" | "subcategory" | "languages" | "price"
>

const RAW_TECHNICAL_PROJECTS: RawProject[] = [
  {
    id: 1,
    title:
      "Frontend & Backend Module: Documents Validation, Inventory, and Business Management Development",
    category: "Web Development",
    skills: ["Python", "React", "Django"],
    duration: "3 Months 8 Days",
    experience: "5 Years",
    priceRange: "$10,000.00",
    modified: "3 Months 8 Days",
    location: "Remote",
    description:
      "Experienced full-stack developer needed to build document validation (Govt. PAN, GST, Aadhar/Voter ID) and inventory management modules with secure API integration.",
  },
  {
    id: 2,
    title: "Mobile App Development with Real-Time Sync and Offline Capabilities",
    category: "Mobile Development",
    skills: ["React Native", "Firebase", "TypeScript"],
    duration: "2 Months 4 Days",
    experience: "3 Years",
    priceRange: "$7,500.00",
    modified: "1 Month 2 Days",
    location: "Hybrid",
    description:
      "Skilled mobile developer to create a cross-platform application with real-time synchronization, offline mode, and secure document verification.",
  },
  {
    id: 3,
    title: "Software Testing & Quality Assurance for Enterprise Application",
    category: "QA Testing",
    skills: ["Selenium", "Jest", "Cypress"],
    duration: "1 Month 2 Days",
    experience: "2 Years",
    priceRange: "$3,500.00",
    modified: "2 Weeks",
    location: "Remote",
    description:
      "QA specialist to implement automated testing suites, perform regression testing, and ensure quality across web and mobile platforms.",
  },
  {
    id: 4,
    title: "Database Architecture & Performance Optimization for High-Traffic App",
    category: "Backend Development",
    skills: ["PostgreSQL", "MongoDB", "Redis"],
    duration: "6 Weeks",
    experience: "4 Years",
    priceRange: "$8,200.00",
    modified: "5 Days",
    location: "On-site",
    description:
      "Database expert to design scalable architecture, optimize queries, implement caching, and support millions of daily transactions.",
  },
  {
    id: 5,
    title: "UI/UX Design for E-commerce Platform with Advanced Features",
    category: "Design",
    skills: ["Figma", "Adobe XD", "Prototyping"],
    duration: "3 Weeks",
    experience: "3 Years",
    priceRange: "$4,800.00",
    modified: "1 Week",
    location: "Remote",
    description:
      "Creative designer to redesign an e-commerce platform focused on conversion, accessibility, and mobile-first responsive experiences.",
  },
  {
    id: 6,
    title: "DevOps Pipeline Setup & CI/CD for Microservices Architecture",
    category: "DevOps",
    skills: ["Docker", "Kubernetes", "Jenkins"],
    duration: "4 Weeks",
    experience: "5 Years",
    priceRange: "$11,500.00",
    modified: "4 Days",
    location: "Remote",
    description:
      "DevOps engineer to establish automated deployment pipelines, infrastructure as code, monitoring, and container orchestration.",
  },
  {
    id: 7,
    title: "Cloud Migration & AWS Infrastructure Modernization",
    category: "Cloud Engineering",
    skills: ["AWS", "Terraform", "Linux"],
    duration: "8 Weeks",
    experience: "6 Years",
    priceRange: "$14,200.00",
    modified: "6 Days",
    location: "Hybrid",
    description:
      "Cloud architect to migrate legacy workloads to AWS, implement IaC, and improve reliability with auto-scaling and observability.",
  },
  {
    id: 8,
    title: "Cybersecurity Audit & Application Hardening",
    category: "Security",
    skills: ["OWASP", "Pen Testing", "SIEM"],
    duration: "5 Weeks",
    experience: "5 Years",
    priceRange: "$9,800.00",
    modified: "2 Days",
    location: "Remote",
    description:
      "Security specialist for vulnerability assessment, penetration testing, and remediation planning across production systems.",
  },
  {
    id: 9,
    title: "ERP Integration with CRM and Payment Gateways",
    category: "Integration",
    skills: ["REST API", "Node.js", "SAP"],
    duration: "10 Weeks",
    experience: "4 Years",
    priceRange: "$12,400.00",
    modified: "1 Day",
    location: "On-site",
    description:
      "Integration developer to connect ERP, CRM, and payment systems with robust error handling and audit logging.",
  },
  {
    id: 10,
    title: "AI Chatbot & NLP Workflow Automation",
    category: "AI / ML",
    skills: ["Python", "LangChain", "OpenAI API"],
    duration: "7 Weeks",
    experience: "3 Years",
    priceRange: "$6,900.00",
    modified: "3 Days",
    location: "Remote",
    description:
      "ML engineer to build conversational workflows, document summarization, and customer support automation with guardrails.",
  },
  {
    id: 11,
    title: "Legacy PHP Application Refactor to Modern Stack",
    category: "Web Development",
    skills: ["PHP", "Laravel", "Vue.js"],
    duration: "12 Weeks",
    experience: "5 Years",
    priceRange: "$15,600.00",
    modified: "1 Week",
    location: "Hybrid",
    description:
      "Senior developer to modernize a legacy monolith into modular services with improved performance and maintainability.",
  },
  {
    id: 12,
    title: "Technical Documentation & API Developer Portal",
    category: "Technical Writing",
    skills: ["Swagger", "Markdown", "Postman"],
    duration: "4 Weeks",
    experience: "2 Years",
    priceRange: "$3,200.00",
    modified: "5 Days",
    location: "Remote",
    description:
      "Technical writer to produce API references, onboarding guides, and interactive examples for partner integrations.",
  },
  {
    id: 13,
    title: "Blockchain Smart Contract Review & Web3 Integration",
    category: "Blockchain",
    skills: ["Solidity", "Web3.js", "Hardhat"],
    duration: "6 Weeks",
    experience: "4 Years",
    priceRange: "$13,500.00",
    modified: "2 Weeks",
    location: "Remote",
    description:
      "Blockchain developer for smart contract audits, wallet integration, and secure transaction flows on EVM networks.",
  },
  {
    id: 14,
    title: "Network Infrastructure Setup for Multi-Branch Offices",
    category: "Networking",
    skills: ["Cisco", "VPN", "Firewall"],
    duration: "5 Weeks",
    experience: "6 Years",
    priceRange: "$10,300.00",
    modified: "4 Days",
    location: "On-site",
    description:
      "Network engineer to deploy secure branch connectivity, VLAN segmentation, and failover across regional offices.",
  },
  {
    id: 15,
    title: "Data Warehouse & BI Dashboard Implementation",
    category: "Data Engineering",
    skills: ["Snowflake", "dbt", "Power BI"],
    duration: "9 Weeks",
    experience: "4 Years",
    priceRange: "$11,900.00",
    modified: "6 Days",
    location: "Hybrid",
    description:
      "Data engineer to build ETL pipelines, dimensional models, and executive dashboards for operations and finance teams.",
  },
  {
    id: 16,
    title: "IoT Fleet Monitoring Platform Development",
    category: "IoT",
    skills: ["MQTT", "Node.js", "Grafana"],
    duration: "11 Weeks",
    experience: "5 Years",
    priceRange: "$16,800.00",
    modified: "3 Days",
    location: "Remote",
    description:
      "IoT developer to ingest sensor telemetry, trigger alerts, and visualize fleet health in near real time.",
  },
  {
    id: 17,
    title: "Salesforce Customization & Workflow Automation",
    category: "CRM",
    skills: ["Salesforce", "Apex", "Flows"],
    duration: "6 Weeks",
    experience: "3 Years",
    priceRange: "$7,100.00",
    modified: "1 Day",
    location: "Remote",
    description:
      "Salesforce consultant to customize objects, automate lead routing, and integrate marketing attribution pipelines.",
  },
  {
    id: 18,
    title: "Video Streaming Platform Performance Optimization",
    category: "Media Tech",
    skills: ["FFmpeg", "CDN", "HLS"],
    duration: "8 Weeks",
    experience: "5 Years",
    priceRange: "$12,750.00",
    modified: "2 Days",
    location: "Remote",
    description:
      "Media engineer to reduce buffering, optimize transcoding pipelines, and improve playback on low-bandwidth networks.",
  },
]

export const MOCK_TECHNICAL_PROJECTS: TechnicalProject[] = RAW_TECHNICAL_PROJECTS.map(
  (project, index) => ({
    ...project,
    price: parsePrice(project.priceRange),
    projectType: PROJECT_TYPES[index % PROJECT_TYPES.length],
    subcategory: SUBCATEGORIES[index % SUBCATEGORIES.length],
    categoryFilter: getCategoryFilter(project.category),
    languages: [
      LANGUAGES[index % LANGUAGES.length],
      ...(index % 2 === 0 ? [LANGUAGES[(index + 1) % LANGUAGES.length]] : []),
    ],
  })
)
