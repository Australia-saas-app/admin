"use client"

import type { ReactNode } from "react"

interface AccountLayoutProps {
  children: ReactNode
}

function AccountLayout({ children }: AccountLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-linear-to-br from-blue-50 via-white to-purple-50">
      {/* Decorative wavy background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg
          className="absolute -top-40 -right-40 w-96 h-96 opacity-20"
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="url(#wave1)"
            d="M40.7,-68.6C54.1,-59.5,66.8,-46.4,71.6,-31C76.4,-15.6,73.3,2.1,67.9,18.3C62.5,34.5,54.7,48.1,44.1,59.1C33.5,70.1,20.1,78.5,5.1,79C-10,79.5,-26.8,72.1,-39.2,61.5C-51.6,50.9,-60.6,37.1,-65.2,22.1C-69.8,7.1,-70,-9.2,-65.7,-23.6C-61.4,-38,-52.6,-51.5,-41,-61C-29.4,-70.5,-15.7,-76,-1.5,-74.8C12.7,-73.6,25.4,-65.7,40.7,-68.6Z"
            transform="translate(100 100)"
          />
          <defs>
            <linearGradient id="wave1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: "#06b6d4", stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: "#a78bfa", stopOpacity: 1 }} />
            </linearGradient>
          </defs>
        </svg>
        <svg
          className="absolute top-1/2 -left-48 w-96 h-96 opacity-20"
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="url(#wave2)"
            d="M40.7,-68.6C54.1,-59.5,66.8,-46.4,71.6,-31C76.4,-15.6,73.3,2.1,67.9,18.3C62.5,34.5,54.7,48.1,44.1,59.1C33.5,70.1,20.1,78.5,5.1,79C-10,79.5,-26.8,72.1,-39.2,61.5C-51.6,50.9,-60.6,37.1,-65.2,22.1C-69.8,7.1,-70,-9.2,-65.7,-23.6C-61.4,-38,-52.6,-51.5,-41,-61C-29.4,-70.5,-15.7,-76,-1.5,-74.8C12.7,-73.6,25.4,-65.7,40.7,-68.6Z"
            transform="translate(100 100)"
          />
          <defs>
            <linearGradient id="wave2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: "#ec4899", stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: "#06b6d4", stopOpacity: 1 }} />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-2xl">{children}</div>
    </div>
  )
}


export default AccountLayout