"use client"

import { Button } from "@/src/components/ui/button"
import { ChevronDown, LogOut, Play } from "lucide-react"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAppDispatch } from "@/src/redux/hooks"
import { logout } from "@/src/redux/slices/authSlice"

const AccountSidebarChildren = ({ isOpen, onToggle }: { isOpen: boolean, onToggle: () => void }) => {
  const pathname = usePathname()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const isPlatformActive = pathname.startsWith('/gallery') ||
    pathname.startsWith('/notices') ||
    pathname.startsWith('/blog') ||
    pathname.startsWith('/contact-us') ||
    pathname.startsWith('/our-team') ||
    pathname.startsWith('/branches') ||
    pathname.startsWith('/company')

  const handleLogout = () => {
    dispatch(logout())
    router.replace("/account/login")
  }


  const userDetailMatch = pathname.match(/\/all-users\/(\d+)/)
  const affiliateDetailMatch = pathname.match(/\/all-affiliates\/(\d+)/)
  const businessDetailMatch = pathname.match(/\/all-businesses\/(\d+)/)
  const isUserDetailPage = !!userDetailMatch || !!affiliateDetailMatch || !!businessDetailMatch
  const userId = userDetailMatch?.[1] || affiliateDetailMatch?.[1] || businessDetailMatch?.[1]

  console.log(pathname)

  // User detail page menu items - use proper routes
  const DetailMenuItems = userId ? [
    ...(userDetailMatch ? [
      { label: "Profile", href: `/all-users/${userId}` },
      { label: "Wallet", href: `/all-users/${userId}/wallet` },
      { label: "Technical", href: `/all-users/${userId}/technical` },
    ] : []),
    ...(affiliateDetailMatch ? [
      { label: "Profile", href: `/all-affiliates/${userId}` },
      { label: "Wallet", href: `/all-affiliates/${userId}/wallet` },
      { label: "Technical", href: `/all-affiliates/${userId}/technical` },
    ] : []),
    ...(businessDetailMatch ? [
      { label: "Profile", href: `/all-businesses/${userId}` },
      { label: "Wallet", href: `/all-businesses/${userId}/wallet` },
      { label: "Technical", href: `/all-businesses/${userId}/technical` },
    ] : []),
  ] : []

  // Regular dashboard menu items
  const menuItems = [
    {
      label: "Dashboard",
      href: `/dashboard`,
    },
    {
      label: "Technical Service",
      href: `/technical`,
    },
    {
      label: "Live Chat",
      href: `/live-chat`,
    },
    {
      label: "Service",
      href: `/service`,
    },
    { label: "All Users", href: `/all-users` },
    { label: "All Affiliates", href: `/all-affiliates` },
    { label: "All Businesses", href: `/all-businesses` },

    {
      label: "Platform",
      href: `/gallery`,
      active: isPlatformActive
    },
    // {
    //   label: "Menu",
    //   href: `/menu`,
    // },
    {
      label: "Admin",
      href: `/admin`,
    },
    {
      label: "Setting",
      href: `/setting`,
    },

  ]


  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/")

  return (
    <div className={`${isOpen ? 'w-64' : 'w-10'} relative transition-all duration-300 ease-in-out flex flex-col h-full`}>
      <div className="p-4 ">
        <button
          onClick={onToggle}
          className="text-sm px-2 py-1 bg-gray-100 rounded "
        >
          {isOpen ?
            <Play className='absolute right-0 cursor-pointer top-4 rotate-180' /> :
            <Play className='absolute right-0 cursor-pointer top-4' />
          }
        </button>
      </div>
      <div className="p-4 border-b border-sidebar-border -mt-14 flex items-center justify-center">
        <div className={` p-4 text-center ${isOpen ? "block" : "hidden"}`}>
          <div className="w-24 h-24 bg-gray-300 rounded-full overflow-hidden border-2 border-gray-400">
            <Image width={96} height={96} src={'https://lh3.googleusercontent.com/a-/ALV-UjUcIWda3ZrzBMAJl37_GUwH9bvPyroMBoqo3x1hKRyIO-LD96s=s240-p-k-rw-no'} alt={'Admin'} className="w-full h-full object-cover" />

          </div>
          <h3 className="font-semibold">Admin</h3>
        </div>
      </div>

      {/* Navigation Items */}
      {
        isOpen && (<nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {isUserDetailPage ? (
            // Show user-specific menu items
            DetailMenuItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item?.label}
                  href={item.href}
                >
                  <Button className="w-full my-1" variant={isActive ? "default" : "outline"}>
                    <span className={isOpen ? "block" : "hidden"}>{item.label}</span>

                  </Button>
                </Link>
              )
            })
          ) : (
            // Show regular dashboard menu items
            <>
              {menuItems.map((item) => (
                <Link key={item?.label}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${(item as any).active ?? isActive(item.href)
                    ? `${isOpen && 'bg-primary text-sidebar-primary-foreground'}`
                    : `${isOpen && "border bg-background shadow-xs hover:bg-primary hover:text-primary-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50"}`
                    }`}
                >
                  <span className={isOpen ? "block" : "hidden"}>{item.label}</span>
                </Link>
              ))}

            </>
          )}
        </nav>)
      }

      {/* Sidebar Footer */}
      {
        isOpen && (<div className="border-t border-sidebar-border p-4 space-y-2">
          <Button variant="outline" size="default" className="w-full justify-center items-center" onClick={handleLogout}>
            <LogOut className="w-5 h-5 shrink-0" />
            <span className={isOpen ? "block" : "hidden"}>Logout</span>
          </Button>
        </div>)
      }
    </div>
  )
}

export default AccountSidebarChildren