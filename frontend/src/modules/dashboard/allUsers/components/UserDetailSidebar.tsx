"use client"

import React, { useState } from "react"

interface UserDetailSidebarProps {
  userId: string
  fullName: string
  profileImage?: string
  onProfileClick?: () => void
  onWalletClick?: () => void
  onTechnicalClick?: () => void
}

export const UserDetailSidebar: React.FC<UserDetailSidebarProps> = ({
  userId,
  fullName,
  profileImage,
  onProfileClick,
  onWalletClick,
  onTechnicalClick,
}) => {
  const [activeTab, setActiveTab] = useState("profile")

  const handleProfileClick = () => {
    setActiveTab("profile")
    onProfileClick?.()
  }

  const handleWalletClick = () => {
    setActiveTab("wallet")
    onWalletClick?.()
  }

  const handleTechnicalClick = () => {
    setActiveTab("technical")
    onTechnicalClick?.()
  }

  return (
    <aside className="w-64 bg-base-100 shadow-md p-6 min-h-screen">
      {/* User Avatar & Info */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden border-4 border-gray-300 bg-gray-200">
          {profileImage ? (
            <img src={profileImage} alt={fullName} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
              {fullName.charAt(0)}
            </div>
          )}
        </div>
        <h3 className="text-lg font-bold text-gray-800">{fullName}</h3>
        <p className="text-sm text-gray-600 mt-1">ID: {userId}</p>
      </div>

      {/* Sidebar Menu Items */}
      <div className="space-y-3">
        {/* Profile Button */}
        <button
          onClick={handleProfileClick}
          className={`w-full px-4 py-3 rounded-lg font-semibold transition-colors ${
            activeTab === "profile"
              ? "bg-yellow-400 text-gray-800 hover:bg-yellow-500"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          profile
        </button>

        {/* Wallet Button */}
        <button
          onClick={handleWalletClick}
          className={`w-full px-4 py-3 rounded-lg font-semibold transition-colors ${
            activeTab === "wallet"
              ? "bg-yellow-400 text-gray-800 hover:bg-yellow-500"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          wallet
        </button>

        {/* Technical Button */}
        <button
          onClick={handleTechnicalClick}
          className={`w-full px-4 py-3 rounded-lg font-semibold transition-colors ${
            activeTab === "technical"
              ? "bg-yellow-400 text-gray-800 hover:bg-yellow-500"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Technical
        </button>
      </div>
    </aside>
  )
}

export default UserDetailSidebar
