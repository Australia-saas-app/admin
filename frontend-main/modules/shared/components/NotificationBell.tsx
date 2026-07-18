"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bell, CheckCheck } from "lucide-react";
import type { NotificationItem } from "@/src/constants/notifications";
import { useNotifications } from "@/src/shared/context/notification.provider";

type NotificationBellProps = {
  viewAllHref: string;
  variant?: "light" | "dark";
  emptyLabel?: string;
};

export function NotificationBell({
  viewAllHref,
  variant = "light",
  emptyLabel = "You're all caught up",
}: NotificationBellProps) {
  const [open, setOpen] = useState(false);
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  const isDark = variant === "dark";
  const buttonClass = isDark
    ? "relative rounded-lg p-2 text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
    : "relative rounded-lg p-2 text-gray-600 hover:bg-gray-100 transition-colors";

  const panelClass = isDark
    ? "absolute right-0 top-full z-50 mt-2 w-[min(100vw-2rem,360px)] overflow-hidden rounded-xl border border-white/10 bg-[#1e293b] text-white shadow-2xl"
    : "absolute right-0 top-full z-50 mt-2 w-[min(100vw-2rem,360px)] overflow-hidden rounded-xl border border-gray-200 bg-white text-gray-900 shadow-xl";

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className={buttonClass}
        aria-label={unreadCount > 0 ? `${unreadCount} unread notifications` : "Notifications"}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white ring-2 ring-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className={panelClass} role="menu">
          <div
            className={`flex items-center justify-between border-b px-4 py-3 ${
              isDark ? "border-white/10" : "border-gray-100"
            }`}
          >
            <div>
              <p className="text-sm font-semibold">Notifications</p>
              <p className={`text-xs ${isDark ? "text-slate-400" : "text-gray-500"}`}>
                {unreadCount > 0 ? `${unreadCount} unread` : emptyLabel}
              </p>
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllRead}
                className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium ${
                  isDark ? "text-slate-300 hover:bg-white/10" : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <CheckCheck className="h-3.5 w-3.5" />
                Mark all read
              </button>
            )}
          </div>

          <ul className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <li
                className={`px-4 py-8 text-center text-sm ${isDark ? "text-slate-400" : "text-gray-500"}`}
              >
                {emptyLabel}
              </li>
            ) : (
              notifications.map((item) => (
                <li key={item.id}>
                  {item.href ? (
                    <Link
                      href={item.href}
                      onClick={() => {
                        markRead(item.id);
                        setOpen(false);
                      }}
                      className={`block border-b px-4 py-3 transition-colors last:border-0 ${
                        isDark
                          ? `border-white/5 hover:bg-white/5 ${!item.read ? "bg-white/5" : ""}`
                          : `border-gray-50 hover:bg-gray-50 ${!item.read ? "bg-blue-50/40" : ""}`
                      }`}
                    >
                      <NotificationRow item={item} isDark={isDark} />
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={() => markRead(item.id)}
                      className={`block w-full border-b px-4 py-3 text-left transition-colors last:border-0 ${
                        isDark
                          ? `border-white/5 hover:bg-white/5 ${!item.read ? "bg-white/5" : ""}`
                          : `border-gray-50 hover:bg-gray-50 ${!item.read ? "bg-blue-50/40" : ""}`
                      }`}
                    >
                      <NotificationRow item={item} isDark={isDark} />
                    </button>
                  )}
                </li>
              ))
            )}
          </ul>

          <div
            className={`border-t px-4 py-2.5 ${isDark ? "border-white/10 bg-white/5" : "border-gray-100 bg-gray-50"}`}
          >
            <Link
              href={viewAllHref}
              onClick={() => setOpen(false)}
              className={`block text-center text-xs font-semibold ${
                isDark ? "text-blue-300 hover:text-blue-200" : "text-primary hover:underline"
              }`}
            >
              View all notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function NotificationRow({ item, isDark }: { item: NotificationItem; isDark: boolean }) {
  return (
    <div className="flex items-start gap-3">
      <span
        className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
          item.read ? (isDark ? "bg-slate-600" : "bg-gray-300") : "bg-red-500"
        }`}
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{item.title}</p>
        <p className={`mt-0.5 line-clamp-2 text-xs ${isDark ? "text-slate-400" : "text-gray-600"}`}>
          {item.message}
        </p>
        <p className={`mt-1 text-[11px] ${isDark ? "text-slate-500" : "text-gray-400"}`}>
          {item.time}
        </p>
      </div>
    </div>
  );
}
