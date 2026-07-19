"use client"

import React, { useState, useMemo } from 'react'
import { Search, Bell, MessageSquare, Edit3, Grid, Briefcase, UserCheck, Inbox, HelpCircle, Settings, LogOut, ChevronDown, Check, X, MapPin, Calendar, Users, Plane, Plus, Minus, CloudRain, Sun, Cloud, Moon } from 'lucide-react'

// Simple deterministic pseudo-random generator
const pseudoRandom = (seed: number) => {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
};

export default function AirlineDashboard() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  
  // Search Form State
  const [fromCity, setFromCity] = useState('New York')
  const [toCity, setToCity] = useState('Chicago')
  const [travelDate, setTravelDate] = useState('13 Dec 2023')
  const [passengerQty, setPassengerQty] = useState(1)

  // Booking Modal State
  const [selectedFlight, setSelectedFlight] = useState<any>(null)
  const [showBookingModal, setShowBookingModal] = useState(false)

  // Mock flight results
  const flightResults = [
    {
      id: 1,
      airline: 'Delta Airlines',
      logo: 'delta',
      from: 'NYC',
      to: 'CHS',
      depTime: '22:30',
      arrTime: '23:45',
      duration: '1H - 15M',
      stops: 'Non-Stop',
      price: 300,
    },
    {
      id: 2,
      airline: 'United Airlines',
      logo: 'united',
      from: 'NYC',
      to: 'CHS',
      depTime: '22:30',
      arrTime: '23:45',
      duration: '1H - 15M',
      stops: 'Non-Stop',
      price: 300,
    },
    {
      id: 3,
      airline: 'Spirit Airlines',
      logo: 'spirit',
      from: 'NYC',
      to: 'CHS',
      depTime: '22:30',
      arrTime: '23:45',
      duration: '1H - 15M',
      stops: 'Non-Stop',
      price: 300,
    },
    {
      id: 4,
      airline: 'Hawaiian Airlines',
      logo: 'hawaiian',
      from: 'NYC',
      to: 'CHS',
      depTime: '22:30',
      arrTime: '23:45',
      duration: '1H - 15M',
      stops: 'Non-Stop',
      price: 300,
    }
  ]

  const filteredFlights = useMemo(() => {
    return flightResults.filter(flight => {
      // Allow searching by airline name or codes
      if (searchQuery && !flight.airline.toLowerCase().includes(searchQuery.toLowerCase()) && !flight.from.toLowerCase().includes(searchQuery.toLowerCase()) && !flight.to.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false
      }
      return true
    })
  }, [searchQuery])

  const handleBookFlight = (flight: any) => {
    setSelectedFlight(flight)
    setShowBookingModal(true)
  }

  return (
    <div className={`flex h-screen overflow-hidden font-sans transition-colors duration-300 ${isDarkMode ? 'bg-[#0f172a] text-[#f8fafc]' : 'bg-[#f7f8fa] text-[#1e293b]'}`}>
      
      {/* LEFT SIDEBAR */}
      <aside className={`w-64 flex flex-col h-full flex-shrink-0 relative z-20 transition-colors duration-300 ${isDarkMode ? 'bg-[#0b1329] border-r border-[#1e293b]' : 'bg-[#0a3a6b]'}`}>
        {/* Logo */}
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-xl">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 16V14L13 9V3.5C13 2.67 12.33 2 11.5 2C10.67 2 10 2.67 10 3.5V9L2 14V16L10 13.5V19L8 20.5V22L11.5 21L15 22V20.5L13 19V13.5L21 16Z" fill="white"/>
            </svg>
          </div>
          <span className="text-xl font-bold tracking-wide text-white">Airlines</span>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 mt-4">
          <ul className="space-y-1 px-3">
            <li>
              <a href="#" className={`flex items-center gap-4 px-4 py-3 rounded-lg font-medium transition-colors ${isDarkMode ? 'bg-[#1e293b] text-white' : 'bg-[#091b31] text-white'}`}>
                <Grid className="w-5 h-5 text-blue-400" />
                Dashboard
              </a>
            </li>
            {['Flights Details', 'Feedback', 'Fairs', 'Baggage Details', 'AI Assistance'].map((item, idx) => {
              const icons = [Plane, UserCheck, Inbox, Briefcase, MessageSquare]
              const Icon = icons[idx]
              return (
                <li key={idx}>
                  <a href="#" className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-white/5 text-gray-300 hover:text-white font-medium transition-colors text-sm">
                    <Icon className="w-5 h-5 opacity-70" />
                    {item}
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Support, Settings, Logout */}
        <div className="p-4 px-7 pb-8 space-y-6">
          <a href="#" className="flex items-center gap-4 text-gray-300 hover:text-white transition-colors text-sm font-medium">
            <HelpCircle className="w-5 h-5 opacity-70" />
            Support
          </a>
          <a href="#" className="flex items-center gap-4 text-gray-300 hover:text-white transition-colors text-sm font-medium">
            <Settings className="w-5 h-5 opacity-70" />
            Settings
          </a>
          <a href="#" className="flex items-center gap-4 text-gray-300 hover:text-white transition-colors text-sm font-medium">
            <LogOut className="w-5 h-5 opacity-70" />
            Logout
          </a>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* Header */}
        <header className={`h-20 flex items-center justify-between px-8 py-4 flex-shrink-0 transition-colors duration-300 ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f7f8fa]'}`}>
          <div className="flex items-center gap-2">
            <span className="text-2xl">👋</span>
            <h1 className="text-lg font-bold">Hello! Mr. Naved Ansari</h1>
          </div>
          
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Flight number" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 border-none rounded-xl text-xs focus:outline-none focus:ring-1 ${isDarkMode ? 'bg-[#1e293b] text-white focus:ring-blue-500' : 'bg-white text-gray-800 shadow-sm focus:ring-blue-500'}`}
            />
          </div>
        </header>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-8 pb-8 flex flex-col xl:flex-row gap-6">
          
          {/* Middle Column (Form, Stats, Results) */}
          <div className="flex-1 flex flex-col gap-6">
            
            {/* 4 Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Flights Booked */}
              <div className={`p-5 rounded-2xl border flex items-center justify-between transition-colors duration-300 ${isDarkMode ? 'bg-[#1e293b] border-gray-800' : 'bg-white border-gray-100 shadow-sm'}`}>
                <div>
                  <h3 className="text-3xl font-extrabold mb-1">45</h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Flights Booked</p>
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isDarkMode ? 'bg-blue-900/30' : 'bg-blue-50'}`}>
                  <svg className={`w-6 h-6 ${isDarkMode ? 'text-blue-400' : 'text-[#0a3a6b]'}`} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2zm-7 5h5v5h-5z"/>
                  </svg>
                </div>
              </div>

              {/* Flights Done */}
              <div className={`p-5 rounded-2xl border flex items-center justify-between transition-colors duration-300 ${isDarkMode ? 'bg-[#1e293b] border-gray-800' : 'bg-white border-gray-100 shadow-sm'}`}>
                <div>
                  <h3 className="text-3xl font-extrabold mb-1">33</h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Flights Done</p>
                </div>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center">
                  <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>

              {/* Flights Cancelled */}
              <div className={`p-5 rounded-2xl border flex items-center justify-between transition-colors duration-300 ${isDarkMode ? 'bg-[#1e293b] border-gray-800' : 'bg-white border-gray-100 shadow-sm'}`}>
                <div>
                  <h3 className="text-3xl font-extrabold mb-1">12</h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Flights Cancelled</p>
                </div>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center">
                  <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              </div>

              {/* Total Spends */}
              <div className={`p-5 rounded-2xl border flex items-center justify-between transition-colors duration-300 ${isDarkMode ? 'bg-[#1e293b] border-gray-800' : 'bg-white border-gray-100 shadow-sm'}`}>
                <div>
                  <h3 className="text-3xl font-extrabold mb-1">13,105</h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total Spends</p>
                </div>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center">
                  <span className="text-3xl font-bold text-yellow-500">$</span>
                </div>
              </div>
            </div>

            {/* Middle widgets row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Book a Flight Form */}
              <div className={`lg:col-span-2 rounded-2xl border p-6 flex flex-col md:flex-row relative overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-[#1e293b] border-gray-800' : 'bg-white border-gray-100 shadow-sm'}`}>
                {/* Dotted grid pattern overlay */}
                <div className="absolute inset-0 pointer-events-none opacity-5 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]"></div>
                
                {/* Left Flight Graphic info */}
                <div className="flex-1 flex flex-col justify-between relative z-10 w-full md:w-1/2 mb-6 md:mb-0">
                  <div>
                    <p className="text-blue-500 font-bold text-xs uppercase tracking-wide mb-1">Planning a journey?</p>
                    <h2 className={`text-3xl font-black ${isDarkMode ? 'text-white' : 'text-[#0a3a6b]'}`}>Book a Flight</h2>
                  </div>
                  
                  {/* Decorative Plane Illustration */}
                  <div className="relative flex-1 min-h-[140px] flex items-center justify-center">
                    <svg className="w-40 h-40 text-blue-500/20 absolute rotate-[15deg]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21 16V14L13 9V3.5C13 2.67 12.33 2 11.5 2C10.67 2 10 2.67 10 3.5V9L2 14V16L10 13.5V19L8 20.5V22L11.5 21L15 22V20.5L13 19V13.5L21 16Z" fill="currentColor"/>
                    </svg>
                  </div>
                </div>

                {/* Right Input Form */}
                <div className="w-full md:w-1/2 flex flex-col gap-4 relative z-10 pl-0 md:pl-6 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-400 mb-1 block">From</label>
                    <div className={`flex items-center gap-2 rounded-xl p-2 px-3 border ${isDarkMode ? 'bg-[#0f172a] border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
                      <Plane className="w-4 h-4 text-gray-400 rotate-45" />
                      <input 
                        type="text" 
                        value={fromCity} 
                        onChange={(e) => setFromCity(e.target.value)}
                        className="bg-transparent border-none text-xs font-semibold w-full focus:outline-none" 
                      />
                      <span className="text-xs text-gray-400 font-bold">NYC</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-400 mb-1 block">To</label>
                    <div className={`flex items-center gap-2 rounded-xl p-2 px-3 border ${isDarkMode ? 'bg-[#0f172a] border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
                      <Plane className="w-4 h-4 text-gray-400 rotate-[135deg]" />
                      <input 
                        type="text" 
                        value={toCity} 
                        onChange={(e) => setToCity(e.target.value)}
                        className="bg-transparent border-none text-xs font-semibold w-full focus:outline-none" 
                      />
                      <span className="text-xs text-gray-400 font-bold">CHS</span>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="text-[10px] uppercase font-bold text-gray-400 mb-1 block">Date</label>
                      <div className={`flex items-center gap-2 rounded-xl p-2 px-3 border ${isDarkMode ? 'bg-[#0f172a] border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <input 
                          type="text" 
                          value={travelDate} 
                          onChange={(e) => setTravelDate(e.target.value)}
                          className="bg-transparent border-none text-xs font-semibold w-full focus:outline-none" 
                        />
                      </div>
                    </div>
                    <div className="w-[110px] shrink-0">
                      <label className="text-[10px] uppercase font-bold text-gray-400 mb-1 block">Passenger</label>
                      <div className={`flex items-center justify-between rounded-xl p-2 px-2.5 border ${isDarkMode ? 'bg-[#0f172a] border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
                        <button 
                          onClick={() => setPassengerQty(p => Math.max(1, p - 1))}
                          className="w-4 h-4 flex items-center justify-center bg-white dark:bg-gray-800 rounded border shadow-sm"
                        >
                          <Minus className="w-2.5 h-2.5" />
                        </button>
                        <span className="text-xs font-bold px-1">{passengerQty.toString().padStart(2, '0')}</span>
                        <button 
                          onClick={() => setPassengerQty(p => p + 1)}
                          className="w-4 h-4 flex items-center justify-center bg-white dark:bg-gray-800 rounded border shadow-sm"
                        >
                          <Plus className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <button className="mt-2 w-full py-2.5 bg-[#0a3a6b] hover:bg-[#134e8c] text-white rounded-xl text-xs font-bold transition-colors">
                    Search
                  </button>
                </div>
              </div>

              {/* Weather Widget */}
              <div className={`col-span-1 rounded-2xl border p-5 flex flex-col justify-between transition-colors duration-300 ${isDarkMode ? 'bg-[#1e293b] border-gray-800' : 'bg-white border-gray-100 shadow-sm'}`}>
                <div className="flex items-start justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
                  <div className="flex items-center gap-4">
                     <div className="text-center">
                        <p className="text-xs text-gray-400 font-bold uppercase leading-none">Dec</p>
                        <p className="text-xl font-bold mt-1 leading-none">13</p>
                     </div>
                     <div className="pl-4 border-l border-gray-200 dark:border-gray-800">
                        <p className="text-[10px] text-gray-400 font-bold uppercase">Weather Report</p>
                        <h3 className="text-md font-bold text-gray-800 dark:text-white">Chicago</h3>
                     </div>
                  </div>
                </div>

                <div className="py-3 border-b border-gray-100 dark:border-gray-800">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm">Wednesday</span>
                    <span className="text-[9px] font-bold bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> No Risk
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-7 bg-blue-100 dark:bg-blue-900/30 rounded-full relative">
                        <div className="absolute bottom-0 w-full h-1/2 bg-blue-500 rounded-full"></div>
                      </div>
                      <span className="text-3xl font-light">16<sup className="text-lg">°</sup></span>
                    </div>
                    <Cloud className="w-10 h-10 text-gray-400 fill-gray-200 dark:fill-gray-700" />
                  </div>
                </div>

                <div className="pt-3 flex flex-col gap-2.5">
                  <div className="flex items-center justify-between">
                     <div>
                       <p className="text-xs font-bold">Dec 14</p>
                       <span className="text-[9px] font-bold text-red-500 flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-red-500"></span> High Risk</span>
                     </div>
                     <CloudRain className="w-5 h-5 text-blue-400" />
                     <span className="text-lg font-bold">12<sup className="text-xs">°</sup></span>
                  </div>
                  <div className="flex items-center justify-between">
                     <div>
                       <p className="text-xs font-bold">Dec 14</p>
                       <span className="text-[9px] font-bold text-yellow-600 flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-yellow-500"></span> Low Risk</span>
                     </div>
                     <Sun className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                     <span className="text-lg font-bold">39<sup className="text-xs">°</sup></span>
                  </div>
                </div>
              </div>
            </div>

            {/* Results Row */}
            <div>
              <h3 className="text-md font-bold mb-4">{filteredFlights.length} Results</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {filteredFlights.map((flight) => (
                  <div key={flight.id} className={`p-4 rounded-xl border flex items-center justify-between transition-colors duration-300 ${isDarkMode ? 'bg-[#1e293b] border-gray-800' : 'bg-white border-gray-100 shadow-sm'}`}>
                    
                    {/* Airline Logo */}
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0 border border-gray-100 dark:border-gray-850 bg-white dark:bg-slate-800 overflow-hidden p-1 shadow-sm">
                      {flight.logo === 'delta' && (
                        <svg className="w-8 h-8 text-[#c8102e]" viewBox="0 0 24 24" fill="currentColor">
                          <polygon points="12,2 2,22 12,17 22,22" />
                        </svg>
                      )}
                      {flight.logo === 'united' && (
                        <div className="w-8 h-8 rounded-full bg-[#1d70b8] flex items-center justify-center text-white relative">
                          <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                            <path d="M2 12h20" />
                          </svg>
                        </div>
                      )}
                      {flight.logo === 'spirit' && (
                        <div className="bg-[#ffe600] w-full h-full rounded-lg flex items-center justify-center text-[10px] font-black italic tracking-tighter text-black uppercase">
                          spirit
                        </div>
                      )}
                      {flight.logo === 'hawaiian' && (
                        <div className="w-9 h-9 rounded-full bg-[#5c0632] flex items-center justify-center overflow-hidden relative">
                          {/* Polynesian Flower / Woman side profile outline mock */}
                          <div className="absolute w-2 h-2 bg-[#ff5c5c] rounded-full top-2 right-1.5"></div>
                          <div className="w-5 h-5 text-white border-2 border-white rounded-full flex items-center justify-center font-bold text-[7px]">HI</div>
                        </div>
                      )}
                    </div>

                    {/* Flight Detail Path */}
                    <div className="flex-1 px-4 flex justify-between items-center">
                      <div className="text-center">
                        <p className="text-sm font-bold">{flight.from}</p>
                        <p className="text-[10px] text-blue-500 font-bold">{flight.depTime}</p>
                      </div>
                      
                      <div className="flex flex-col items-center flex-1 px-3">
                         <span className="text-[8px] text-gray-400 font-bold leading-none mb-1">{flight.airline}</span>
                         <div className="w-full h-px bg-gray-200 dark:bg-gray-800 relative mb-1 flex justify-center items-center">
                           <span className="absolute -top-1.5 bg-white dark:bg-[#1e293b] px-1 text-[8px] font-bold text-gray-400">{flight.duration}</span>
                           <Plane className="w-2.5 h-2.5 text-blue-500 rotate-90 absolute bg-white dark:bg-[#1e293b] px-0.5" />
                         </div>
                         <span className="text-[8px] font-bold text-gray-400 leading-none">{flight.stops}</span>
                      </div>
                      
                      <div className="text-center">
                        <p className="text-sm font-bold">{flight.to}</p>
                        <p className="text-[10px] text-blue-500 font-bold">{flight.arrTime}</p>
                      </div>
                    </div>

                    {/* Pricing & Booking */}
                    <div className="flex flex-col items-end gap-2 border-l border-gray-100 dark:border-gray-800 pl-4 shrink-0">
                      <span className="text-md font-black">${flight.price}</span>
                      <button 
                        onClick={() => handleBookFlight(flight)}
                        className="px-3.5 py-1.5 bg-[#0a3a6b] text-white rounded-full text-[10px] font-bold hover:bg-blue-900 transition-colors"
                      >
                        Book Now
                      </button>
                    </div>

                  </div>
                ))}
                
              </div>
            </div>

          </div>

          {/* Right Sidebar (Passenger Info) */}
          <div className={`w-full xl:w-80 rounded-2xl border p-6 flex flex-col justify-between transition-colors duration-300 ${isDarkMode ? 'bg-[#1e293b] border-gray-800' : 'bg-white border-gray-100 shadow-sm'}`}>
            <div>
              {/* Header icons */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-sm">Passenger Info</h3>
                <div className="flex gap-2">
                  <button className={`w-8 h-8 flex items-center justify-center rounded-full ${isDarkMode ? 'bg-[#0f172a] text-gray-400' : 'bg-gray-100 text-gray-600'}`}><MessageSquare className="w-4 h-4" /></button>
                  <button className={`w-8 h-8 flex items-center justify-center rounded-full ${isDarkMode ? 'bg-[#0f172a] text-gray-400' : 'bg-gray-100 text-gray-600'}`}><Bell className="w-4 h-4" /></button>
                </div>
              </div>

              {/* Profile Details */}
              <div className="flex flex-col items-center mb-6">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 mb-3 border-2 border-white dark:border-gray-800 shadow-md">
                   <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80" alt="Naved Ansari" className="w-full h-full object-cover" />
                </div>
                <div className="flex items-center gap-1.5">
                   <h2 className="text-base font-bold">Naved Ansari</h2>
                   <button className="text-gray-400 hover:text-gray-600"><Edit3 className="w-3.5 h-3.5" /></button>
                </div>
                <p className="text-xs text-gray-400 font-bold">+91 982 602 9995</p>
                
                {/* Light/Dark Toggle capsules */}
                <div className={`mt-4 rounded-full flex items-center p-1 w-24 border ${isDarkMode ? 'bg-[#0f172a] border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
                  <button 
                    onClick={() => setIsDarkMode(false)}
                    className={`flex-1 text-[9px] font-bold py-1 rounded-full transition-all ${!isDarkMode ? 'bg-[#0a3a6b] text-white shadow-sm' : 'text-gray-400'}`}
                  >
                    Light
                  </button>
                  <button 
                    onClick={() => setIsDarkMode(true)}
                    className={`flex-1 text-[9px] font-bold py-1 rounded-full transition-all ${isDarkMode ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-400'}`}
                  >
                    Dark
                  </button>
                </div>
              </div>

              {/* Passenger Metadata List */}
              <div className="space-y-4 pt-2">
                <div className="flex justify-between items-center text-xs border-b border-gray-50 dark:border-gray-800 pb-2">
                  <span className="text-gray-400 font-bold uppercase tracking-wide">Location</span>
                  <span className="font-bold">New York</span>
                </div>
                <div className="flex justify-between items-center text-xs border-b border-gray-50 dark:border-gray-800 pb-2">
                  <span className="text-gray-400 font-bold uppercase tracking-wide">Email</span>
                  <span className="font-bold">navedansari@gmail.com</span>
                </div>
                <div className="flex justify-between items-center text-xs border-b border-gray-50 dark:border-gray-800 pb-2">
                  <span className="text-gray-400 font-bold uppercase tracking-wide">D.O.B</span>
                  <span className="font-bold">Jan 1, 1980</span>
                </div>
              </div>
            </div>

            {/* Recent Activity List */}
            <div className="mt-8 border-t border-gray-50 dark:border-gray-800 pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-sm">Recent Activity</h3>
                <a href="#" className="text-[10px] text-blue-500 font-bold hover:underline">View All</a>
              </div>

              <div className={`flex gap-1.5 p-1 rounded-lg mb-4 ${isDarkMode ? 'bg-[#0f172a]' : 'bg-gray-50'}`}>
                <button className="flex-1 bg-[#0a3a6b] text-white rounded-md py-1.5 text-[10px] font-bold shadow-sm">Upcoming Flights</button>
                <button className="flex-1 text-gray-500 rounded-md py-1.5 text-[10px] font-bold hover:bg-gray-200/50">Past Flights</button>
              </div>

              <div className="space-y-4">
                {/* Flight item 1 */}
                <div className={`rounded-xl p-3 border ${isDarkMode ? 'bg-[#0f172a] border-gray-800' : 'bg-gray-50 border-gray-100'}`}>
                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-2">Wed 13 Dec, 2023</p>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-bold leading-tight">NYC</p>
                      <p className="text-[10px] text-blue-500 font-bold">22:30</p>
                    </div>
                    <div className="flex-1 flex justify-center items-center px-2">
                      <span className="text-gray-300 dark:text-gray-700">---</span>
                      <Plane className="w-3.5 h-3.5 text-gray-400 mx-1 rotate-45" />
                      <span className="text-gray-300 dark:text-gray-700">---</span>
                    </div>
                    <div className="text-right">
                      <p className="font-bold leading-tight">CHS</p>
                      <p className="text-[10px] text-blue-500 font-bold">23:45</p>
                    </div>
                  </div>
                </div>

                {/* Flight item 2 */}
                <div className={`rounded-xl p-3 border ${isDarkMode ? 'bg-[#0f172a] border-gray-800' : 'bg-gray-50 border-gray-100'}`}>
                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-2">Fri 15 Dec, 2023</p>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-bold leading-tight">CHS</p>
                      <p className="text-[10px] text-blue-500 font-bold">08:30</p>
                    </div>
                    <div className="flex-1 flex justify-center items-center px-2">
                      <span className="text-gray-300 dark:text-gray-700">---</span>
                      <Plane className="w-3.5 h-3.5 text-gray-400 mx-1 rotate-45" />
                      <span className="text-gray-300 dark:text-gray-700">---</span>
                    </div>
                    <div className="text-right">
                      <p className="font-bold leading-tight">NYC</p>
                      <p className="text-[10px] text-blue-500 font-bold">11:45</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </main>

      {/* Booking Success Modal */}
      {showBookingModal && selectedFlight && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className={`rounded-2xl p-6 max-w-sm w-full border shadow-xl relative ${isDarkMode ? 'bg-[#1e293b] border-gray-850 text-white' : 'bg-white border-gray-100 text-gray-800'}`}>
            <button 
              onClick={() => setShowBookingModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="text-center mb-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-950/30 rounded-full flex items-center justify-center mx-auto mb-2 text-green-600">
                <Check className="w-6 h-6 stroke-[3]" />
              </div>
              <h3 className="font-bold text-base">Booking Confirmed!</h3>
              <p className="text-[11px] text-gray-400">Your ticket is locked and confirmed.</p>
            </div>
            
            <div className={`rounded-xl p-4 mb-4 border text-xs space-y-2 ${isDarkMode ? 'bg-[#0f172a] border-gray-800' : 'bg-gray-50 border-gray-150'}`}>
              <div className="flex justify-between">
                <span className="text-gray-400">Flight:</span>
                <span className="font-bold">{selectedFlight.airline}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Route:</span>
                <span className="font-bold">{selectedFlight.from} &rarr; {selectedFlight.to}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Departure:</span>
                <span className="font-bold">{selectedFlight.depTime} ({travelDate})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Passengers:</span>
                <span className="font-bold">{passengerQty}</span>
              </div>
              <div className="flex justify-between border-t pt-2 border-gray-200 dark:border-gray-800">
                <span className="text-gray-400 font-bold">Total Paid:</span>
                <span className="font-bold text-[#0a3a6b] dark:text-blue-400 text-sm">${selectedFlight.price * passengerQty}</span>
              </div>
            </div>

            <button 
              onClick={() => setShowBookingModal(false)}
              className="w-full bg-[#0a3a6b] hover:bg-[#134e8c] text-white py-2 rounded-xl text-xs font-bold transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}

    </div>
  )
}
