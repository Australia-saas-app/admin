import React, { useCallback, useContext, useState } from "react";
import { ChatContext } from "../context/ChatContext";
import {
  callService,
  conversationService,
  deliveryService,
  groupConversationService,
  notificationService,
  presenceService
} from "../services/chatService";
import type { State, TConversation, UserPresence } from "../types";

export const useChatContext = () => {
  const { state, dispatch } = useContext(ChatContext);
  const { receiverId } = state;
  const [loading, setLoading] = useState(false);
  const [onlineUsersList, setOnlineUsersList] = useState<UserPresence[]>([]);

  const messages = React.useMemo(() => state.messages, [state.messages]);
  const onlineUsers = React.useMemo(
    () => state.onlineUsers,
    [state.onlineUsers]
  );
  const updateSearch = React.useCallback(
    (query: string) => {
      dispatch({
        type: "UPDATE_STATE",
        payload: {
          filter: {
            ...state.filter,
            query,
          },
        },
      });
    },
    [dispatch, state.filter]
  );

  const resetFilter = React.useCallback(() => {
    dispatch({
      type: "RESET",
    });
  }, [dispatch]);

  const updateReceiverId = React.useCallback(
    (userId: string) => {
      dispatch({
        type: "UPDATE_STATE",
        payload: { receiverId: userId },
      });
    },
    [dispatch]
  );

  const updateIsChatSelect = React.useCallback(
    (isSelect: boolean) => {
      dispatch({
        type: "UPDATE_STATE",
        payload: { isChatUserSelect: isSelect },
      });
    },
    [dispatch]
  );

  const updateIsSidebar = React.useCallback(
    (isOpen: boolean) => {
      dispatch({
        type: "UPDATE_STATE",
        payload: { isSidebarOpen: isOpen },
      });
    },
    [dispatch]
  );

  const updateSelectedUser = React.useCallback(
    (user: TConversation) => {
      dispatch({
        type: "UPDATE_STATE",
        payload: { selectedUser: user },
      });
    },
    [dispatch]
  );

  const updateOnlineUsers = React.useCallback(
    (users: TConversation[]) => {
      dispatch({
        type: "UPDATE_STATE",
        payload: { onlineUsers: users },
      });
    },
    [dispatch]
  );

  const updateActiveTab = React.useCallback(
    (tab: State["activeTab"]) => {
      dispatch({
        type: "UPDATE_STATE",
        payload: { activeTab: tab },
      });
    },
    [dispatch]
  );

  /**
   * Enhanced Service Methods
   */

  // Fetch conversations
  const fetchConversations = useCallback(async () => {
    setLoading(true);
    try {
      const conversations = await conversationService.fetchConversations();
      dispatch({
        type: "UPDATE_STATE",
        payload: { conversations },
      });
    } catch (error) {
     
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  // Fetch online users with presence
  const fetchOnlineUsers = useCallback(async () => {
    setLoading(true);
    try {
      const presenceData = await presenceService.getOnlineUsers();
      setOnlineUsersList(presenceData);
    } catch (error) {
      console.error("Error fetching online users:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Get group conversations (Admin feature)
  const fetchGroupConversations = useCallback(async () => {
    setLoading(true);
    try {
      const groupConversations = await groupConversationService.fetchGroupConversations();
      dispatch({
        type: "UPDATE_STATE",
        payload: { groupConversations },
      });
    } catch (error) {
      console.error("Error fetching group conversations:", error);
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  // Create group conversation
  const createGroupConversation = useCallback(
    async (groupName: string, participants: string[]) => {
      setLoading(true);
      try {
        const newGroup = await groupConversationService.createGroupConversation({
          groupName,
          participants,
        });
        dispatch({
          type: "UPDATE_STATE",
          payload: {
            groupConversations: [...(state.groupConversations || []), newGroup],
          },
        });
        return newGroup;
      } catch (error) {
       
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [dispatch, state.groupConversations]
  );

  // Mark message as read
  const markAsRead = useCallback(
    async (conversationId: string, messageIds: string[]) => {
      try {
        await deliveryService.markAsRead(conversationId, messageIds);
      } catch (error) {
        console.error("Error marking as read:", error);
      }
    },
    []
  );

  // Initiate a call
  const initiateCall = useCallback(
    async (recipientId: string, callType: "voice" | "video") => {
      setLoading(true);
      try {
        const callData = await callService.initiateCall({
          type: callType,
          recipientId,
        });
        dispatch({
          type: "UPDATE_STATE",
          payload: {
            activeCall: {
              callId: callData.callId,
              type: callData.type as "voice" | "video",
              participant: callData.participant,
              startedAt: callData.startedAt,
            },
          },
        });
        return callData;
      } catch (error) {
        console.error("Error initiating call:", error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [dispatch]
  );

  // End call
  const endCall = useCallback(
    async (callId: string) => {
      try {
        await callService.endCall(callId);
        dispatch({
          type: "UPDATE_STATE",
          payload: { activeCall: null },
        });
      } catch (error) {
        console.error("Error ending call:", error);
      }
    },
    [dispatch]
  );

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    try {
      const notifications = await notificationService.fetchNotifications();
      return notifications;
    } catch (error) {
      console.error("Error fetching notifications:", error);
      return [];
    }
  }, []);

  // Get unread notification count
  const getUnreadCount = useCallback(async () => {
    try {
      return await notificationService.getUnreadCount();
    } catch (error) {
      console.error("Error getting unread count:", error);
      return 0;
    }
  }, []);

  return {
    state,
    messages,
    updateSearch,
    resetFilter,
    updateReceiverId,
    receiverId,
    updateIsChatSelect,
    updateIsSidebar,
    updateSelectedUser,
    selectedUser: state.selectedUser,
    onlineUsers,
    updateOnlineUsers,
    updateActiveTab,
    // New enhanced methods
    loading,
    fetchConversations,
    fetchOnlineUsers,
    onlineUsersList,
    fetchGroupConversations,
    createGroupConversation,
    markAsRead,
    initiateCall,
    endCall,
    fetchNotifications,
    getUnreadCount,
  };
};
