export type AdminUserRole = "User" | "Affiliate" | "Business" | "Admin";

export interface AdminUserRecord {
  id: string;
  name: string;
  email: string;
  role: AdminUserRole;
  status: "Active" | "Suspended" | "Blocked";
  joined: string;
  verify: boolean;
}

const MOCK_ADMIN_USERS: AdminUserRecord[] = [
  {
    id: "00001",
    name: "Mr Jack",
    email: "jack@demo.com",
    role: "User",
    status: "Active",
    joined: "2025/01/15",
    verify: true,
  },
  {
    id: "00002",
    name: "Sarah Chen",
    email: "sarah@demo.com",
    role: "Affiliate",
    status: "Active",
    joined: "2025/02/03",
    verify: true,
  },
  {
    id: "00003",
    name: "Global Tech Ltd",
    email: "business@demo.com",
    role: "Business",
    status: "Active",
    joined: "2025/03/10",
    verify: true,
  },
  {
    id: "00004",
    name: "Alex Rivera",
    email: "alex@demo.com",
    role: "User",
    status: "Suspended",
    joined: "2025/04/22",
    verify: false,
  },
  {
    id: "00005",
    name: "Priya Sharma",
    email: "priya@demo.com",
    role: "Affiliate",
    status: "Active",
    joined: "2025/05/08",
    verify: true,
  },
  {
    id: "SUPER001",
    name: "Super Administrator",
    email: "admin@demo.com",
    role: "Admin",
    status: "Active",
    joined: "2024/01/01",
    verify: true,
  },
];

const STORAGE_KEY = "admin_user_overrides";
const REGISTERED_USERS_KEY = "admin_registered_users";

type UserOverrides = Record<string, Partial<AdminUserRecord>>;

function readOverrides(): UserOverrides {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as UserOverrides;
  } catch {
    return {};
  }
}

function writeOverrides(overrides: UserOverrides) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
}

function readRegisteredUsers(): AdminUserRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(REGISTERED_USERS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as AdminUserRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeRegisteredUsers(users: AdminUserRecord[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
}

function mergeUser(base: AdminUserRecord): AdminUserRecord {
  const overrides = readOverrides();
  return { ...base, ...overrides[base.id] };
}

export function registerAdminUserFromSignup(input: {
  userId: string;
  name: string;
  email: string;
  role: AdminUserRole;
}): AdminUserRecord {
  const existing = getAdminUserById(input.userId);
  if (existing) return existing;

  const user: AdminUserRecord = {
    id: input.userId,
    name: input.name,
    email: input.email,
    role: input.role,
    status: "Active",
    joined: new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }),
    verify: false,
  };

  writeRegisteredUsers([user, ...readRegisteredUsers().filter((u) => u.id !== user.id)]);
  return user;
}

export function getAllAdminUsers(): AdminUserRecord[] {
  const registered = readRegisteredUsers().map(mergeUser);
  const mock = MOCK_ADMIN_USERS.map(mergeUser);
  const seen = new Set<string>();
  return [...registered, ...mock].filter((user) => {
    if (seen.has(user.id)) return false;
    seen.add(user.id);
    return true;
  });
}

export function getAdminUserById(id: string): AdminUserRecord | undefined {
  const registered = readRegisteredUsers().find((u) => u.id === id);
  const base = registered ?? MOCK_ADMIN_USERS.find((u) => u.id === id);
  if (!base) return undefined;
  return mergeUser(base);
}

export function updateAdminUser(
  id: string,
  updates: Partial<AdminUserRecord>
): AdminUserRecord | undefined {
  const base = getAdminUserById(id);
  if (!base) return undefined;
  const overrides = readOverrides();
  overrides[id] = { ...overrides[id], ...updates };
  writeOverrides(overrides);
  return { ...base, ...updates };
}
