
import {
  MailPlus,
  Pencil,
  Search
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
    <div className="border-b border-slate-200/50 dark:border-slate-700/50 shadow-sm bg-slate-50/30 dark:bg-slate-800/30 rounded-tl-[2rem]">
      {/* User Profile Section */}
      <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center space-x-4">
          {/* User Avatar */}
          <div className="relative group cursor-pointer">
            <div className="absolute inset-0 bg-blue-500 rounded-full blur opacity-40 group-hover:opacity-70 transition-opacity"></div>
            <Image
              src={demoUser.avatar}
              alt={demoUser.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-slate-800 relative z-10"
              width={48}
              height={48}
            />
            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-slate-800 rounded-full z-20 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
          </div>

          {/* User Info */}
          <div>
            <h2 className="text-sm font-bold text-slate-800 dark:text-white">
              {demoUser.name}
            </h2>
            <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mt-0.5">Admin</p>
          </div>
        </div>

        {/* Action Icons */}
        <div className="flex items-center space-x-1">
          <button className="p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-xl transition-all" title="New message">
            <MailPlus className="w-5 h-5" />
          </button>
          <button className="p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-xl transition-all" title="Edit">
            <Pencil className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4">
        <div className="relative group">
          <input
            type="text"
            placeholder="Search message, people..."
            className="w-full pl-11 pr-4 h-11 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder-slate-400 text-sm shadow-sm group-hover:shadow-md"
          />
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          </div>
        </div>
      </div>
    </div>
  );
};
