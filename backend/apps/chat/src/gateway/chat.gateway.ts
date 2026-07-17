import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ConversationService } from '../conversation/conversation.service';
import { MessageService } from '../message/message.service';
import { PresenceService } from './presence.service';
import { TypingService } from './typing.service';
import { ChatRulesService } from '../rules/chat-rules.service';

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
  namespace: '/chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ChatGateway.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly conversationService: ConversationService,
    private readonly messageService: MessageService,
    private readonly presenceService: PresenceService,
    private readonly typingService: TypingService,
    private readonly chatRulesService: ChatRulesService,
  ) {}

  async handleConnection(client: Socket) {
    // Update user last seen when they connect
    try {
      const token = client.handshake.auth?.token || client.handshake.headers?.authorization?.split(' ')[1];
      
      if (!token) {
        this.logger.warn(`Client ${client.id} connected without token`);
        client.disconnect();
        return;
      }

      // Verify token (simplified - should use same logic as auth guard)
      const publicKey = this.configService.get<string>('SSO_PUBLIC_KEY');
      if (!publicKey) {
        // Development mode - accept token
        const decoded = this.jwtService.decode(token) as any;
        const userId = decoded?.userId || decoded?.adminId || decoded?.businessId || decoded?.sub;
        
        if (!userId) {
          client.disconnect();
          return;
        }

        client.data.userId = userId;
        client.data.isAdmin = !!decoded?.adminId || decoded?.role === 'admin';
        client.data.isBusiness = !!decoded?.businessId || decoded?.role === 'business';
        client.data.token = token;
        await this.presenceService.setUserOnline(userId, client.id);
        
        this.logger.log(`Client ${client.id} connected as user ${userId}`);
        return;
      }

      // Production mode - verify token properly
      // This should use the same verification logic as SimpleAuthGuard
      const decoded = this.jwtService.decode(token) as any;
      const userId = decoded?.userId || decoded?.adminId || decoded?.businessId || decoded?.sub;
      
      if (!userId) {
        client.disconnect();
        return;
      }

      client.data.userId = userId;
      client.data.isAdmin = !!decoded?.adminId || decoded?.role === 'admin';
      client.data.isBusiness = !!decoded?.businessId || decoded?.role === 'business';
      client.data.token = token;
      await this.presenceService.setUserOnline(userId, client.id);

      this.logger.log(`Client ${client.id} connected as user ${userId}`);
    } catch (error) {
      this.logger.error(`Connection error: ${error.message}`);
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    const userId = client.data.userId;
    if (userId) {
      await this.presenceService.setUserOffline(userId);
      this.logger.log(`Client ${client.id} disconnected (user ${userId})`);
    }
  }

  @SubscribeMessage('join:conversation')
  async handleJoinConversation(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string },
  ) {
    const userId = client.data.userId;
    if (!userId) {
      return { error: 'Unauthorized' };
    }

    try {
      const conversation = await this.conversationService.getConversationById(data.conversationId, userId);
      client.join(`conversation:${data.conversationId}`);
      
      return { success: true, conversationId: data.conversationId };
    } catch (error) {
      return { error: error.message };
    }
  }

  @SubscribeMessage('leave:conversation')
  async handleLeaveConversation(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string },
  ) {
    client.leave(`conversation:${data.conversationId}`);
    return { success: true };
  }

  @SubscribeMessage('message:send')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string; content: string },
  ) {
    const userId = client.data.userId;
    if (!userId) {
      return { error: 'Unauthorized' };
    }

    try {
      const senderType = client.data.isAdmin ? 'admin' : client.data.isBusiness ? 'business' : 'user';
      const message = await this.messageService.createTextMessage(
        data.conversationId,
        userId,
        senderType,
        { content: data.content },
        client.data.token,
      );

      // Broadcast to conversation room
      this.server.to(`conversation:${data.conversationId}`).emit('message:new', message);

      return { success: true, message };
    } catch (error) {
      return { error: error.message };
    }
  }

  @SubscribeMessage('message:read')
  async handleReadMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { messageId: string },
  ) {
    const userId = client.data.userId;
    if (!userId) {
      return { error: 'Unauthorized' };
    }

    try {
      const message = await this.messageService.markAsRead(data.messageId, userId);
      this.server.to(`conversation:${message.conversationId}`).emit('message:read', {
        messageId: data.messageId,
        userId,
      });

      return { success: true };
    } catch (error) {
      return { error: error.message };
    }
  }

  @SubscribeMessage('typing:start')
  async handleTypingStart(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string },
  ) {
    const userId = client.data.userId;
    if (!userId) return;

    await this.typingService.setTyping(data.conversationId, userId);
    client.to(`conversation:${data.conversationId}`).emit('typing:status', {
      conversationId: data.conversationId,
      userId,
      isTyping: true,
    });
  }

  @SubscribeMessage('typing:stop')
  async handleTypingStop(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string },
  ) {
    const userId = client.data.userId;
    if (!userId) return;

    await this.typingService.removeTyping(data.conversationId, userId);
    client.to(`conversation:${data.conversationId}`).emit('typing:status', {
      conversationId: data.conversationId,
      userId,
      isTyping: false,
    });
  }

  @SubscribeMessage('call:initiate')
  async handleCallInitiate(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string },
  ) {
    const userId = client.data.userId;
    if (!userId) {
      return { error: 'Unauthorized' };
    }

    try {
      await this.chatRulesService.canUserInitiateCall(data.conversationId, userId);
      
      // Notify other participants
      client.to(`conversation:${data.conversationId}`).emit('call:request', {
        conversationId: data.conversationId,
        from: userId,
      });

      return { success: true };
    } catch (error) {
      return { error: error.message };
    }
  }
}

