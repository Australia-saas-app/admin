"use client"

import React from 'react'

export default function DesignCatalogHelper() {
  const categories = [
    {
      title: "Corporate Pages",
      links: [
        { label: "Our Team (.bd.png)", href: "/our-teams" },
        { label: "Latest News (Page 2 - our latest news.png)", href: "/blogs" },
        { label: "Notice (Page 2 - notice.png)", href: "/notice" },
        { label: "Associate (Page 2 - company.png)", href: "/associate" },
    { label: "Global Branches (Page 2 - global business.png)", href: "/branch" },
      ]
    },
    {
      title: "Domain Catalogs",
      links: [
        { label: "Courses Catalog (.bd-1.png)", href: "/courses" },
        { label: "Careers Page (.bd-2.png)", href: "/careers" },
        { label: "Marketplace (.bd-3.png)", href: "/marketplace" },
        { label: "Transport Page (.bd-4.png)", href: "/transport" },
        { label: "Visa Processing (Page 2 - all construction.png)", href: "/visa" },
        { label: "Visa & Travel Listings (Frame-1.png)", href: "/visa-travel" },
        { label: "Real Estate (Page 2 - featured designs (clicked).png)", href: "/real-estate" },
      ]
    },
    {
      title: "Dashboard & Form Routes",
      links: [
        { label: "Create Course Form (Create course and bl.png)", href: "/courses/create" },
        { label: "Affiliate Dashboard (Page 333.png)", href: "/affiliate/dashboard" },
        { label: "Business Dashboard (Page 332.png)", href: "/business/dashboard" },
        { label: "Business Services", href: "/business/services" },
        { label: "Business Transactions", href: "/business/transaction" },
        { label: "User Wallet Dashboard", href: "/user/wallet" },
        { label: "User Profile Dashboard (Edit profile.png)", href: "/user/profile" },
        { label: "User Technical Projects (Page 343.png)", href: "/user/technical" },
        { label: "Affiliate Technical Projects (Page 324.png)", href: "/affiliate/technical" },
        { label: "Airline Dashboard (Airline.png)", href: "/airline" },
        { label: "Admin Creation Form (new admin raetion process.png)", href: "/admin/create" },
      ]
    }
  ]

  return (
    <section className="my-12 p-8 bg-linear-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 shadow-sm">
      <h2 className="text-xl font-bold text-[#1e1e40] mb-2">SYDB Design Catalog & Test Route Navigator</h2>
      <p className="text-xs text-gray-500 mb-6">Use these shortcut paths to interactively inspect and test each implemented design mockup on your local Next.js development server.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((cat, idx) => (
          <div key={idx} className="bg-white p-5 rounded-xl border border-gray-150 shadow-xs">
            <h3 className="text-sm font-extrabold text-[#2a2a4a] mb-3 uppercase tracking-wider">{cat.title}</h3>
            <ul className="space-y-2">
              {cat.links.map((link, lIdx) => (
                <li key={lIdx}>
                  <a 
                    href={link.href} 
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1.5"
                  >
                    <span>➔</span> {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
