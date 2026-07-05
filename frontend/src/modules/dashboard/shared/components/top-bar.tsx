"use client"

import { Menu, Bell, Settings, User } from "lucide-react"

interface TopBarProps {
  onMenuClick: () => void
}

export function TopBar({ onMenuClick }: TopBarProps) {
  return (
    <header className="bg-base-100 border-b border-base-100 shadow px-6 py-4 flex items-center justify-end sticky top-0 z-10">

      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-muted rounded-lg transition-colors">
          <Bell className="w-5 h-5" />
        </button>
        <button className="p-2 hover:bg-muted rounded-lg transition-colors">
          <Settings className="w-5 h-5" />
        </button>
        <button className="p-2 hover:bg-muted rounded-lg transition-colors">
          <User className="w-5 h-5" />
        </button>
      </div>
    </header>
  )
}
