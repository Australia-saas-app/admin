import { Check, CheckCheck, Clock, MoreVertical, Paperclip,  Send } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useChatContext } from "../hooks/useChatContext";

import { CallAction } from "./actions/CallAction";

import { SOCKET_CONFIG, usePrivateChat } from "../../services/socket";
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
  const { selectedUser, markAsRead } = useChatContext();
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
      setTimeout(() => scrollToBottom(), 100);
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
    }, 3000);
  };

  const formatTime = (timestamp: Date) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Chat Header */}
      <div className="bg-primary text-base-100 p-4 flex items-center justify-between border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Image
          width={40}
          height={40}
            src={"https://lh3.googleusercontent.com/a-/ALV-UjUcIWda3ZrzBMAJl37_GUwH9bvPyroMBoqo3x1hKRyIO-LD96s=s240-p-k-rw-no"}
            alt={selectedUser?.senderName || "User"}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h2 className="font-semibold text-base-100 text-sm">
              {selectedUser?.senderName}
            </h2>
            <p className="text-xs text-base-100">
              {selectedUser?.serviceType}
            </p>
          </div>
        </div>
        <div className="flex gap-2 items-center">
          {/* <button className="p-2 text-base-100 rounded-lg transition-colors">
            <Phone className="w-5 h-5 text-base-100" />
          </button> */}
          <CallAction />
          <button className="p-2 rounded-lg transition-colors">
            <MoreVertical className="w-5 h-5 text-base-100" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
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
                  className="w-8 h-8 rounded-full object-cover shrink-0 mr-2"
                />
              )}
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl ${
                  isOwnMessage
                    ? "bg-gray-700 text-white rounded-br-sm"
                    : "bg-primary text-base-100 rounded-bl-sm border border-gray-200"
                }`}
              >
                <p className="text-sm leading-relaxed break-words">{message.content}</p>
                <div className="flex items-center justify-end gap-1.5 mt-1">
                  <p className={`text-xs ${isOwnMessage ? "text-base-100" : "text-base-100"}`}>
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
          <div className="flex items-center gap-2">
            <Image
              width={32}
              height={32}
              src={ "https://lh3.googleusercontent.com/a-/ALV-UjUcIWda3ZrzBMAJl37_GUwH9bvPyroMBoqo3x1hKRyIO-LD96s=s240-p-k-rw-no"}
              alt={selectedUser?.senderName as string}
              className="w-8 h-8 rounded-full object-cover shrink-0"
            />
            <div className="flex items-center gap-1.5 bg-white px-4 py-2.5 rounded-2xl border border-gray-200">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.15s" }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.3s" }}></div>
            </div>
          </div>
        )}

        {/* Invisible div to scroll to */}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex gap-3 items-center">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors shrink-0">
            <Paperclip className="w-5 h-5 text-gray-500" />
          </button>
          
          <div className="flex-1">
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              onKeyPress={(e) => e.key === "Enter" && sendMessage(e)}
              placeholder="Send a Message"
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-full focus:outline-none focus:border-gray-400 transition-colors text-sm"
            />
          </div>

          <button
            onClick={sendMessage}
            disabled={!input.trim()}
            className="p-2.5 bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-full transition-colors shrink-0"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
