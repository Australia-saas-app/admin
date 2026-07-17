import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '../services/jwt.service';
import { User } from '../../entities/user.entity';

export interface AuthContext {
  user: User;
  scope: string;
  clientId?: string;
}

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing bearer token');
    }

    const token = authHeader.split(' ')[1];
    const payload = this.jwtService.verifyAccessToken(token);
    console.log("payload--",payload);
    
    if (!payload) {
      throw new UnauthorizedException('Invalid or expired access token');
    }

    const user = await this.userRepository.findOne({
      where: { userId: payload.userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    (request as Request & { auth?: AuthContext }).auth = {
      user,
      scope: payload.scope,
      clientId: payload.clientId,
    };

    return true;
  }
}

