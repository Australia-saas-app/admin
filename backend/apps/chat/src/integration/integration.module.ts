import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { OrderClientService } from './order-client.service';
import { FileStorageClientService } from './file-storage-client.service';
import { IntegrationController } from './integration.controller';
import { ProfileClientService } from './profile-client.service';

@Module({
  imports: [ConfigModule, HttpModule],
  controllers: [IntegrationController],
  providers: [
    OrderClientService,
    FileStorageClientService,
    ProfileClientService,
  ],
  exports: [
    OrderClientService,
    FileStorageClientService,
    ProfileClientService,
  ],
})
export class IntegrationModule {}

