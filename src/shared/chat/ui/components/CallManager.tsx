"use client";

import { Mic, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { useChatContext } from "../hooks/useChatContext";

export const CallManager = () => {
  const { endCall, state } = useChatContext();
  const [isMuted, setIsMuted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const activeCall = state.activeCall;

  // Timer for call duration
  useEffect(() => {
    if (!activeCall) return;

    const interval = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [activeCall]);

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleEndCall = async () => {
    if (activeCall?.callId) {
      await endCall(activeCall.callId);
      setCallDuration(0);
    }
  };

  if (!activeCall) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl p-8">
        {/* Content */}
        <div className="text-center space-y-6 flex flex-col items-center">
          {/* Large Participant Avatar */}
          <div className="w-32 h-32 rounded-full overflow-hidden">
            <img
              src="https://lh3.googleusercontent.com/a-/ALV-UjUcIWda3ZrzBMAJl37_GUwH9bvPyroMBoqo3x1hKRyIO-LD96s=s240-p-k-rw-no"
              alt={activeCall.participant}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Participant Info */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-1">
              {activeCall.participant}
            </h2>
            <p className="text-sm text-gray-500">
              {activeCall.type === "video" ? "web dev" : "web dev"}
            </p>
          </div>

          {/* Call Status */}
          <div className="text-gray-600 text-sm">
            Calling.....
          </div>

          {/* Call Controls */}
          <div className="flex justify-center gap-6 pt-6">
            {/* Mute Button */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`p-5 rounded-full transition-colors ${
                isMuted
                  ? "bg-gray-300 text-gray-700"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
              title={isMuted ? "Unmute" : "Mute"}
            >
              <Mic className="w-6 h-6" />
            </button>

            {/* End Call Button */}
            <button
              onClick={handleEndCall}
              className="p-5 rounded-full bg-red-500 hover:bg-red-600 text-white transition-colors"
              title="End Call"
            >
              <Phone className="w-6 h-6 rotate-135" />
            </button>

            {/* Speaker Button */}
            <button
              className="p-5 rounded-full bg-blue-500 hover:bg-blue-600 text-white transition-colors"
              title="Speaker"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.3-2.5-4.04v8.08c1.48-.74 2.5-2.27 2.5-4.04z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
