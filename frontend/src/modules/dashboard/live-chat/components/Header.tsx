
import {
  MailPlus,
  Pencil
} from "lucide-react";
import Image from "next/image";

import { useChatContext } from "../hooks/useChatContext";

export const Header = () => {
  const { state, updateActiveTab, onlineUsers } = useChatContext();
  const { activeTab } = state;
  
  // TODO: Replace with actual user data from authentication system
  const demoUser = {
    name: "Admin User",
    avatar: "https://lh3.googleusercontent.com/a-/ALV-UjUcIWda3ZrzBMAJl37_GUwH9bvPyroMBoqo3x1hKRyIO-LD96s=s240-p-k-rw-no"
  };

  return (
    <div className="border-b border shadow">
      {/* User Profile Section */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          {/* User Avatar */}
          <div className="relative">
            <Image
              src={demoUser.avatar}
              alt={demoUser.name}
              className="w-12 h-12 rounded-full object-cover"
              width={48}
              height={48}
            />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
          </div>

          {/* User Info */}
          <div>
            <h2 className="text-sm font-semibold text-gray-900">
              {demoUser.name}
            </h2>
            <p className="text-xs text-gray-500">Admin</p>
          </div>
        </div>

        {/* Action Icons */}
        <div className="flex items-center space-x-1">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="New message">
            <MailPlus className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Edit">
            <Pencil className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-3">
        <div className="relative">
          <input
            type="text"
            placeholder="Search message, people..."
            className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 transition-colors placeholder-gray-400 text-sm"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-4 w-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
