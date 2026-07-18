export type CommonTranslations = {
  header: {
    home: string
    technical: string
    gallery: string
    notice: string
    ourTeam: string
    associate: string
    branch: string
    blog: string
    dashboard: string
    login: string
    myAccount: string
    checkingSession: string
  }
  footer: {
    storeHeading: string
    contactUs: string
    globalAgency: string
    globalBranch: string
    copyright: string
    links: {
      onlineBanking: string
      advertising: string
      privacy: string
      sitemap: string
      notice: string
      latestNews: string
      careers: string
      courses: string
      marketplace: string
      transport: string
      realEstate: string
      branch: string
      visaProcessing: string
      visaTravel: string
    }
  }
  ui: {
    search: string
    all: string
    verify: string
    userId: string
    logout: string
    noResults: string
    noResultsHint: string
    clearAll: string
    reset: string
    showing: string
    of: string
    viewProject: string
    createProject: string
    upgradeAccount: string
  }
  countries: {
    india: string
    usa: string
    uk: string
    canada: string
    japan: string
  }
  currencies: {
    usd: string
    inr: string
    eur: string
    gbp: string
  }
  localePreferences: {
    language: string
    country: string
    currency: string
    regionHint: string
    allRegions: string
    changeInFooter: string
  }
}

export type DashboardTranslations = {
  user: {
    profile: string
    dashboard: string
    wallet: string
    earnings: string
    technical: string
    orders: string
    applications: string
    notices: string
    marketplace: string
    messages: string
    settings: string
  }
  affiliate: {
    profile: string
    dashboard: string
    wallet: string
    technical: string
    earnings: string
    referrals: string
    promotions: string
    notices: string
    messages: string
    settings: string
  }
}

export type GalleryTranslations = {
  title: string
  searchPlaceholder: string
  all: string
  uncategorized: string
}

export type TechnicalTranslations = {
  eyebrow: string
  title: string
  subtitle: string
  searchPlaceholder: string
  createProject: string
  projects: string
  filtersInstant: string
  noProjects: string
  noProjectsHint: string
  clearSearchFilters: string
  upgradePrompt: string
  duration: string
  experience: string
  budget: string
  modified: string
  viewProject: string
  filters: {
    title: string
    subtitle: string
    clearAll: string
    reset: string
    projectType: string
    category: string
    subcategory: string
    skills: string
    languages: string
    priceBudget: string
    upTo: string
    allTypes: string
    allCategories: string
    allSubcategories: string
    min: string
    max: string
  }
}

export type AffiliateTranslations = {
  rankLevel: string
  commissionRate: string
  rank: string
  upgradePrompt: string
}

export type BusinessTranslations = {
  sidebar: {
    profile: string
    dashboard: string
    wallet: string
    services: string
    transaction: string
    technical: string
    clients: string
    notices: string
    messages: string
    settings: string
    logout: string
    verify: string
    userId: string
  }
  dashboard: {
    totalProject: string
    pendingProject: string
    successfulProjects: string
    totalCommission: string
    totalWithdrawn: string
    currentBalance: string
    withdraw: string
    overview: string
    increase: string
    decrease: string
    withdrawHistory: string
    earningHistory: string
    view: string
    search: string
  }
  services: {
    title: string
    subtitle: string
    newService: string
    activeServices: string
    pendingApproval: string
    completedJobs: string
    monthlyRevenue: string
    allServices: string
    active: string
    pending: string
    completed: string
    searchPlaceholder: string
    manage: string
  }
  transactions: {
    title: string
    subtitle: string
    exportReport: string
    totalInflow: string
    totalOutflow: string
    pending: string
    availableBalance: string
    all: string
    deposits: string
    withdrawals: string
    invoices: string
    searchPlaceholder: string
    thisMonth: string
    quickActions: string
    requestWithdrawal: string
  }
}

