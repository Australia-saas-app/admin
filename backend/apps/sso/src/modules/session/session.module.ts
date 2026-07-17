import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionController } from './session.controller';
import { SessionService } from './session.service';
import { UserSession } from '../../entities/user-session.entity';
import { OAuthToken } from '../../entities/oauth-token.entity';
import { User } from '../../entities/user.entity';
import { Activity } from '../../entities/activity.entity';
import { AccessTokenGuard } from '../../common/guards/access-token.guard';
import { JwtService } from '../../common/services/jwt.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserSession, OAuthToken, User, Activity])],
  controllers: [SessionController],
  providers: [SessionService, AccessTokenGuard, JwtService],
})
export class SessionModule {}


