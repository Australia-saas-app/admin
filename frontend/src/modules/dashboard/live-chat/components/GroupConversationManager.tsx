"use client";

import { Plus, X } from "lucide-react";
import React, { useCallback, useState } from "react";
import { demoUsers } from "../data/demoData";
import { useChatContext } from "../hooks/useChatContext";
import type { TConversation } from "../types";

export const GroupConversationManager = () => {
  const { createGroupConversation, fetchGroupConversations, loading, state } =
    useChatContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);

  const toggleParticipant = useCallback((userId: string) => {
    setSelectedParticipants((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  }, []);

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim() || selectedParticipants.length === 0) return;

    try {
      await createGroupConversation(groupName, selectedParticipants);
      setGroupName("");
      setSelectedParticipants([]);
      setIsModalOpen(false);
      // Refresh groups
      await fetchGroupConversations();
    } catch (error) {
      console.error("Error creating group:", error);
    }
  };

  const groupConversations = state.groupConversations || [];

  return (
    <div className="border-t mt-4">
      {/* Groups List */}


      {/* Create Group Button */}
      {/* <button
        onClick={() => setIsModalOpen(true)}
        className="w-full px-4 py-3 flex items-center gap-2 hover:bg-gray-50 transition-colors text-blue-600 font-medium text-sm border-t border-gray-100"
      >
        <Plus className="w-4 h-4" />
        Create Group Chat
      </button> */}

      {/* Create Group Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="flex items-center justify-between p-4 border-b border">
              <h3 className="text-lg font-semibold text-gray-900">Create Group Chat</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 hover:bg-base-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleCreateGroup} className="p-4 space-y-4">
              {/* Group Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Group Name
                </label>
                <input
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="Enter group name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Participants */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Members
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {demoUsers.map((user) => (
                    <label
                      key={user.id}
                      className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedParticipants.includes(user.id)}
                        onChange={() => toggleParticipant(user.id)}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-700">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.role}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    loading || !groupName.trim() || selectedParticipants.length === 0
                  }
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-lg font-medium transition-colors"
                >
                  {loading ? "Creating..." : "Create Group"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
