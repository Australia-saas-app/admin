import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from '../../entities/user.entity';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { JwtService } from '../../common/services/jwt.service';
import { FileStorageService } from '../../common/services/file-storage.service';
import { UserKycInitService } from './user-kyc-init.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService, JwtAuthGuard, JwtService, FileStorageService, UserKycInitService],
  exports: [UserService],
})
export class UserModule {}


