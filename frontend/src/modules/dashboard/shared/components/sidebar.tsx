"use client"

import React, { useEffect, useState, useRef } from "react"




interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
  children: React.ReactNode
}

export function Sidebar({ isOpen, onToggle, children }: SidebarProps) {

  const [isMobile, setIsMobile] = useState(false)

  // Refs to hold latest values so the mount effect and media listener can read them
  const isOpenRef = useRef(isOpen)
  const onToggleRef = useRef(onToggle)

  useEffect(() => {
    isOpenRef.current = isOpen
  }, [isOpen])

  useEffect(() => {
    onToggleRef.current = onToggle
  }, [onToggle])

  useEffect(() => {
    if (typeof window === "undefined") return

    const mq = window.matchMedia("(max-width: 1024px)")

    // Narrow wrapper type to support older API (addListener/removeListener) without using `any`.
    type AnyMQL = MediaQueryList & {
      addListener?: (l: (e: MediaQueryListEvent) => void) => void
      removeListener?: (l: (e: MediaQueryListEvent) => void) => void
    }
    const mqAny = mq as AnyMQL

    // Set initial mobile flag and close sidebar on mount if on mobile
    setIsMobile(mq.matches)
    if (mq.matches && isOpenRef.current) onToggleRef.current()

    const onChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches)
      // when switching to mobile view and sidebar is open, close it
      if (e.matches && isOpenRef.current) {
        onToggleRef.current()
      }
    }

    if (typeof mqAny.addEventListener === "function") mqAny.addEventListener("change", onChange)
    else mqAny.addListener?.(onChange)

    return () => {
      if (typeof mqAny.removeEventListener === "function") mqAny.removeEventListener("change", onChange)
      else mqAny.removeListener?.(onChange)
    }
  }, [])

  const baseClasses = `${isOpen ? "w-64" : "w-10"} bg-base-100 border-r border-base-100 shadow transition-all duration-300 ease-in-out flex flex-col`

  // On mobile, when the sidebar is open make it fixed/full-height and scrollable
  const mobileOpenClasses = isMobile && isOpen ? "fixed left-0 top-0 bottom-0 z-40 h-screen overflow-y-auto" : ""

  return (
    <>
      <aside className={`${baseClasses} ${mobileOpenClasses}`}>
        {children}
      </aside>
    </>
  )
}
