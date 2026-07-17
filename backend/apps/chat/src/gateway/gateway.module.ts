import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ChatGateway } from './chat.gateway';
import { PresenceService } from './presence.service';
import { TypingService } from './typing.service';
import { ConversationModule } from '../conversation/conversation.module';
import { MessageModule } from '../message/message.module';
import { RulesModule } from '../rules/rules.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        publicKey: configService.get<string>('SSO_PUBLIC_KEY'),
        verifyOptions: {
          algorithms: ['RS256'],
          issuer: configService.get<string>('SSO_ISSUER'),
        },
      }),
      inject: [ConfigService],
    }),
    forwardRef(() => ConversationModule),
    forwardRef(() => MessageModule),
    RulesModule,
  ],
  providers: [ChatGateway, PresenceService, TypingService],
  exports: [PresenceService, TypingService],
})
export class GatewayModule {}

