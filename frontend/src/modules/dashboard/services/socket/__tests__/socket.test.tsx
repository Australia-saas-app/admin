/**
 * Socket notification system tests
 * 
 * This file demonstrates how to test the refactored socket notification system
 */

import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import { SocketContextProvider } from '../SocketContext';
import { useNotifications, useOrderNotifications } from '../hooks';
import { NotificationManager } from '../notificationManager';
import { socketService } from '../socketService';
import { notificationApi } from '../notificationApi';
import { TNotification } from '../type';

// Mock the socket service
jest.mock('../socketService', () => ({
  socketService: {
    connect: jest.fn(),
    disconnect: jest.fn(),
    isConnected: jest.fn().mockReturnValue(true),
    getSocket: jest.fn(),
    emit: jest.fn(),
  },
}));

// Mock the notification API
jest.mock('../notificationApi', () => ({
  notificationApi: {
    fetchNotifications: jest.fn().mockResolvedValue({
      success: true,
      data: {
        notifications: [
          {
            id: 'test-1',
            type: 'order',
            title: 'Test Notification',
            content: 'This is a test notification',
            userId: 'admin',
            priority: 'medium',
            createdAt: new Date().toISOString(),
            read: false,
          },
        ],
      },
    }),
    fetchUnreadCount: jest.fn().mockResolvedValue(1),
    markAsRead: jest.fn().mockResolvedValue(true),
    markAllAsRead: jest.fn().mockResolvedValue(true),
  },
}));

// Test component that uses the notifications hook
const TestComponent = () => {
  const { notifications, unreadCount, isConnected, markAsRead } = useNotifications();

  return (
    <div>
      <div data-testid="connection-status">
        {isConnected ? 'Connected' : 'Disconnected'}
      </div>
      <div data-testid="unread-count">{unreadCount}</div>
      <ul>
        {notifications.map((notification) => (
          <li key={notification.id} data-testid={`notification-${notification.id}`}>
            <h3>{notification.title}</h3>
            <p>{notification.content}</p>
            <button onClick={() => markAsRead(notification.id)}>Mark as Read</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Test component that uses the order notifications hook
const OrderNotificationsComponent = () => {
  const { notifications } = useOrderNotifications();

  return (
    <div>
      <div data-testid="order-count">{notifications.length}</div>
      <ul>
        {notifications.map((notification) => (
          <li key={notification.id} data-testid={`order-${notification.id}`}>
            {notification.title}
          </li>
        ))}
      </ul>
    </div>
  );
};

describe('Socket Notification System', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('SocketContextProvider initializes correctly', async () => {
    render(
      <SocketContextProvider userId="admin">
        <TestComponent />
      </SocketContextProvider>
    );

    // Check that socket service was called with correct params
    expect(socketService.connect).toHaveBeenCalledWith(
      'admin',
      expect.objectContaining({
        onConnect: expect.any(Function),
        onDisconnect: expect.any(Function),
        onConnectError: expect.any(Function),
        onNotification: expect.any(Function),
        onUnreadCountUpdate: expect.any(Function),
        onNotificationUpdate: expect.any(Function),
      })
    );

    // Check that API was called to fetch initial data
    await waitFor(() => {
      expect(notificationApi.fetchNotifications).toHaveBeenCalled();
      expect(notificationApi.fetchUnreadCount).toHaveBeenCalled();
    });

    // Check that the component renders with initial data
    expect(screen.getByTestId('connection-status')).toHaveTextContent('Connected');
    
    // Wait for the unread count to be updated
    await waitFor(() => {
      expect(screen.getByTestId('unread-count')).toHaveTextContent('1');
    });
  });

  test('NotificationManager handles state correctly', () => {
    const manager = new NotificationManager();
    
    // Initial state
    expect(manager.getState()).toEqual({
      notifications: [],
      unreadCount: 0,
    });

    // Add notification
    const notification: TNotification = {
      id: 'test-1',
      type: 'order',
      title: 'Test Notification',
      content: 'This is a test notification',
      userId: 'admin',
      priority: 'medium',
      createdAt: new Date().toISOString(),
      read: false,
    };

    manager.addNotification(notification);
    
    // Check state after adding
    expect(manager.getState().notifications).toHaveLength(1);
    expect(manager.getState().unreadCount).toBe(1);

    // Mark as read
    manager.markAsRead('test-1');
    
    // Check state after marking as read
    expect(manager.getState().unreadCount).toBe(0);
    expect(manager.getState().notifications[0].read).toBe(true);

    // Clear notifications
    manager.clearNotifications();
    
    // Check state after clearing
    expect(manager.getState().notifications).toHaveLength(0);
    expect(manager.getState().unreadCount).toBe(0);
  });

  test('useOrderNotifications filters correctly', async () => {
    // Setup with mixed notification types
    const mockNotifications = [
      {
        id: 'order-1',
        type: 'order',
        title: 'Order Notification',
        content: 'This is an order notification',
        userId: 'admin',
        priority: 'medium',
        createdAt: new Date().toISOString(),
        read: false,
      },
      {
        id: 'message-1',
        type: 'message',
        title: 'Message Notification',
        content: 'This is a message notification',
        userId: 'admin',
        priority: 'low',
        createdAt: new Date().toISOString(),
        read: false,
      },
    ];

    // Mock API to return mixed notifications
    (notificationApi.fetchNotifications as jest.Mock).mockResolvedValueOnce({
      success: true,
      data: {
        notifications: mockNotifications,
      },
    });

    render(
      <SocketContextProvider userId="admin">
        <OrderNotificationsComponent />
      </SocketContextProvider>
    );

    // Wait for the component to render with filtered notifications
    await waitFor(() => {
      expect(screen.getByTestId('order-count')).toHaveTextContent('1');
    });

    // Check that only order notifications are shown
    expect(screen.queryByTestId('order-order-1')).toBeInTheDocument();
    expect(screen.queryByTestId('order-message-1')).not.toBeInTheDocument();
  });

  test('markAsRead calls API and updates state', async () => {
    render(
      <SocketContextProvider userId="admin">
        <TestComponent />
      </SocketContextProvider>
    );

    // Wait for notifications to load
    await waitFor(() => {
      expect(screen.getByTestId('notification-test-1')).toBeInTheDocument();
    });

    // Click the mark as read button
    const markAsReadButton = screen.getByText('Mark as Read');
    act(() => {
      markAsReadButton.click();
    });

    // Check that API was called
    await waitFor(() => {
      expect(notificationApi.markAsRead).toHaveBeenCalledWith('test-1', 'admin');
    });

    // Check that unread count was updated
    await waitFor(() => {
      expect(screen.getByTestId('unread-count')).toHaveTextContent('0');
    });
  });
});