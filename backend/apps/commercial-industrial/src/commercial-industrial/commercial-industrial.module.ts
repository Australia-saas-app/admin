import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommercialIndustrialController } from './commercial-industrial.controller';
import { CommercialIndustrialServiceService } from './services/commercial-industrial-service.service';
import { CommercialIndustrialCategoryService } from './services/commercial-industrial-category.service';
import { CommercialIndustrialService } from './entities/commercial-industrial-service.entity';
import { CommercialIndustrialCategory } from './entities/commercial-industrial-category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CommercialIndustrialService,
      CommercialIndustrialCategory,
    ]),
  ],
  controllers: [CommercialIndustrialController],
  providers: [
    CommercialIndustrialServiceService,
    CommercialIndustrialCategoryService,
  ],
  exports: [
    CommercialIndustrialServiceService,
    CommercialIndustrialCategoryService,
  ],
})
export class CommercialIndustrialModule {}




