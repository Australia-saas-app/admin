"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronUp, LogOut, Settings, User } from "lucide-react"

export interface UserAccountMenuProps {
  profileHref: string
  settingsHref: string
  displayName: string
  subtitle?: string
  avatarUrl?: string
  isExpanded: boolean
  isLoggingOut?: boolean
  onLogout?: () => void
  onNavigate?: () => void
  variant?: "light" | "dark"
  compact?: boolean
  menuPlacement?: "auto" | "up" | "down"
  profileLabel?: string
  settingsLabel?: string
  logoutLabel?: string
}

/**
 * Single account control for the sidebar footer.
 * Opens an upward menu with Profile / Settings / Logout — no duplicated identity block.
 */
export default function UserAccountMenu({
  profileHref,
  settingsHref,
  displayName,
  subtitle,
  avatarUrl = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=128&q=80",
  isExpanded,
  isLoggingOut = false,
  onLogout,
  onNavigate,
  variant = "light",
  compact = false,
  menuPlacement = "up",
  profileLabel = "Profile",
  settingsLabel = "Settings",
  logoutLabel = "Log out",
}: UserAccountMenuProps) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onPointerDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", onPointerDown)
    return () => document.removeEventListener("mousedown", onPointerDown)
  }, [open])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  const isDark = variant === "dark"
  const showExpanded = isExpanded && !compact
  const openUp = menuPlacement === "up" || menuPlacement === "auto"

  const activeProfile = pathname === profileHref || pathname.startsWith(`${profileHref}/`)
  const activeSettings = pathname === settingsHref || pathname.startsWith(`${settingsHref}/`)

  const itemBase = isDark
    ? "flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-slate-200 transition-colors hover:bg-white/10"
    : "flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-muted"

  const itemActive = isDark ? "bg-white/10 font-medium text-white" : "bg-muted font-medium text-foreground"

  return (
    <div ref={rootRef} className={`relative ${showExpanded ? "w-full" : ""}`}>
      {open && (
        <div
          role="menu"
          className={[
            "absolute z-50 min-w-[13rem] overflow-hidden rounded-xl border p-1 shadow-lg",
            openUp ? "bottom-full mb-2" : "top-full mt-2",
            showExpanded ? "left-0 right-0 w-full" : "left-0",
            isDark ? "border-white/10 bg-[#1e293b]" : "border-border bg-card",
          ].join(" ")}
        >
          <Link
            href={profileHref}
            role="menuitem"
            onClick={() => {
              setOpen(false)
              onNavigate?.()
            }}
            className={`${itemBase} ${activeProfile ? itemActive : ""}`}
          >
            <User className="h-4 w-4 shrink-0 opacity-70" />
            {profileLabel}
          </Link>
          <Link
            href={settingsHref}
            role="menuitem"
            onClick={() => {
              setOpen(false)
              onNavigate?.()
            }}
            className={`${itemBase} ${activeSettings ? itemActive : ""}`}
          >
            <Settings className="h-4 w-4 shrink-0 opacity-70" />
            {settingsLabel}
          </Link>
          {onLogout && (
            <>
              <div className={`my-1 border-t ${isDark ? "border-white/10" : "border-border"}`} />
              <button
                type="button"
                role="menuitem"
                disabled={isLoggingOut}
                onClick={() => {
                  setOpen(false)
                  onLogout()
                }}
                className={`${itemBase} text-red-600 hover:bg-red-500/10 disabled:opacity-60 dark:text-red-400`}
              >
                <LogOut className="h-4 w-4 shrink-0" />
                {isLoggingOut ? "Signing out…" : logoutLabel}
              </button>
            </>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Account menu"
        className={[
          "flex w-full items-center rounded-xl transition-colors",
          showExpanded ? "gap-3 px-2.5 py-2" : "justify-center p-1.5",
          isDark
            ? open
              ? "bg-white/10"
              : "hover:bg-white/5"
            : open
              ? "bg-muted"
              : "hover:bg-muted/70",
        ].join(" ")}
      >
        <span
          className={[
            "shrink-0 overflow-hidden rounded-full border",
            showExpanded ? "h-10 w-10" : "h-9 w-9",
            isDark ? "border-white/20" : "border-border",
          ].join(" ")}
        >
          <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
        </span>

        {showExpanded && (
          <>
            <span className="min-w-0 flex-1 text-left">
              <span
                className={`block truncate text-sm font-semibold leading-tight ${
                  isDark ? "text-white" : "text-foreground"
                }`}
              >
                {displayName}
              </span>
              {subtitle && (
                <span
                  className={`mt-0.5 block truncate text-xs leading-tight ${
                    isDark ? "text-slate-400" : "text-muted-foreground"
                  }`}
                >
                  {subtitle}
                </span>
              )}
            </span>
            <ChevronUp
              className={[
                "h-4 w-4 shrink-0 transition-transform",
                open ? "" : "rotate-180",
                isDark ? "text-slate-400" : "text-muted-foreground",
              ].join(" ")}
            />
          </>
        )}
      </button>
    </div>
  )
}
