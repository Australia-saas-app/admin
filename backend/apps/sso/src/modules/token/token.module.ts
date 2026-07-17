import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenController } from './token.controller';
import { TokenService } from './token.service';
import { OAuthClient } from '../../entities/oauth-client.entity';
import { OAuthToken } from '../../entities/oauth-token.entity';
import { User } from '../../entities/user.entity';
import { UserSession } from '../../entities/user-session.entity';
import { MfaSecret } from '../../entities/mfa-secret.entity';
import { UserConsent } from '../../entities/user-consent.entity';
import { JwtService } from '../../common/services/jwt.service';
import { OtpUtil } from '../../common/utils/otp.util';
import { RedisModule, REDIS_CLIENT } from '../../redis/redis.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OAuthClient,
      OAuthToken,
      User,
      UserSession,
      MfaSecret,
      UserConsent,
    ]),
    RedisModule,
  ],
  controllers: [TokenController],
  providers: [TokenService, JwtService, OtpUtil],
  exports: [TokenService, JwtService, OtpUtil],
})
export class TokenModule {}


