"use client";

import { RefreshCw } from "lucide-react";
import { demoConversations, demoUsers } from "../data/demoData";
import { useChatContext } from "../hooks/useChatContext";
import type { TConversation } from "../types";

import { useFetchOnlineUsers } from "../hooks/useFetchOnlineUser";
import Image from "next/image";

export const OnlineUser = () => {
  const {
    updateReceiverId,
    updateIsChatSelect,
    updateSelectedUser,
    onlineUsers,
  } = useChatContext();

  const { isLoading, refreshUsers } = useFetchOnlineUsers();

  // Use demo conversations with avatars when no real users
  const displayUsers = onlineUsers && onlineUsers.length > 0 
    ? onlineUsers 
    : demoConversations.map(conv => ({
        ...conv,
        senderAvatar: demoUsers.find(u => u.id === conv.senderId)?.avatar || "https://lh3.googleusercontent.com/a-/ALV-UjUcIWda3ZrzBMAJl37_GUwH9bvPyroMBoqo3x1hKRyIO-LD96s=s240-p-k-rw-no"
      }));

  const handleClick = (isUser: TConversation | null) => {
    if (!isUser) return;
    updateReceiverId(isUser.senderId);
    updateIsChatSelect(true);
    updateSelectedUser(isUser);
  };

  return (
    <>
      <div className="p-2">
        <div className="flex justify-between items-center mb-2 px-2 pt-2">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
              Messages
            </span>
          </div>
          <button
            disabled={isLoading}
            className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg disabled:cursor-not-allowed transition-all"
            onClick={() => refreshUsers()}
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
          </button>
        </div>

        <div className="space-y-1 h-[calc(100vh-270px)] overflow-y-auto custom-scrollbar pr-1">
          {displayUsers?.map((user: TConversation) => (
            <div
              onClick={() => handleClick(user)}
              key={user?.conversationId}
              className="flex items-center gap-3 p-3 hover:bg-white/60 dark:hover:bg-slate-800/60 rounded-xl cursor-pointer transition-all group border border-transparent hover:border-slate-200/50 dark:hover:border-slate-700/50 hover:shadow-sm"
            >
              {/* Avatar with Status */}
              <div className="relative shrink-0">
                <Image
                  width={48}
                  height={48}
                  src={"https://lh3.googleusercontent.com/a-/ALV-UjUcIWda3ZrzBMAJl37_GUwH9bvPyroMBoqo3x1hKRyIO-LD96s=s240-p-k-rw-no"}
                  alt={user?.senderName || "User"}
                  className="w-12 h-12 rounded-full object-cover border-2 border-transparent group-hover:border-blue-200 dark:group-hover:border-blue-500/30 transition-colors"
                />
                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-slate-800 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
              </div>

              {/* User Info and Message Preview */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
                    {user?.senderName || "Unknown"}
                  </h4>
                  <span className="text-xs font-medium text-slate-400 ml-2 shrink-0 group-hover:text-blue-500/70 transition-colors">
                    {new Date(user?.createdAt as Date)?.toLocaleTimeString(
                      "en-us",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-[13px] text-slate-500 dark:text-slate-400 truncate flex-1 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">
                    {user?.lastMessage || "No messages yet"}
                  </p>
                  {user?.unreadCount && user.unreadCount > 0 && (
                    <span className="ml-2 min-w-[20px] h-[20px] bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full shrink-0 px-1.5 shadow-sm">
                      {user.unreadCount > 9 ? "9+" : user.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
