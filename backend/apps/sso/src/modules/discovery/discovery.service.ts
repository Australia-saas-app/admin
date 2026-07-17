import { Injectable } from '@nestjs/common';
import { JwtService } from '../../common/services/jwt.service';

@Injectable()
export class DiscoveryService {
  constructor(private readonly jwtService: JwtService) {}

  getOpenIdConfiguration() {
    return this.jwtService.getOpenIdConfiguration();
  }

  getJwks() {
    return this.jwtService.getJwks();
  }
}


