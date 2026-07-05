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
    <div className="flex gap-5 items-center">
      <button
        onClick={handleVoiceCall}
        disabled={calling || !selectedUser}
        className="p-2 bg-primary text-base-100 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        title="Start voice call"
      >
        <Phone className="text-base-100 w-5 h-5" />
      </button>
      <button
        onClick={handleVideoCall}
        disabled={calling || !selectedUser}
        className="p-2 hover:bg-gray-100 bg-primary text-base-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        title="Start video call"
      >
        <Video className="text-base-100 w-5 h-5" />
      </button>
    </div>
  );
};
