import { Module } from '@nestjs/common';
import { DiscoveryController } from './discovery.controller';
import { DiscoveryService } from './discovery.service';
import { JwtService } from '../../common/services/jwt.service';

@Module({
  controllers: [DiscoveryController],
  providers: [DiscoveryService, JwtService],
})
export class DiscoveryModule {}


