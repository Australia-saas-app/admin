import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { FileManagementController } from './file-management.controller';
import { FileManagementService } from './file-management.service';

@Module({
  imports: [ConfigModule, HttpModule],
  controllers: [FileManagementController],
  providers: [FileManagementService],
  exports: [FileManagementService],
})
export class FileManagementModule {}