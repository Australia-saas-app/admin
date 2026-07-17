import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgencyManagementController } from './agency-management.controller';
import { AgencyManagementService } from './agency-management.service';
import { User } from '../entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [AgencyManagementController],
  providers: [AgencyManagementService],
  exports: [AgencyManagementService],
})
export class AgencyManagementModule {}

