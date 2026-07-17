import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PackagesController } from './packages.controller';
import { PackagesService } from './packages.service';
import { TravelPackage, TravelPackageSchema } from './schemas/travel-package.schema';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TravelPackage.name, schema: TravelPackageSchema },
    ]),
  ],
  controllers: [PackagesController],
  providers: [PackagesService, JwtAuthGuard],
  exports: [PackagesService],
})
export class PackagesModule {}

