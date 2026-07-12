import { ArrowLeft, Check, CheckCheck, Clock, MoreVertical, Paperclip,  Send } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useChatContext } from "../hooks/useChatContext";

import { CallAction } from "./actions/CallAction";

import { SOCKET_CONFIG, usePrivateChat } from "@/src/business/dashboard/services/socket";
import { demoMessages } from "../data/demoData";
import { TMessage } from "../types";
import Image from "next/image";

// Demo user data - TODO: Replace with actual authentication
const demoAuthUser = {
  name: "Admin User",
  id: "admin-001",
};

// Delivery status icon component
const DeliveryStatusIcon = ({ status }: { status?: string }) => {
  switch (status) {
    case "sent":
      return <Check className="w-3 h-3 text-gray-400" />;
    case "delivered":
      return <CheckCheck className="w-3 h-3 text-gray-400" />;
    case "read":
      return <CheckCheck className="w-3 h-3 text-blue-500" />;
    case "failed":
      return <Clock className="w-3 h-3 text-red-500" />;
    default:
      return <Clock className="w-3 h-3 text-gray-300" />;
  }
};

export const MainChatArea = () => {
  const { selectedUser, markAsRead, updateIsChatSelect, updateSelectedUser } = useChatContext();
  const [userId, setUserId] = useState("");
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const {
    messages,
    sendMessage: sendSocketMessage,
    addMessage,
    setMessages,
  } = usePrivateChat({
    userId: userId || "admin",
    conversationId: selectedUser?.conversationId,
    onNewMessage: (message) => {
      // Mark as delivered/read
      if (message.senderId !== userId) {
        markAsRead(selectedUser?.conversationId || "", [message._id || ""]);
      }
      setTimeout(() => scrollToBottom(), 0);
    },
  });
  // Auto scroll to bottom function
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (selectedUser?.receiverId) {
      setUserId(selectedUser?.receiverId);
    }
  }, [selectedUser?.receiverId]);

  const fetchMessage = useCallback(async () => {
    if (!userId && !selectedUser?.senderId && !selectedUser?.conversationId)
      return;
    
    // Try to fetch from API, but if it fails or returns empty, use demo data
    try {
      const response = await fetch(
        `${SOCKET_CONFIG.URL}/api/messages/admin-conversation?type=live&conversationId=${selectedUser?.conversationId}&senderId=${userId}&serviceType=${selectedUser?.serviceType}&receiverId=${selectedUser?.senderId}`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        setMessages(data);
      } else {
        // Use demo messages for this conversation
        const conversationMessages = demoMessages.filter(
          msg => msg.conversationId === selectedUser?.conversationId
        );
        setMessages(conversationMessages);
      }
    } catch (error) {
      console.error("Error fetching messages:", (error as Error).message);
      // Fallback to demo messages on error
      const conversationMessages = demoMessages.filter(
        msg => msg.conversationId === selectedUser?.conversationId
      );
      setMessages(conversationMessages);
    }
  }, [
    userId,
    selectedUser?.senderId,
    selectedUser?.serviceType,
    selectedUser?.conversationId,
    setMessages,
  ]);

  useEffect(() => {
    fetchMessage();
  }, [fetchMessage]);

  const sendMessage = (e: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || !selectedUser) return;

    const msg: TMessage = {
      senderId: selectedUser.receiverId!,
      senderName: demoAuthUser.name,
      receiverId: selectedUser.senderId!,
      receiverName: selectedUser.senderName,
      content: input,
      createdAt: new Date(),
      conversationId: selectedUser.conversationId!,
      serviceType: selectedUser.serviceType!,
      type: "live",
      authority: "admin",
      deliveryStatus: "sent", // Track delivery status
    };

    sendSocketMessage(msg);
    addMessage(msg);
    setInput("");
    
    // Clear typing indicator
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    setTypingUsers([]);
  };

  // Handle typing indicator
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    
    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      setTypingUsers([]);
    }, 0);
  };

  const formatTime = (timestamp: Date) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleBack = () => {
    updateIsChatSelect(false);
    updateSelectedUser(null);
  };

  return (
    <div className="flex-1 flex flex-col bg-transparent relative z-10 h-full">
      {/* Chat Header */}
      <div className="bg-blue-600 p-3 md:p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="flex items-center gap-2 md:gap-4 min-w-0">
          <button 
            onClick={handleBack}
            className="lg:hidden p-1.5 md:p-2 -ml-1 md:-ml-2 text-white/80 hover:text-white transition-colors shrink-0"
          >
            <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          <div className="relative group shrink-0">
            <div className="absolute inset-0 bg-white/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <Image
              width={40}
              height={40}
              src={"https://lh3.googleusercontent.com/a-/ALV-UjUcIWda3ZrzBMAJl37_GUwH9bvPyroMBoqo3x1hKRyIO-LD96s=s240-p-k-rw-no"}
              alt={selectedUser?.senderName || "User"}
              className="w-9 h-9 md:w-10 md:h-10 rounded-full object-cover border-2 border-white/30 relative z-10"
            />
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 md:w-3 md:h-3 bg-emerald-400 border-2 border-indigo-600 rounded-full z-20 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></div>
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="font-bold text-white text-[13px] md:text-sm tracking-wide truncate">
              {selectedUser?.senderName}
            </h2>
            <p className="text-[11px] md:text-xs font-medium text-blue-100 truncate">
              {selectedUser?.serviceType}
            </p>
          </div>
        </div>
        <div className="flex gap-1 md:gap-2 items-center shrink-0">
          <CallAction />
          <button className="p-1.5 md:p-2 rounded-xl transition-all hover:bg-white/10 text-white/80 hover:text-white">
            <MoreVertical className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar bg-transparent">
        {messages.map((message, index) => {
          const isOwnMessage = message.senderId == userId;
          return (
            <div
              key={index}
              className={`flex ${
                isOwnMessage ? "justify-end" : "justify-start"
              }`}
            >
              {!isOwnMessage && (
                <Image
                  width={32}
                  height={32}
                  src={"https://lh3.googleusercontent.com/a-/ALV-UjUcIWda3ZrzBMAJl37_GUwH9bvPyroMBoqo3x1hKRyIO-LD96s=s240-p-k-rw-no"}
                  alt={message.senderName}
                  className="w-8 h-8 rounded-full object-cover shrink-0 mr-3 shadow-sm border border-slate-200/50 dark:border-slate-700/50"
                />
              )}
              <div
                className={`max-w-[75%] lg:max-w-md px-5 py-3 shadow-md ${
                  isOwnMessage
                    ? "bg-blue-600 text-white rounded-[1.5rem] rounded-br-sm border border-blue-500/30"
                    : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-[1.5rem] rounded-bl-sm border border-gray-200 dark:border-gray-700"
                }`}
              >
                <p className="text-[14px] leading-relaxed break-words">{message.content}</p>
                <div className="flex items-center justify-end gap-1.5 mt-2">
                  <p className={`text-[11px] font-medium ${isOwnMessage ? "text-blue-100/80" : "text-slate-400 dark:text-slate-500"}`}>
                    {message.createdAt ? formatTime(message.createdAt) : "Now"}
                  </p>
                  {isOwnMessage && (
                    <DeliveryStatusIcon status={message.deliveryStatus} />
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Typing Indicator */}
        {typingUsers.length > 0 && (
          <div className="flex items-center gap-3">
            <Image
              width={32}
              height={32}
              src={ "https://lh3.googleusercontent.com/a-/ALV-UjUcIWda3ZrzBMAJl37_GUwH9bvPyroMBoqo3x1hKRyIO-LD96s=s240-p-k-rw-no"}
              alt={selectedUser?.senderName as string}
              className="w-8 h-8 rounded-full object-cover shrink-0 border border-slate-200/50 shadow-sm"
            />
            <div className="flex items-center gap-1.5 bg-white dark:bg-slate-800 px-5 py-4 rounded-[1.5rem] rounded-bl-sm border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce shadow-[0_0_8px_rgba(96,165,250,0.5)]"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce shadow-[0_0_8px_rgba(59,130,246,0.5)]" style={{ animationDelay: "0.15s" }}></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce shadow-[0_0_8px_rgba(37,99,235,0.5)]" style={{ animationDelay: "0.3s" }}></div>
            </div>
          </div>
        )}

        {/* Invisible div to scroll to */}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-gray-800 p-2.5 md:p-4">
        <div className="flex gap-2 md:gap-3 items-center max-w-full">
          <button className="p-2 md:p-2.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-all shadow-sm shrink-0 border border-transparent hover:border-gray-200">
            <Paperclip className="w-4 h-4 md:w-5 md:h-5" />
          </button>
          
          <div className="flex-1 relative group">
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              onKeyPress={(e) => e.key === "Enter" && sendMessage(e)}
              placeholder="Type a message..."
              className="w-full pl-4 pr-10 md:pl-5 md:pr-12 py-2.5 md:py-3.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all text-sm shadow-sm group-hover:shadow-md text-slate-800 dark:text-slate-100 placeholder-slate-400"
            />
          </div>

          <button
            onClick={sendMessage}
            disabled={!input.trim()}
            className="p-2.5 md:p-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:bg-slate-300 text-white rounded-2xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 shrink-0"
          >
            <Send className="w-4 h-4 md:w-5 md:h-5 ml-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
