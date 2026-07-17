import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { UserSession } from '../../entities/user-session.entity';
import { OAuthToken } from '../../entities/oauth-token.entity';
import { Activity, ActivityType } from '../../entities/activity.entity';
import { AuthContext } from '../../common/guards/access-token.guard';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(UserSession)
    private readonly sessionRepository: Repository<UserSession>,
    @InjectRepository(OAuthToken)
    private readonly tokenRepository: Repository<OAuthToken>,
    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>,
  ) {}

  async listSessions(user: User, currentSessionId: string) {
    const sessions = await this.sessionRepository.find({
      where: { user: { id: user.id } },
      relations: { user: true, client: true },
      order: { lastSeenAt: 'DESC' },
    });

    return {
      currentSessionId,
      sessions: sessions.map((session) => ({
        id: session.id,
        device_id: session.deviceId,
        device_name: session.deviceName,
        ip_address: session.ipAddress,
        user_agent: session.userAgent,
        active: session.active,
        last_seen_at: session.lastSeenAt,
        created_at: session.createdAt,
        terminated_at: session.terminatedAt,
      })),
    };
  }

  async revokeSession(sessionId: string, auth: AuthContext) {
    const session = await this.sessionRepository.findOne({
      where: { id: sessionId },
      relations: { user: true },
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    if (session.user.id !== auth.user.id) {
      throw new ForbiddenException('You cannot revoke this session');
    }

    session.active = false;
    session.terminatedAt = new Date();
    session.terminationReason = 'user_revoked';

    await this.sessionRepository.save(session);

    await this.tokenRepository
      .createQueryBuilder()
      .update()
      .set({ revoked: true, revokedAt: new Date() })
      .where('session_id = :sessionId', { sessionId })
      .andWhere('revoked = :revoked', { revoked: false })
      .execute();

    return { success: true };
  }

  async logActivity(
    userId: string,
    type: ActivityType,
    description?: string,
    ipAddress?: string,
    userAgent?: string,
    metadata?: any,
  ): Promise<Activity> {
    const activity = this.activityRepository.create({
      userId,
      type,
      description,
      ipAddress,
      userAgent,
      metadata,
    });

    return await this.activityRepository.save(activity);
  }

  async getUserActivities(userId: string, page: number = 1, limit: number = 20): Promise<any> {
    const skip = (page - 1) * limit;
    const [activities, total] = await this.activityRepository.findAndCount({
      where: { userId },
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    return {
      data: activities,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}