export type UserPagesTranslations = {
  dashboard: {
    title: string
    subtitle: string
    totalProjects: string
    activeProjects: string
    completedProjects: string
    totalEarnings: string
    totalWithdrawn: string
    currentBalance: string
    withdraw: string
    overview: string
    increase: string
    decrease: string
    withdrawHistory: string
    earningHistory: string
    view: string
    search: string
    walletDesc: string
    earningsDesc: string
    technicalDesc: string
    ordersDesc: string
    noticesDesc: string
    messagesDesc: string
    open: string
    recentActivity: string
    viewAll: string
    serviceShortcuts: string
    needsAttention: string
    unreadNotices: string
    unreadMessages: string
  }
  wallet: {
    title: string
    subtitle: string
    totalEarnings: string
    totalWithdrawn: string
    pendingPayout: string
    availableBalance: string
    withdraw: string
    withdrawDemo: string
    withdrawHistory: string
    earningHistory: string
    search: string
    method: string
    amount: string
    status: string
    category: string
    commission: string
    quickActions: string
    viewEarnings: string
    viewOrders: string
    manageProfile: string
  }
  earnings: {
    title: string
    subtitle: string
    thisMonth: string
    lastMonth: string
    totalEarned: string
    pending: string
    earningHistory: string
    search: string
  }
  orders: {
    title: string
    subtitle: string
    totalOrders: string
    active: string
    completed: string
    totalSpent: string
    orderHistory: string
    search: string
    orderId: string
    service: string
    item: string
    amount: string
    status: string
    date: string
    browseMore: string
    marketplace: string
    courses: string
  }
  applications: {
    title: string
    subtitle: string
    total: string
    pending: string
    approved: string
    history: string
    search: string
    type: string
    listing: string
    status: string
    submitted: string
    emptyTitle: string
    emptyHint: string
  }
  notices: {
    title: string
    subtitle: string
    total: string
    unread: string
    publicBoard: string
    viewPublic: string
    search: string
    unreadOnly: string
    noNotices: string
    new: string
    markRead: string
    markAllRead: string
    markedRead: string
    allMarkedRead: string
  }
  marketplace: {
    title: string
    subtitle: string
    browseMarketplace: string
    purchases: string
    saved: string
    bids: string
    activity: string
    search: string
  }
  messages: {
    title: string
    subtitle: string
    total: string
    unread: string
    search: string
    unreadOnly: string
    from: string
    project: string
    demoBody: string
    demoBody2: string
    reply: string
    replyDemo: string
    archive: string
    archived: string
    selectMessage: string
  }
  userLog: {
    title: string
    subtitle: string
  }
}

export type AffiliatePagesTranslations = {
  dashboard: {
    title: string
    subtitle: string
    totalReferrals: string
    activeReferrals: string
    conversionRate: string
    totalCommission: string
    totalWithdrawn: string
    currentBalance: string
    withdraw: string
    levelSubtitle: string
    commissionOverview: string
    increase: string
    decrease: string
    withdrawHistory: string
    earningHistory: string
    view: string
    search: string
    walletDesc: string
    earningsDesc: string
    referralsDesc: string
    technicalDesc: string
    promotionsDesc: string
    noticesDesc: string
    messagesDesc: string
    open: string
    recentActivity: string
    viewAll: string
    referralShortcuts: string
    viewAllReferrals: string
    needsAttention: string
    unreadNotices: string
    unreadMessages: string
    performanceTip: string
    viewPromotions: string
  }
  wallet: {
    title: string
    subtitle: string
    totalCommission: string
    totalWithdrawn: string
    pendingPayout: string
    availableBalance: string
    withdraw: string
    withdrawDemo: string
    withdrawHistory: string
    earningHistory: string
    search: string
    method: string
    amount: string
    status: string
    category: string
    commission: string
    quickActions: string
    viewEarnings: string
    viewReferrals: string
    viewPromotions: string
  }
  earnings: {
    title: string
    subtitle: string
    thisMonth: string
    lastMonth: string
    totalEarned: string
    pending: string
    commissionHistory: string
    search: string
    category: string
    commission: string
    referral: string
    status: string
  }
  referrals: {
    title: string
    subtitle: string
    totalReferrals: string
    active: string
    converted: string
    totalCommission: string
    referralList: string
    search: string
    refId: string
    name: string
    email: string
    service: string
    commission: string
    status: string
    date: string
    copyLink: string
    linkCopied: string
  }
  notices: {
    title: string
    subtitle: string
    total: string
    unread: string
    publicBoard: string
    viewPublic: string
    search: string
    unreadOnly: string
    noNotices: string
    new: string
    markRead: string
    markAllRead: string
    markedRead: string
    allMarkedRead: string
  }
  promotions: {
    title: string
    subtitle: string
    createLink: string
    createDemo: string
    activeLinks: string
    totalClicks: string
    conversions: string
    totalCommission: string
    search: string
    clicks: string
    conversionsLabel: string
    preview: string
    linkCopied: string
  }
  messages: {
    title: string
    subtitle: string
    total: string
    unread: string
    search: string
    unreadOnly: string
    from: string
    demoBody: string
    demoBody2: string
    reply: string
    replyDemo: string
    archive: string
    archived: string
    selectMessage: string
  }
  affiliateLog: {
    title: string
    subtitle: string
  }
}

