"use client";

import { cn } from "@/src/infra/lib/utils";
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
    <div className="flex relative h-[calc(100vh-145px)] mt-2 -mb-12 gap-6 bg-transparent">
      {/* Sidebar */}
      <div
        className={cn(
          "w-full lg:w-[340px] shrink-0 shadow-sm border border-gray-200 dark:border-gray-800 flex-col relative bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden lg:flex",
          state.isChatUserSelect ? "hidden" : "flex"
        )}
      >
        {/* Header */}
        <Header />

        {/* Online Users */}
        <OnlineUser />

        {/* Group Conversation Manager */}
        <GroupConversationManager />
      </div>

      {/* Main Chat Area */}
      <div 
        className={cn(
          "flex-1 flex-col shadow-sm border border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden lg:flex",
          state.isChatUserSelect ? "flex" : "hidden"
        )}
      >
        {/* Chat Content */}
        {state.isChatUserSelect ? <MainChatArea /> : <ChatLanding />}
      </div>

      {/* Call Manager Modal */}
      <CallManager />
    </div>
  );
};
