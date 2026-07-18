"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { toast } from "sonner";
import {
  ADMIN_NOTIFICATIONS,
  AFFILIATE_NOTIFICATIONS,
  BUSINESS_NOTIFICATIONS,
  USER_NOTIFICATIONS,
  type NotificationItem,
} from "@/src/constants/notifications";
import { useUser } from "@/src/context/user.provider";

interface INotificationContext {
  notifications: NotificationItem[];
  unreadCount: number;
  /** Push a new notification (shows a toast and prepends to the list). */
  notify: (item: Omit<NotificationItem, "id" | "time" | "read">) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
}

const NotificationContext = createContext<INotificationContext | undefined>(undefined);

const READ_STORAGE_KEY = "sysdb.notifications.read";

function roleSeed(role: string | undefined): NotificationItem[] {
  switch (role) {
    case "ADMIN":
    case "SUPER_ADMIN":
      return ADMIN_NOTIFICATIONS;
    case "AFFILIATE":
      return AFFILIATE_NOTIFICATIONS;
    case "BUSINESS":
      return BUSINESS_NOTIFICATIONS;
    case "USER":
      return USER_NOTIFICATIONS;
    default:
      return [];
  }
}

function loadReadIds(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(READ_STORAGE_KEY);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

function persistReadIds(ids: Set<string>): void {
  try {
    window.localStorage.setItem(READ_STORAGE_KEY, JSON.stringify([...ids].slice(-200)));
  } catch {
    // storage unavailable
  }
}

/**
 * Global notification store. Seeds role-appropriate demo notifications until
 * the backend pushes real events; read state persists across reloads. Code
 * anywhere in the app can call `notify(...)` to raise a notification + toast.
 */
export function NotificationProvider({ children }: { children: ReactNode }) {
  const { user } = useUser();
  const role = user && "role" in user ? String(user.role ?? "") : undefined;

  const [items, setItems] = useState<NotificationItem[]>([]);

  useEffect(() => {
    const readIds = loadReadIds();
    setItems(roleSeed(role).map((item) => (readIds.has(item.id) ? { ...item, read: true } : item)));
  }, [role]);

  const markRead = useCallback((id: string) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, read: true } : item)));
    const readIds = loadReadIds();
    readIds.add(id);
    persistReadIds(readIds);
  }, []);

  const markAllRead = useCallback(() => {
    setItems((prev) => {
      const readIds = loadReadIds();
      prev.forEach((item) => readIds.add(item.id));
      persistReadIds(readIds);
      return prev.map((item) => ({ ...item, read: true }));
    });
  }, []);

  const notify = useCallback((item: Omit<NotificationItem, "id" | "time" | "read">) => {
    const entry: NotificationItem = {
      ...item,
      id: `live-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      time: "Just now",
      read: false,
    };
    setItems((prev) => [entry, ...prev].slice(0, 50));
    toast(item.title, { description: item.message });
  }, []);

  const value = useMemo<INotificationContext>(
    () => ({
      notifications: items,
      unreadCount: items.filter((item) => !item.read).length,
      notify,
      markRead,
      markAllRead,
    }),
    [items, notify, markRead, markAllRead]
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

export function useNotifications(): INotificationContext {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotifications must be used within the NotificationProvider");
  }
  return context;
}
