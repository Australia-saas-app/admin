"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Search,
  ChevronDown,
  Calendar,
  User,
  ArrowRightLeft,
  Star,
  MapPin,
  Train,
  Bus,
  Car,
  Plane,
  Navigation,
  Shield,
  HeartPulse,
  CreditCard,
  Gift,
  PhoneCall,
  RefreshCw,
} from "lucide-react";
import { PublicPageShell } from "@/src/modules/shared/components/public/PublicPageShell";
import { PublicContactModal } from "@/src/modules/shared/components/public/PublicContactModal";

export default function TransportPage() {
  const [limit, setLimit] = useState(12);
  const [isLimitDropdownOpen, setIsLimitDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Flight");

  // Booking widget states
  const [flightType, setFlightType] = useState("Round trip");
  const [busType, setBusType] = useState("One Way");
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingSubject, setBookingSubject] = useState("Transport booking request");

  const openBooking = (subject: string) => {
    setBookingSubject(subject);
    setBookingOpen(true);
  };

  const topTabs = [
    { label: "Flight", icon: Plane },
    { label: "Hotel", icon: Navigation },
    { label: "Ship", icon: CompassIcon },
    { label: "Holiday", icon: Gift },
    { label: "Visa", icon: Shield },
    { label: "Medical", icon: HeartPulse },
    { label: "Cars", icon: Car },
    { label: "Recharge", icon: RefreshCw },
  ];

  function CompassIcon(props: any) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
      </svg>
    );
  }

  return (
    <PublicPageShell
      title="Transport"
      subtitle="Compare flights, buses, trains, and local transfers. Submit a booking request and our team will confirm availability."
      badge="Travel"
    >
      <div className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          {/* Flight Search Widget */}
          <div className="bg-card rounded-xl shadow-sm border border-border p-5 flex flex-col justify-between">
            <div>
              {/* Icon Tabs Bar */}
              <div className="flex gap-4 overflow-x-auto pb-3 mb-4 border-b border-border scrollbar-none">
                {topTabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.label;
                  return (
                    <button
                      key={tab.label}
                      type="button"
                      onClick={() => setActiveTab(tab.label)}
                      className="flex flex-col items-center gap-1 min-w-[50px] cursor-pointer"
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${isActive ? "bg-blue-100 text-blue-600" : "bg-muted/40 text-muted-foreground/70 hover:bg-muted/60"}`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span
                        className={`text-[9px] font-bold ${isActive ? "text-blue-600" : "text-muted-foreground/70"}`}
                      >
                        {tab.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-4 mb-4 text-xs font-semibold text-muted-foreground">
                {["One Way", "Round trip", "Multi City"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setFlightType(t)}
                    className={`pb-2 relative ${flightType === t ? "text-[#1e3a8a] border-b-2 border-[#1e3a8a]" : "hover:text-foreground/80"}`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-muted-foreground/70 mb-1">
                    From
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      defaultValue="Toronto (YYZ)"
                      className="w-full text-xs font-semibold text-foreground/80 border border-border rounded px-3 py-2 bg-muted/40"
                    />
                    <MapPin className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/70" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-muted-foreground/70 mb-1">
                    To
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      defaultValue="New York (JFK)"
                      className="w-full text-xs font-semibold text-foreground/80 border border-border rounded px-3 py-2 bg-muted/40"
                    />
                    <MapPin className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/70" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-muted-foreground/70 mb-1">
                    Departure
                  </label>
                  <input
                    type="text"
                    defaultValue="18 July"
                    className="w-full text-xs font-semibold text-foreground/80 border border-border rounded px-2 py-2 bg-muted/40 text-center"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-muted-foreground/70 mb-1">
                    Return
                  </label>
                  <input
                    type="text"
                    defaultValue="23 July"
                    className="w-full text-xs font-semibold text-foreground/80 border border-border rounded px-2 py-2 bg-muted/40 text-center"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-muted-foreground/70 mb-1">
                    Travellers
                  </label>
                  <input
                    type="text"
                    defaultValue="1 Traveller, Economy"
                    className="w-full text-xs font-semibold text-foreground/80 border border-border rounded px-2 py-2 bg-muted/40 text-center text-ellipsis overflow-hidden whitespace-nowrap"
                  />
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => openBooking(`Flight search: ${flightType}`)}
              className="w-full bg-[#10b981] hover:bg-[#059669] text-white font-bold py-2.5 rounded text-xs transition-colors shadow-sm mt-2"
            >
              Search Flights
            </button>
          </div>

          {/* Bus Search Widget */}
          <div className="bg-card rounded-xl shadow-sm border border-border p-5 flex flex-col justify-between">
            <div>
              <div className="flex gap-4 border-b border-border pb-3 mb-4 text-xs font-semibold text-muted-foreground">
                {["One Way", "Round Way"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setBusType(t)}
                    className={`pb-2 relative ${busType === t ? "text-[#1e3a8a] border-b-2 border-[#1e3a8a]" : "hover:text-foreground/80"}`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1">
                  <label className="block text-[10px] uppercase font-bold text-muted-foreground/70 mb-1">
                    From
                  </label>
                  <input
                    type="text"
                    placeholder="From"
                    className="w-full text-xs font-semibold text-foreground/80 border border-border rounded px-3 py-2 bg-muted/40"
                  />
                </div>
                <ArrowRightLeft className="w-4 h-4 text-muted-foreground/70 mt-5 cursor-pointer hover:text-muted-foreground shrink-0" />
                <div className="flex-1">
                  <label className="block text-[10px] uppercase font-bold text-muted-foreground/70 mb-1">
                    To
                  </label>
                  <input
                    type="text"
                    placeholder="To"
                    className="w-full text-xs font-semibold text-foreground/80 border border-border rounded px-3 py-2 bg-muted/40"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-muted-foreground/70 mb-1">
                    Journey Date
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Pick a date"
                      className="w-full text-xs font-semibold text-foreground/80 border border-border rounded px-3 py-2 bg-muted/40"
                    />
                    <Calendar className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/70" />
                  </div>
                </div>
                <div className="flex items-end">
                  <button className="w-full border border-dashed border-border hover:border-gray-400 text-muted-foreground font-medium py-2 rounded text-xs transition-colors flex items-center justify-center gap-1.5 h-[34px]">
                    + ADD RETURN TRIP
                  </button>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => openBooking(`Bus search: ${busType}`)}
              className="w-full bg-[#10b981] hover:bg-[#059669] text-white font-bold py-2.5 rounded text-xs transition-colors shadow-sm mt-2"
            >
              SEARCH
            </button>
          </div>
        </div>

        {/* Listings Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Left Column Listings (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* TBS to Jitra Bus Card */}
            <div className="bg-card rounded-xl border border-border p-5 shadow-sm relative card-lift">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-primary text-sm leading-tight">
                    TBS (Terminal Bersepadu Selatan)
                  </h3>
                  <span className="text-[10px] text-muted-foreground/70 font-semibold">
                    Kuala Lumpur
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-green-600 block">Refundable</span>
                </div>
              </div>

              <div className="text-[10px] text-muted-foreground space-y-1 mb-4 font-semibold">
                <div>Arrival at: Jitra (Kedah)</div>
                <div className="text-muted-foreground/70">30 Seats Remaining</div>
              </div>

              <div className="flex justify-between items-center border-t border-gray-50 pt-4">
                <div className="flex items-center gap-0.5 text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-current" />
                  ))}
                  <span className="text-muted-foreground/70 text-[10px] ml-1.5">
                    (48 Reviews) | Details
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-muted-foreground/70 line-through text-[9px] block">
                      USD 17.74
                    </span>
                    <span className="text-primary font-bold text-sm block">USD 13.31</span>
                    <span className="text-[9px] text-muted-foreground/70 block">
                      Child: USD 11.23
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => openBooking("Book train: TBS to Gemas")}
                    className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs py-2.5 px-6 rounded shadow-sm"
                  >
                    Select
                  </button>
                </div>
              </div>
            </div>

            {/* Mochit Bangkok to Chiang Mai Bus Card (with image) */}
            <div className="bg-card rounded-xl border border-border p-5 shadow-sm relative card-lift">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <span className="font-bold text-foreground text-sm block">Mochit, Bangkok</span>
                  <span className="text-[10px] text-muted-foreground/70 font-medium">
                    19:00 Departure | 10h 25m
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-green-600 block">
                    €0.66 OFF today
                  </span>
                </div>
              </div>

              <div className="flex gap-4 mb-4 items-start">
                <div className="w-[100px] h-[70px] bg-muted rounded-md overflow-hidden shrink-0 border border-border">
                  <img
                    src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=150&q=80"
                    alt="Bus Mockup"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-[11px] text-muted-foreground font-medium leading-relaxed">
                    Arrives at Chiang Mai Bus Terminal 3. Clean air conditioning and baggage storage
                    included.
                  </p>
                  <div className="flex gap-1.5 mt-2">
                    <span className="bg-purple-100 text-purple-700 text-[9px] font-bold px-2 py-0.5 rounded">
                      Instant Confirmation
                    </span>
                    <span className="bg-orange-100 text-orange-700 text-[9px] font-bold px-2 py-0.5 rounded">
                      Bestseller
                    </span>
                    <span className="bg-blue-100 text-blue-700 text-[9px] font-bold px-2 py-0.5 rounded">
                      Recommended
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center border-t border-gray-50 pt-4">
                <div className="flex items-center gap-1.5 text-xs text-yellow-500 font-bold">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>4.2</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-[9px] text-muted-foreground/70 block">
                      From €30 / adult
                    </span>
                    <span className="text-xs font-bold text-muted-foreground/70 line-through">
                      €30.66
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => openBooking("Transport booking")}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold text-xs py-2 px-5 rounded shadow-sm"
                  >
                    Select Time
                  </button>
                </div>
              </div>
            </div>

            {/* Lion Air Flight Card (newly added based on design) */}
            <div className="bg-card rounded-xl border border-border p-5 card-lift shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="font-bold text-foreground text-sm block">Lion Air</span>
                  <span className="text-[10px] text-muted-foreground/70 font-medium">JT-800</span>
                </div>
                <div className="text-right text-[11px] text-muted-foreground font-semibold">
                  Baggage 10 kg
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-b border-gray-50 py-4 mb-4">
                <div>
                  <span className="text-sm font-bold text-foreground/80 block">03:30</span>
                  <span className="text-[11px] text-muted-foreground/70 font-medium">
                    COK (Cochin)
                  </span>
                </div>
                <div className="text-center px-4 flex flex-col items-center">
                  <span className="text-[10px] text-muted-foreground/70 font-bold">1h 30m</span>
                  <div className="w-16 h-0.5 bg-muted my-1"></div>
                  <span className="text-[9px] text-green-600 font-semibold">Direct</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-foreground/80 block">05:00</span>
                  <span className="text-[11px] text-muted-foreground/70 font-medium">
                    SUB (Surabaya)
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-[10px] text-muted-foreground/70 font-semibold">
                  Economy Class
                </span>
                <div className="flex items-center gap-4">
                  <span className="text-primary font-bold text-sm">USD 55</span>
                  <button
                    type="button"
                    onClick={() => openBooking("Transport booking")}
                    className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs py-2 px-6 rounded shadow-sm"
                  >
                    Select
                  </button>
                </div>
              </div>
            </div>

            {/* Delta Card */}
            <div className="bg-card rounded-xl border border-border p-5 card-lift shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <span className="font-bold text-foreground text-xs">DELTA AIRLINES</span>
                <span className="text-[10px] text-muted-foreground/70 font-bold">
                  Economy by Computicket
                </span>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-sm font-bold text-foreground/80 block">6:30 PM</span>
                  <span className="text-[10px] text-muted-foreground/70">Cape Town</span>
                </div>
                <div className="w-16 h-0.5 bg-muted"></div>
                <div className="text-right">
                  <span className="text-sm font-bold text-foreground/80 block">9:10 AM</span>
                  <span className="text-[10px] text-muted-foreground/70">Mthatha</span>
                </div>
              </div>

              <div className="flex justify-between items-center border-t border-gray-50 pt-4">
                <span className="text-sm font-bold text-foreground">$36.31</span>
                <button
                  type="button"
                  onClick={() => openBooking("Transport booking")}
                  className="bg-yellow-400 hover:bg-yellow-500 text-gray-850 font-bold text-xs py-2.5 px-6 rounded shadow-sm"
                >
                  View Deal
                </button>
              </div>
            </div>
          </div>

          {/* Right Column Listings (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Akasa Air Card */}
            <div className="bg-card rounded-xl border border-border p-5 shadow-sm relative card-lift">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="font-bold text-foreground text-sm block">Akasa Air</span>
                  <span className="text-[10px] text-muted-foreground/70 font-medium">QP1518</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-green-600 block">Extra ₹765 Off</span>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-b border-gray-50 py-4 mb-4">
                <div>
                  <span className="text-sm font-bold text-foreground/80 block">21:45</span>
                  <span className="text-[10px] text-muted-foreground/70 font-medium">BOM</span>
                </div>
                <div className="text-center px-2 flex flex-col items-center">
                  <span className="text-[9px] text-muted-foreground/70 font-bold">1h 55m</span>
                  <div className="w-12 h-0.5 bg-muted my-1"></div>
                  <span className="text-[8px] text-green-600 font-semibold">Non-stop</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-foreground/80 block">23:40</span>
                  <span className="text-[10px] text-muted-foreground/70 font-medium">BLR</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="text-left">
                  <span className="block text-sm font-bold text-[#1e3a8a]">₹5,101</span>
                  <span className="text-[8px] text-muted-foreground/70">Taxes included</span>
                </div>
                <div className="flex gap-2 items-center">
                  <span className="text-[9px] text-orange-500 font-semibold cursor-pointer hover:underline">
                    Flight Details &gt;
                  </span>
                  <button
                    type="button"
                    onClick={() => openBooking("Transport booking")}
                    className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs py-2 px-5 rounded shadow-sm"
                  >
                    Book
                  </button>
                </div>
              </div>

              <div className="absolute top-2 right-2 bg-orange-50 text-[9px] font-bold text-orange-600 py-0.5 px-2 rounded-full border border-orange-100 flex items-center gap-1 mt-10">
                <span>🔐 Lock Price @ ₹569</span>
              </div>
            </div>

            {/* SC Southern Express Bus Card */}
            <div className="bg-card rounded-xl border border-border p-5 card-lift shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="font-bold text-primary text-sm block">SC Southern Express</span>
                  <span className="text-[10px] text-muted-foreground/70 font-medium">12:15 AM</span>
                </div>
                <div className="flex items-center gap-1 bg-[#fef08a] px-2 py-0.5 rounded text-[9px] font-bold text-[#854d0e]">
                  <Star className="w-2.5 h-2.5 fill-current" />
                  <span>3.7</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-b border-gray-50 py-3 mb-4 text-[10px] text-muted-foreground font-medium">
                <div>
                  <span className="block text-muted-foreground/70 text-[8px] uppercase font-bold">
                    From
                  </span>
                  <span>Johor Bahru (JB Larkin Term.)</span>
                </div>
                <div>
                  <span className="block text-muted-foreground/70 text-[8px] uppercase font-bold">
                    To
                  </span>
                  <span>TBS (Terminal Bersepadu Selatan)</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-[9px] text-muted-foreground/70 font-semibold">
                  1+2 (EXECUTIVE) | Details
                </span>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-muted-foreground/70 line-through text-[9px] block">
                      S$ 14.71
                    </span>
                    <span className="text-primary font-bold text-sm block">S$ 15.35</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => openBooking("Transport booking")}
                    className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs py-2 px-5 rounded shadow-sm"
                  >
                    Select
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Transport Alternatives Box */}
            <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
              <h3 className="font-bold text-sm text-primary mb-4 pb-2 border-b border-border">
                Transport Alternatives
              </h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-2 rounded hover:bg-muted/60 transition-colors border border-border">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                      <Train className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-foreground/80">Train</span>
                      <span className="text-[9px] text-muted-foreground/70 font-semibold">
                        64h 53min
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-primary">US$18-128 &gt;</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded hover:bg-muted/60 transition-colors border border-border">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded bg-green-50 flex items-center justify-center text-green-600 shrink-0">
                      <Bus className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-foreground/80">Bus</span>
                      <span className="text-[9px] text-muted-foreground/70 font-semibold">
                        65h 32min
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-primary">US$40-100 &gt;</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded hover:bg-muted/60 transition-colors border border-border">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded bg-orange-50 flex items-center justify-center text-orange-600 shrink-0">
                      <Car className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-foreground/80">
                        Drive (3,029 km)
                      </span>
                      <span className="text-[9px] text-muted-foreground/70 font-semibold">
                        41h 42min
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-primary">US$258-516 &gt;</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded hover:bg-muted/60 transition-colors border border-border">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
                      <Plane className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-foreground/80">
                        Fly (Srinagar Airport)
                      </span>
                      <span className="text-[9px] text-muted-foreground/70 font-semibold">
                        7h 44min
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-primary">US$169-242 &gt;</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded hover:bg-muted/60 transition-colors border border-border">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded bg-yellow-50 flex items-center justify-center text-yellow-600 shrink-0">
                      <Plane className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-foreground/80">
                        Taxi to Airport & Fly
                      </span>
                      <span className="text-[9px] text-muted-foreground/70 font-semibold">
                        9h 4min
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-primary">US$270-508 &gt;</span>
                </div>
              </div>
            </div>

            {/* Flixbus Card */}
            <div className="bg-card rounded-xl border border-border p-5 card-lift shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <span className="font-bold text-green-600 text-xs">FlixBus</span>
                <span className="text-[9px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded">
                  Cheapest option
                </span>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-sm font-bold text-foreground/80 block">00:10</span>
                  <span className="text-[10px] text-muted-foreground/70">Berlin Wannsee</span>
                </div>
                <div className="text-center">
                  <span className="text-[9px] text-muted-foreground/70 block">42h 50m</span>
                  <span className="text-[8px] text-orange-600 font-bold">2 transfers</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-foreground/80 block">
                    18:00{" "}
                    <span className="text-muted-foreground/70 text-[10px] font-normal">+1d</span>
                  </span>
                  <span className="text-[10px] text-muted-foreground/70">Lisbon (Oriente)</span>
                </div>
              </div>

              <div className="flex justify-between items-center border-t border-gray-50 pt-4">
                <span className="text-sm font-bold text-foreground">€312.56</span>
                <button
                  type="button"
                  onClick={() => openBooking("Transport booking")}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold text-xs py-2 px-5 rounded shadow-sm"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Pagination Container matching Careers exactly */}
        <div className="flex flex-col items-center justify-center pb-6 px-4">
          <div className="text-[11px] font-bold text-muted-foreground mb-2">
            Showing 1 To 12 of 97 Results
          </div>

          <div className="flex items-center gap-0 bg-primary rounded overflow-hidden shadow-sm h-8">
            <button className="px-4 text-xs font-semibold text-white bg-primary hover:bg-primary/90 transition-colors border-r border-[#3a5375] h-full">
              More Results
            </button>

            <div className="relative h-full z-20">
              <button
                onClick={() => setIsLimitDropdownOpen(!isLimitDropdownOpen)}
                className="flex items-center px-3 text-xs font-semibold text-white bg-primary hover:bg-primary/90 transition-colors h-full"
              >
                {limit} <ChevronDown className="w-3.5 h-3.5 ml-1 opacity-80" />
              </button>
              {isLimitDropdownOpen && (
                <div className="absolute bottom-full right-0 mt-1 mb-1 bg-card shadow-lg border border-border rounded-md w-[60px] py-1 text-center">
                  {[12, 24, 48, 96].map((num) => (
                    <div
                      key={num}
                      onClick={() => {
                        setLimit(num);
                        setIsLimitDropdownOpen(false);
                      }}
                      className="text-[11px] text-muted-foreground py-1.5 hover:bg-muted/60 hover:text-blue-600 cursor-pointer font-medium"
                    >
                      {num}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Click outside overlay */}
      {isLimitDropdownOpen && (
        <div className="fixed inset-0 z-10" onClick={() => setIsLimitDropdownOpen(false)}></div>
      )}

      <PublicContactModal
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
        title="Booking request"
        description="Share your travel details and our team will confirm pricing and availability."
        subject={bookingSubject}
      />
    </PublicPageShell>
  );
}
