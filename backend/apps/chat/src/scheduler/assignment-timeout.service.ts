import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Conversation } from '../entities/conversation.entity';
import { PresenceService } from '../gateway/presence.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AssignmentTimeoutService {
  private readonly logger = new Logger(AssignmentTimeoutService.name);
  private readonly adminTimeoutMinutes: number;

  constructor(
    @InjectRepository(Conversation) private conversationRepository: Repository<Conversation>,
    private readonly presenceService: PresenceService,
    private readonly configService: ConfigService,
  ) {
    this.adminTimeoutMinutes = Number(
      this.configService.get('ADMIN_TIMEOUT_MINUTES', 10),
    );
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  async checkAdminTimeouts() {
    this.logger.log('Checking admin timeouts...');

    const assignedConversations = await this.conversationRepository
      .createQueryBuilder('conversation')
      .where('conversation.assignedAdminId IS NOT NULL')
      .andWhere('conversation.status = :status', { status: 'active' })
      .getMany();

    for (const conversation of assignedConversations) {
      if (!conversation.assignedAdminId) continue;

      const isActive = await this.presenceService.isAdminActive(conversation.assignedAdminId);

      if (!isActive) {
        conversation.assignedAdminId = undefined;
        await this.conversationRepository.save(conversation);

        this.logger.log(
          `Unassigned conversation ${conversation.id} from inactive admin ${conversation.assignedAdminId}`,
        );
      }
    }
  }
}

