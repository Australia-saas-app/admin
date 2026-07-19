"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/src/shared/context/theme.provider"

type ThemeToggleProps = {
  className?: string
  compact?: boolean
}

export function ThemeToggle({ className = "", compact = false }: ThemeToggleProps) {
  const { theme, toggleTheme, ready } = useTheme()
  const isDark = theme === "dark"

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
      className={[
        "inline-flex items-center justify-center rounded-lg border transition-colors",
        compact ? "h-9 w-9" : "h-9 gap-2 px-3 text-xs font-medium",
        "border-border bg-background text-foreground hover:bg-accent",
        !ready ? "opacity-0" : "opacity-100",
        className,
      ].join(" ")}
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      {!compact && <span>{isDark ? "Light" : "Dark"}</span>}
    </button>
  )
}
