"use client"

import React, { useState } from 'react'
import { Search, ChevronDown, ChevronUp } from 'lucide-react'

const SIDEBAR_ITEMS = [
  'Overview',
  'Inbox',
  'Analytics',
  'Reports',
  'Orders',
  'Users',
  'Complaints',
  'Help',
  'Logout'
]

const REPORTS_SUB_ITEMS = ['Earnings', 'Refunds']

const METRICS = [
  { label: 'Total Followers', value: '25,000', change: '10%', isUp: false },
  { label: 'Total Customers', value: '1000', change: '10%', isUp: false },
  { label: 'Total Orders', value: '1000', change: '10%', isUp: true },
  { label: 'Total Impressions', value: '1000', change: '10%', isUp: false },
]

const BAR_DATA = [
  { sales: 48000, returns: 25000 },
  { sales: 55000, returns: 32000 },
  { sales: 36000, returns: 25000 },
  { sales: 32000, returns: 22000 },
  { sales: 51000, returns: 34000 },
  { sales: 33000, returns: 33000 },
  { sales: 44000, returns: 25000 },
  { sales: 24000, returns: 18000 },
  { sales: 51000, returns: 0 }, // Based on mockup visual gaps
]

const UPCOMING_ORDERS = [
  { date: '15-08-2023', id: 'df355', time: '13:55 PM', items: [{ name: 'Item 1', qty: '3x' }, { name: 'Item 1', qty: '3x' }, { name: 'Item 1', qty: '3x' }] },
  { date: '16-08-2023', id: 'df355', time: '13:55 PM', items: [{ name: 'Item 1', qty: '3x' }, { name: 'Item 1', qty: '3x' }] },
  { date: '16-08-2023', id: 'df355', time: '13:55 PM', items: [{ name: 'Item 1', qty: '3x' }] },
]

