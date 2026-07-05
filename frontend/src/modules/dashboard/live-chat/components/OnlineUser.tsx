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
      <div className="p-3 ">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">
              Messages
            </span>
          </div>
          <button
            disabled={isLoading}
            className="text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed transition-colors"
            onClick={() => refreshUsers()}
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-400 border-t-transparent"></div>
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
          </button>
        </div>

        <div className="space-y-0 h-[60vh] overflow-y-auto">
          {displayUsers?.map((user: TConversation) => (
            <div
              onClick={() => handleClick(user)}
              key={user?.conversationId}
              className="flex items-center gap-3 p-3 hover:bg-base-100 cursor-pointer transition-colors border-b border-gray-100 last:border-0"
            >
              {/* Avatar with Status */}
              <div className="relative shrink-0">
                <Image
                  width={48}
                  height={48}
                  src={"https://lh3.googleusercontent.com/a-/ALV-UjUcIWda3ZrzBMAJl37_GUwH9bvPyroMBoqo3x1hKRyIO-LD96s=s240-p-k-rw-no"}
                  alt={user?.senderName || "User"}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
              </div>

              {/* User Info and Message Preview */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <h4 className="text-sm font-medium text-gray-900 truncate">
                    {user?.senderName || "Unknown"}
                  </h4>
                  <span className="text-xs text-gray-400 ml-2 shrink-0">
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
                  <p className="text-xs text-gray-500 truncate flex-1">
                    {user?.lastMessage || "No messages yet"}
                  </p>
                  {user?.unreadCount && user.unreadCount > 0 && (
                    <span className="ml-2 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-semibold flex items-center justify-center rounded-full shrink-0 px-1">
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