export type BusinessPagesTranslations = {
  wallet: {
    title: string
    subtitle: string
    totalCommission: string
    totalWithdrawn: string
    pendingPayout: string
    availableBalance: string
    withdraw: string
    withdrawHistory: string
    earningHistory: string
    search: string
    method: string
    amount: string
    status: string
    category: string
    commission: string
    view: string
    quickActions: string
    viewTransactions: string
    viewServices: string
    manageProfile: string
  }
  dashboard: {
    title: string
    subtitle: string
    activeServices: string
    monthlyRevenue: string
    activeClients: string
    pendingPayouts: string
    serviceCategories: string
    jobs: string
    activeJobs: string
    servicesDesc: string
    walletDesc: string
    transactionDesc: string
    clientsDesc: string
    technicalDesc: string
    noticesDesc: string
    messagesDesc: string
    open: string
    recentActivity: string
    viewAll: string
    exploreServices: string
    needsAttention: string
    unreadNotices: string
    unreadMessages: string
  }
  clients: {
    title: string
    subtitle: string
    addClient: string
    addDemo: string
    totalClients: string
    active: string
    activeJobs: string
    totalRevenue: string
    clientList: string
    search: string
    clientId: string
    name: string
    industry: string
    totalSpent: string
    status: string
    since: string
    action: string
    contact: string
    messageSent: string
    manageServices: string
  }
  notices: {
    title: string
    subtitle: string
    total: string
    unread: string
    publicBoard: string
    viewPublic: string
    search: string
    unreadOnly: string
    noNotices: string
    new: string
    markRead: string
    markAllRead: string
    markedRead: string
    allMarkedRead: string
  }
  messages: {
    title: string
    subtitle: string
    total: string
    unread: string
    search: string
    unreadOnly: string
    from: string
    demoBody: string
    demoBody2: string
    reply: string
    replyDemo: string
    archive: string
    archived: string
    selectMessage: string
  }
  businessLog: {
    title: string
    subtitle: string
  }
}

export type Translations = {
  common: CommonTranslations
  dashboard: DashboardTranslations
  userPages: UserPagesTranslations
  affiliatePages: AffiliatePagesTranslations
  businessPages: BusinessPagesTranslations
  gallery: GalleryTranslations
  technical: TechnicalTranslations
  affiliate: AffiliateTranslations
  business: BusinessTranslations
}

export const SUPPORTED_LOCALES = ["en", "hi", "es"] as const
export type Locale = (typeof SUPPORTED_LOCALES)[number]

export const LOCALE_STORAGE_KEY = "app-locale"
export const LOCALE_COOKIE_KEY = "app-locale"

export const LANGUAGE_OPTIONS: { value: Locale; label: string }[] = [
  { value: "en", label: "English" },
  { value: "hi", label: "हिन्दी" },
  { value: "es", label: "Español" },
]

export const DEFAULT_LOCALE: Locale = "en"

export function isLocale(value: string): value is Locale {
  return SUPPORTED_LOCALES.includes(value as Locale)
}

export type TranslationTree = {
  [key: string]: string | TranslationTree
}
