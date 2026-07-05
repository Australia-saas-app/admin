"use client";

import {
  ArrowRight,
  MessageCircle,
} from "lucide-react";

export const ChatLanding = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-gray-50">
      {/* Main Content */}
      <div className="text-center px-6 max-w-md">
        {/* Icon */}
        <div className="mb-6">
          <div className="w-20 h-20 mx-auto bg-gray-200 rounded-full flex items-center justify-center">
            <MessageCircle className="w-10 h-10 text-gray-500" />
          </div>
        </div>

        {/* Welcome Text */}
        <h1 className="text-2xl font-semibold text-gray-900 mb-3">
          Select a conversation
        </h1>

        <p className="text-sm text-gray-500 mb-8">
          Choose from your existing conversations or start a new one to begin messaging
        </p>

        {/* Instruction */}
        <div className="flex items-center justify-center text-gray-400 text-sm">
          <ArrowRight className="w-4 h-4 mr-2" />
          Select a user from the sidebar to start chatting
        </div>
      </div>
    </div>
  );
};
