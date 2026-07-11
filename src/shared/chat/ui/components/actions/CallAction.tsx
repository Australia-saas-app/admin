import { Phone, Video } from "lucide-react";
import React, { useCallback } from "react";
import { useChatContext } from "../../hooks/useChatContext";

export const CallAction = () => {
  const { initiateCall, selectedUser } = useChatContext();
  const [calling, setCalling] = React.useState(false);

  const handleVoiceCall = useCallback(async () => {
    if (!selectedUser?.senderId) return;
    setCalling(true);
    try {
      await initiateCall(selectedUser.senderId, "voice");
    } catch (error) {
      console.error("Voice call error:", error);
      setCalling(false);
    }
  }, [selectedUser?.senderId, initiateCall]);

  const handleVideoCall = useCallback(async () => {
    if (!selectedUser?.senderId) return;
    setCalling(true);
    try {
      await initiateCall(selectedUser.senderId, "video");
    } catch (error) {
      console.error("Video call error:", error);
      setCalling(false);
    }
  }, [selectedUser?.senderId, initiateCall]);

  return (
    <div className="flex gap-2 items-center">
      <button
        onClick={handleVoiceCall}
        disabled={calling || !selectedUser}
        className="p-2 rounded-xl transition-all hover:bg-white/20 text-white/90 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
        title="Start voice call"
      >
        <Phone className="w-5 h-5" />
      </button>
      <button
        onClick={handleVideoCall}
        disabled={calling || !selectedUser}
        className="p-2 rounded-xl transition-all hover:bg-white/20 text-white/90 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
        title="Start video call"
      >
        <Video className="w-5 h-5" />
      </button>
    </div>
  );
};
