import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommissionController } from './commission.controller';
import { CommissionService } from './commission.service';
import { Commission } from '../entities/commission.entity';
import { Referral } from '../entities/referral.entity';
import { Affiliate } from '../entities/affiliate.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Commission, Referral, Affiliate]),
  ],
  controllers: [CommissionController],
  providers: [CommissionService],
})
export class CommissionModule {}