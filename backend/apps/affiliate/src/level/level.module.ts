import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AffiliateLevelController } from './level.controller';
import { AffiliateLevelService } from './level.service';
import { Affiliate } from '../entities/affiliate.entity';
import { AffiliateLevel } from '../entities/affiliate-level.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Affiliate,
      AffiliateLevel,
    ]),
    AuthModule,
  ],
  controllers: [AffiliateLevelController],
  providers: [AffiliateLevelService],
})
export class LevelModule {}