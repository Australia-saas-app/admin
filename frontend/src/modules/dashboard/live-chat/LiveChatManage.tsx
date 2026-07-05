"use client";

import { cn } from "@/src/lib/utils";
import { AlignJustify, X } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { CallManager } from "./components/CallManager";
import { ChatLanding } from "./components/ChatLanding";
import { GroupConversationManager } from "./components/GroupConversationManager";
import { Header } from "./components/Header";
import { MainChatArea } from "./components/MainChatArea";
import { NotificationCenter } from "./components/NotificationCenter";
import { OnlineUser } from "./components/OnlineUser";
import { ChatContext, ChatProvider } from "./context/ChatContext";
import { useChatContext } from "./hooks/useChatContext";
import Image from "next/image";

export const LiveChatManage = () => {
  return (
    <ChatProvider>
      <Chat />
    </ChatProvider>
  );
};

const Chat = () => {
  const { state } = useContext(ChatContext);
  const {
    updateIsSidebar,
    fetchConversations,
    fetchOnlineUsers,
    fetchGroupConversations,
  } = useChatContext();
  const [showGroupDropdown, setShowGroupDropdown] = useState(false);
  const [showMessagesDropdown, setShowMessagesDropdown] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  // Demo messages from users
  const demoMessages = [
    {
      id: "msg-1",
      userName: "Liam Anderson",
      userAvatar: "https://lh3.googleusercontent.com/a-/ALV-UjUcIWda3ZrzBMAJl37_GUwH9bvPyroMBoqo3x1hKRyIO-LD96s=s240-p-k-rw-no",
      message: "Hi, I need help with my account login",
      time: "2 min ago",
      unread: true,
    },
    {
      id: "msg-2",
      userName: "Lucas Williams",
      userAvatar: "https://lh3.googleusercontent.com/a-/ALV-UjUcIWda3ZrzBMAJl37_GUwH9bvPyroMBoqo3x1hKRyIO-LD96s=s240-p-k-rw-no",
      message: "Can you help with my business account?",
      time: "5 min ago",
      unread: true,
    },
    {
      id: "msg-3",
      userName: "Grace Miller",
      userAvatar: "https://lh3.googleusercontent.com/a-/ALV-UjUcIWda3ZrzBMAJl37_GUwH9bvPyroMBoqo3x1hKRyIO-LD96s=s240-p-k-rw-no",
      message: "Thank you for the quick response!",
      time: "10 min ago",
      unread: false,
    },
    {
      id: "msg-4",
      userName: "Sophia Chen",
      userAvatar: "https://lh3.googleusercontent.com/a-/ALV-UjUcIWda3ZrzBMAJl37_GUwH9bvPyroMBoqo3x1hKRyIO-LD96s=s240-p-k-rw-no",
      message: "I have a question about pricing",
      time: "15 min ago",
      unread: true,
    },
    {
      id: "msg-5",
      userName: "Benjamin Knight",
      userAvatar: "https://lh3.googleusercontent.com/a-/ALV-UjUcIWda3ZrzBMAJl37_GUwH9bvPyroMBoqo3x1hKRyIO-LD96s=s240-p-k-rw-no",
      message: "When will the new features be available?",
      time: "20 min ago",
      unread: false,
    },
  ];

  const handleReply = (messageId: string) => {
    if (replyText.trim()) {
      console.log(`Replying to ${messageId}: ${replyText}`);
      // Here you would send the reply through your socket/API
      setReplyText("");
      setReplyingTo(null);
    }
  };

  // Load initial data
  useEffect(() => {
    fetchConversations();
    fetchOnlineUsers();
    fetchGroupConversations();
  }, [fetchConversations, fetchOnlineUsers, fetchGroupConversations]);

  return (
    <div className="flex bg-gray-50 relative">
      {/* Sidebar */}
      <button
        className={cn(
          "shrink-0 xl:hidden absolute left-0 top-0 z-20",
          state.isSidebarOpen ? "hidden" : "block"
        )}
        onClick={() => updateIsSidebar(true)}
      >
        <AlignJustify />
      </button>

      <div
        className={cn(
          "hidden xl:flex max-w-[330px] shadow border-r border flex-col relative",
          state.isSidebarOpen ? "block" : "hidden"
        )}
      >
        <button
          className={cn(
            "absolute right-0 top-0 z-20",
            state.isSidebarOpen ? "block" : "hidden"
          )}
          onClick={() => updateIsSidebar(false)}
        >
          <X />
        </button>

        {/* Header */}
        <Header />

        {/* Online Users */}
        <OnlineUser />

        {/* Group Conversation Manager */}
        <GroupConversationManager />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar with Notifications */}
        <div className=" border-b shadow p-4 flex justify-end gap-2">
          {/* Messages Button */}
          <div className="relative">
            <button
              onClick={() => setShowMessagesDropdown(!showMessagesDropdown)}
              className="relative p-2.5 hover:bg-gray-100 rounded-lg transition-colors group"
              title="Recent Messages"
            >
              <svg
                className="w-5 h-5 text-gray-600 group-hover:text-gray-700 transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
              {/* Unread Badge */}
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Messages Dropdown */}
            {showMessagesDropdown && (
              <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-[600px] overflow-y-auto">
                {/* Header */}
                <div className="p-4 border-b border-gray-200 sticky top-0 bg-white">
                  <h3 className="text-sm font-semibold text-gray-900">Recent Messages</h3>
                </div>

                {/* Messages List */}
                <div>
                  {demoMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className="border-b border-gray-100 last:border-0"
                    >
                      <div className="p-4 hover:bg-gray-50">
                        <div className="flex items-start gap-3">
                          {/* User Avatar */}
                          <Image
                            width={400}
                            height={400}
                            src={msg.userAvatar}
                            alt={msg.userName}
                            className="w-10 h-10 rounded-full object-cover shrink-0"
                          />

                          {/* Message Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="text-sm font-medium text-gray-900">
                                {msg.userName}
                              </h4>
                              <span className="text-xs text-gray-400">{msg.time}</span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{msg.message}</p>
                            
                            {/* Reply Section */}
                            {replyingTo === msg.id ? (
                              <div className="mt-2 space-y-2">
                                <textarea
                                  value={replyText}
                                  onChange={(e) => setReplyText(e.target.value)}
                                  placeholder="Type your reply..."
                                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
                                  rows={2}
                                />
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleReply(msg.id)}
                                    className="px-3 py-1 text-xs bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                                  >
                                    Send
                                  </button>
                                  <button
                                    onClick={() => {
                                      setReplyingTo(null);
                                      setReplyText("");
                                    }}
                                    className="px-3 py-1 text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <button
                                onClick={() => setReplyingTo(msg.id)}
                                className="text-xs text-blue-500 hover:text-blue-600 font-medium"
                              >
                                Reply
                              </button>
                            )}
                          </div>

                          {/* Unread Indicator */}
                          {msg.unread && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full shrink-0 mt-2"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Group Chat Button */}
          <div className="relative">
            <button
              onClick={() => setShowGroupDropdown(!showGroupDropdown)}
              className="relative p-2.5 hover:bg-gray-100 rounded-lg transition-colors group"
              title="Group Chats"
            >
              <svg
                className="w-5 h-5 text-gray-600 group-hover:text-gray-700 transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </button>

            {/* Group Chat Dropdown */}
            {showGroupDropdown && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-y-auto">
                {/* Header */}
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900">Group Chats</h3>
                </div>

                {/* Group List */}
                <div className="py-2">
                  {state.groupConversations && state.groupConversations.length > 0 ? (
                    state.groupConversations.map((group: any) => (
                      <div
                        key={group._id}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => {
                          // Handle group selection
                          setShowGroupDropdown(false);
                        }}
                      >
                        {/* Group Avatar */}
                        <div className="w-10 h-10 bg-linear-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-semibold shrink-0">
                          {group.groupName?.charAt(0)?.toUpperCase() || "G"}
                        </div>

                        {/* Group Info */}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {group.groupName}
                          </h4>
                          <p className="text-xs text-gray-500">
                            {group.participants?.length || 0} members
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-8 text-center text-sm text-gray-500">
                      No group chats yet
                    </div>
                  )}
                </div>

                {/* Create Group Button */}
                <div className="p-3 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setShowGroupDropdown(false);
                      // Trigger group creation modal
                    }}
                    className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    Create Group Chat
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <NotificationCenter />
        </div>

        {/* Chat Content */}
        {state.isChatUserSelect ? <MainChatArea /> : <ChatLanding />}
      </div>

      {/* Call Manager Modal */}
      <CallManager />
    </div>
  );
};
