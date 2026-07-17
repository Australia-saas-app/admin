import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from './services/jwt.service';
import { AdminAuthGuard } from './guards/admin-auth.guard';
import { SuperAdminGuard } from './guards/super-admin.guard';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [JwtService, AdminAuthGuard, SuperAdminGuard],
  exports: [JwtService, AdminAuthGuard, SuperAdminGuard],
})
export class CommonModule {}




