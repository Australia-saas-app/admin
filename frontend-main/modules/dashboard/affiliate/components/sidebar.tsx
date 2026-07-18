"use client"

import React, { useEffect, useState } from "react"

  interface SidebarProps {
    isOpen: boolean
    onToggle: () => void
    children: React.ReactNode
  }
 

  export function Sidebar({ isOpen, onToggle, children }: SidebarProps) {
    const [isCompactBreakpoint, setIsCompactBreakpoint] = useState<boolean>(false)

    useEffect(() => {
      if (typeof window === "undefined") return

      const mq = window.matchMedia("(max-width: 1024px)")

      const update = () => setIsCompactBreakpoint(Boolean(mq.matches))

      update()

      const onChange = (e: MediaQueryListEvent) => {
        update()
        if (e.matches && isOpen) {
          onToggle()
        }
      }

      if (typeof mq.addEventListener === "function") mq.addEventListener("change", onChange)
      else mq.addListener(onChange as any)

      return () => {
        if (typeof mq.removeEventListener === "function") mq.removeEventListener("change", onChange)
        else mq.removeListener(onChange as any)
      }
    }, [isOpen, onToggle])

    return (
      <>
        <aside
          className={`${isOpen ? "w-64" : "w-10"} bg-base-100 border-r border-base-100 shadow transition-all duration-300 ease-in-out flex flex-col`}
        >
          {children}
        </aside>

        {isCompactBreakpoint && !isOpen && (
          <button
            aria-label="Open sidebar"
            onClick={onToggle}
            className="fixed left-3 top-4 z-50 h-10 w-10 rounded-md bg-white shadow-lg flex items-center justify-center"
          >
            <svg width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 1.5H18" stroke="#111827" strokeWidth="2" strokeLinecap="round" />
              <path d="M0 7H18" stroke="#111827" strokeWidth="2" strokeLinecap="round" />
              <path d="M0 12.5H18" stroke="#111827" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </>
    )
  }