export default function EcommerceDashboard() {
  const [activeItem, setActiveItem] = useState('Overview')
  const [reportsOpen, setReportsOpen] = useState(true)

  return (
    <div className="flex min-h-screen bg-[#f3f4f6] font-sans text-gray-800 relative">
      
      {/* Sidebar */}
      <div className="w-[240px] bg-white flex flex-col pt-8 pb-4 shrink-0 shadow-sm z-10">
        
        {/* Logo Area */}
        <div className="flex items-center gap-3 px-6 mb-8">
          <div className="w-10 h-10 bg-[#3b82f6] rounded-full flex items-center justify-center text-white shrink-0 shadow-sm">
            {/* simple abstract logo */}
          </div>
          <span className="font-bold text-[#3b82f6] text-[15px] tracking-wide">E-COMMERCE</span>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-3 px-6 mb-6">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
            <img src="https://i.pravatar.cc/150?img=11" alt="John Smith" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-gray-900 text-[15px]">John Smith</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
              <span className="text-[11px] text-gray-400 font-medium">Online</span>
            </div>
          </div>
        </div>
        
        <div className="border-b border-gray-100 mx-6 mb-6"></div>

        {/* Navigation */}
        <div className="flex flex-col gap-1 px-4 flex-1 overflow-y-auto">
          {SIDEBAR_ITEMS.map((item) => {
            const isActive = activeItem === item
            
            if (item === 'Reports') {
              return (
                <div key={item} className="flex flex-col mb-1">
                  <div 
                    onClick={() => { setReportsOpen(!reportsOpen); setActiveItem(item) }}
                    className={`flex items-center justify-between px-4 py-2.5 rounded-lg cursor-pointer transition-colors ${isActive && !reportsOpen ? 'bg-[#3b82f6] text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    <span className="text-[15px] font-medium">{item}</span>
                    {reportsOpen ? <ChevronUp className="w-4 h-4 opacity-70" /> : <ChevronDown className="w-4 h-4 opacity-70" />}
                  </div>
                  
                  {reportsOpen && (
                    <div className="flex flex-col mt-1 ml-4 border-l border-gray-100 pl-3">
                      {REPORTS_SUB_ITEMS.map((sub) => (
                        <div 
                          key={sub}
                          className="px-4 py-2 text-[14px] font-medium text-gray-600 hover:text-blue-500 cursor-pointer transition-colors"
                        >
                          {sub}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            }

            return (
              <div
                key={item}
                onClick={() => setActiveItem(item)}
                className={`px-4 py-2.5 rounded-lg cursor-pointer transition-colors mb-1 ${isActive ? 'bg-[#3b82f6] text-white shadow-md shadow-blue-500/20' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <span className="text-[15px] font-medium">{item}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col p-8 overflow-y-auto relative bg-[#f8f9fb]">
        
        {/* Header / Search */}
        <div className="flex items-center mb-8">
          <div className="relative w-full max-w-md">
            <input 
              type="text" 
              placeholder="Search" 
              className="w-full bg-white border border-gray-200 rounded-md py-2.5 px-4 pr-10 text-[14px] focus:outline-none focus:ring-1 focus:ring-blue-500 transition-shadow"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-gray-300 stroke-[2]" />
          </div>
        </div>

        {/* Title & Date Filter */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Overview</h1>
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-md px-3 py-1.5 cursor-pointer shadow-sm">
            <span className="text-[13px] font-medium text-gray-600">Today</span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {METRICS.map((metric, i) => (
            <div key={i} className="bg-white rounded-xl p-5 flex flex-col shadow-sm border border-gray-100">
              <span className="text-[13px] font-semibold text-gray-500 mb-2">{metric.label}</span>
              <div className="flex items-end justify-between mt-auto">
                <span className="text-[26px] font-bold text-gray-800 leading-none">{metric.value}</span>
                <div className={`flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded ${metric.isUp ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'}`}>
                  {metric.change}
                  <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    {metric.isUp ? <path d="m18 15-6-6-6 6"/> : <path d="m6 9 6 6 6-6"/>}
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          
          {/* Statistics Bar Chart */}
          <div className="col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-gray-700">Statistics</h3>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#1d4ed8]"></div>
                  <span className="text-[11px] font-medium text-gray-500">Sales</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#93c5fd]"></div>
                  <span className="text-[11px] font-medium text-gray-500">Returns</span>
                </div>
                <div className="flex items-center gap-1 bg-white border border-gray-200 rounded px-2 py-1 ml-2 cursor-pointer">
                  <span className="text-[10px] font-medium text-gray-500">Past 3 Months</span>
                  <ChevronDown className="w-3 h-3 text-gray-400" />
                </div>
              </div>
            </div>
            
            <div className="h-[240px] w-full relative">
               {/* Y-Axis lines */}
               <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-6">
                   {[60, 45, 30, 15, 0].map(val => (
                       <div key={val} className="flex items-center gap-4 w-full">
                           <span className="text-[9px] text-gray-400 font-medium w-4 text-right">{val === 0 ? '0' : `${val}k`}</span>
                           <div className="flex-1 border-t border-dashed border-gray-200"></div>
                       </div>
                   ))}
               </div>
               
               {/* Bars */}
               <div className="flex-1 flex justify-between px-8 z-10 h-[216px] items-end relative ml-8">
                   {BAR_DATA.map((data, i) => (
                       <div key={i} className="flex items-end gap-1.5 h-full w-full max-w-[36px] justify-center">
                           {/* Sales Bar */}
                           <div className="w-4 bg-[#1d4ed8] rounded-t-sm" style={{ height: `${(data.sales / 60000) * 100}%` }}></div>
                           {/* Returns Bar */}
                           {data.returns > 0 && <div className="w-4 bg-[#93c5fd] rounded-t-sm" style={{ height: `${(data.returns / 60000) * 100}%` }}></div>}
                       </div>
                   ))}
               </div>
            </div>
          </div>

          {/* Sales Breakdown Pie Chart */}
          <div className="col-span-1 bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-700">Sales Breakdown</h3>
              <div className="flex items-center gap-1 bg-white border border-gray-200 rounded px-2 py-1 cursor-pointer">
                <span className="text-[10px] font-medium text-gray-500">Items</span>
                <ChevronDown className="w-3 h-3 text-gray-400" />
              </div>
            </div>
            
            <div className="flex-1 relative flex items-center justify-center">
               <svg width="200" height="200" viewBox="0 0 200 200" className="transform -rotate-90">
                 {/* Item 1 - Darkest Blue */}
                 <circle cx="100" cy="100" r="75" fill="none" stroke="#1e40af" strokeWidth="22" strokeDasharray="140 331" strokeDashoffset="0" strokeLinecap="round" />
                 {/* Item 2 */}
                 <circle cx="100" cy="100" r="75" fill="none" stroke="#1d4ed8" strokeWidth="22" strokeDasharray="90 381" strokeDashoffset="-150" strokeLinecap="round" />
                 {/* Item 3 */}
                 <circle cx="100" cy="100" r="75" fill="none" stroke="#2563eb" strokeWidth="22" strokeDasharray="80 391" strokeDashoffset="-250" strokeLinecap="round" />
                 {/* Item 4 */}
                 <circle cx="100" cy="100" r="75" fill="none" stroke="#3b82f6" strokeWidth="22" strokeDasharray="60 411" strokeDashoffset="-340" strokeLinecap="round" />
                 {/* Item 5 - Lightest Blue */}
                 <circle cx="100" cy="100" r="75" fill="none" stroke="#60a5fa" strokeWidth="22" strokeDasharray="50 421" strokeDashoffset="-410" strokeLinecap="round" />
               </svg>
              
              {/* Custom Legend overlaying the pie */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[140px] h-[140px] relative">
                   <div className="absolute top-[40%] right-[-10px] translate-x-2 -translate-y-1/2 flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#1e40af]"></div>
                      <span className="text-[9px] font-bold text-gray-600">Item 1</span>
                   </div>
                   <div className="absolute bottom-1 right-2 flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#1d4ed8]"></div>
                      <span className="text-[9px] font-bold text-gray-600">Item 2</span>
                   </div>
                   <div className="absolute bottom-5 left-1 flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#2563eb]"></div>
                      <span className="text-[9px] font-bold text-gray-600">Item 3</span>
                   </div>
                   <div className="absolute top-[45%] left-[-10px] -translate-x-3 -translate-y-1/2 flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#3b82f6]"></div>
                      <span className="text-[9px] font-bold text-gray-600">Item 4</span>
                   </div>
                   <div className="absolute top-2 left-6 flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#60a5fa]"></div>
                      <span className="text-[9px] font-bold text-gray-600">Item 5</span>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-3 gap-6">
          
          {/* Audience by Region Map */}
          <div className="col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col">
            <h3 className="font-bold text-gray-700 mb-6">Audience by Region</h3>
            <div className="flex-1 relative flex items-center justify-center rounded-lg p-2">
              
              {/* High Quality World Map SVG embedded */}
              <div className="relative w-full">
                <svg viewBox="0 0 1008 650" className="w-full h-auto fill-[#e0e0e0]">
                  <path d="M49.9 123c-7.9 0-7.9 6.8 0 6.8s7.9-6.8 0-6.8zm63.7 13.6c-7.9 0-7.9 6.8 0 6.8s7.9-6.8 0-6.8zm114 13.5c-7.9 0-7.9 6.8 0 6.8s7.9-6.8 0-6.8zM245 42c-7.9 0-7.9 6.8 0 6.8s7.9-6.8 0-6.8zm151.7 40.7c-7.9 0-7.9 6.8 0 6.8s7.9-6.8 0-6.8zm108.6 60.9c-7.9 0-7.9 6.8 0 6.8s7.9-6.8 0-6.8zm181.7-88.1c-7.9 0-7.9 6.8 0 6.8s7.9-6.8 0-6.8zM874.1 48c-7.9 0-7.9 6.8 0 6.8s7.9-6.8 0-6.8zM196.4 122.9l-5.6-2.6-3.8 4.7 9.4-2.1zm-80.4 20.3-5.2-1.9-4.8 1.9h-10l.7 21 15-2.7 4.3-18.3zm-63.5-9.8-9.4 5.9-4.1 39.5 28.6 15 22.8-5.3-24.3-29.2-13.6-25.9zm-38 31.5-6.6.6-4 6.2h10.6zm81.4 34.6-23.9 6.7.7 7.4 10.4 13.2 27.6 10.7 20 20.1-5.1-40.4-29.7-17.7zM24.7 207l13.5 13.4V234l-31.5-5.9 8.1-13.9 9.9-7.2zm38.1 36.3-9.5-3.4v20.7l23.5-2.9 6-12.8-20-1.6zM89 271l-10-1v10.1l14.9-1.9-4.9-7.2zm-67.4-4.8-11.8 1.9-2.3 22h8.3l5.8-23.9zm314.1-105-18.3-9.1-11 5.9 19.4-6.8v-7h15.4l26.9 14.5 9-6.8 11.2 5.9 13.9.7-18.4 16.5-12.2-12.4-7.4 2-15.5 10.9-13-14.4zM322 173.8l-8.4-1.3-4.5 3.3 9.7 1.2 3.2-3.2zm-22.1 4-13.5 12.3 8.3-4.9-2-5.4 7.2-2zm212.7-33.8-19.1 5.2-19.1 6.5 10.5 4.8-4.2-17.3-6.5-1.9v8.3l-12.5-4.4v9.6l-13.3-1-31.5 8.1 5 19.3-11.6 11-13.4-6-16.1 19.4-13.8 6.4 15.2 2.2 24.3-19.3 5 5 19.4-20 44-7.1 27.5-6 10.1-15.5 13.5-3 2-13.8-24.8-21.5zm-59.3 64.9-10.7-5.9.8 17.5 9.9-11.6zm63.9 111.4 7-23-11-2.9-19-15.2-31 7.1-19 5.8 4 6.8 14 3.9v35.8l21 6.1 7-19.1 23-5.2-6.5.1zM584 154l-5.6 19h10L584 154zm232.7-83.3-13.9 2-8 5.8 17 2 4.9-9.8zm57.2 46.5 6.3 3.9-4.8 5.4-1.5-9.3zm-147 62-24.7-9.5-31.5-19.3-14.5-23-44.1 6-27.4 17 6.4 33-14 30-10 16v17h-14l6 22h-11l3.5 13 42.5 17 48-18 8-22 35-18 25-10.5 22-9 14.5-9.5-20-41.2zm85 90.3-8 5.5v12.5l30-9-5.3-7.5-16.7-1.5zm31.3 27-26 2-12 11 25.5-2 15-5.5-2.5-5.5zm19.8-3.5h-10l-12 8.5 26.5 1.5-4.5-10zm25-1h-10l-6.5 9 19.5 2-3-11zm-60.5-51-16 1.5.5 10 20.5-6.5-5-5zm65.5-5-29.5 11.5v6.5l35-6.5-5.5-11.5zm25 15-18 8 20 2-2-10zm-35-14.5-14.5.5 6 9.5 10-6-1.5-4zm50 14h-13l3.5 8 13.5-3-4-5zm34 69.5-18 4.5v12.5l24.5-7.5-6.5-9.5z"/>
                </svg>

                {/* Map Dots using relative percentages over the standard viewbox */}
                <div className="absolute top-[35%] left-[20%] w-2 h-2 bg-[#3b82f6] rounded-full border border-white shadow"></div>
                <div className="absolute top-[28%] left-[45%] w-2 h-2 bg-[#3b82f6] rounded-full border border-white shadow"></div>
                <div className="absolute top-[65%] left-[30%] w-2 h-2 bg-[#3b82f6] rounded-full border border-white shadow"></div>
                <div className="absolute top-[45%] left-[62%] w-2 h-2 bg-[#3b82f6] rounded-full border border-white shadow"></div>
                <div className="absolute top-[82%] left-[80%] w-2 h-2 bg-[#3b82f6] rounded-full border border-white shadow"></div>

                {/* Active Tooltip Map */}
                <div className="absolute top-[12%] left-[32%] bg-[#3b82f6] text-white text-[9px] font-medium py-1.5 px-2.5 rounded shadow-lg before:content-[''] before:absolute before:top-full before:left-[45%] before:-translate-x-1/2 before:border-4 before:border-transparent before:border-t-[#3b82f6]">
                  <div>Impressions: 2000</div>
                  <div>Clicks: 1000</div>
                  <div>Orders: 100</div>
                </div>
              </div>
              
            </div>
          </div>

          {/* Upcoming Orders */}
          <div className="col-span-1 bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-700">Upcoming Orders</h3>
              <span className="text-[10px] text-gray-400 font-medium cursor-pointer hover:text-gray-600">View More</span>
            </div>
            
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-[#3b82f6] text-white text-[10px] font-medium px-4 py-1.5 rounded-full cursor-pointer">Urgent</div>
              <div className="border border-[#3b82f6] text-[#3b82f6] text-[10px] font-medium px-4 py-1.5 rounded-full cursor-pointer">Normal</div>
              <div className="border border-[#3b82f6] text-[#3b82f6] text-[10px] font-medium px-4 py-1.5 rounded-full cursor-pointer">Dispatched</div>
              <div className="border border-[#3b82f6] text-[#3b82f6] text-[10px] font-medium px-4 py-1.5 rounded-full cursor-pointer">Returns</div>
            </div>

            <div className="flex flex-col gap-5 flex-1 overflow-y-auto pr-1">
              {UPCOMING_ORDERS.map((order, i) => (
                <div key={i} className="flex flex-col">
                  <div className="text-[11px] font-bold text-[#3b82f6] mb-0.5">{order.date}</div>
                  <div className="flex justify-between items-start mb-1.5">
                    <span className="text-[11px] font-medium text-gray-500">Order #{order.id}</span>
                    <span className="text-[10px] text-gray-400 font-medium">{order.time}</span>
                  </div>
                  
                  {order.items.map((item, j) => (
                    <div key={j} className="flex justify-between items-center text-[11px] text-gray-500 mb-0.5 ml-1">
                      <span className="flex items-center gap-1.5 before:content-[''] before:w-1 before:h-1 before:bg-gray-400 before:rounded-full">
                        {item.name}
                      </span>
                      <span>{item.qty}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}
