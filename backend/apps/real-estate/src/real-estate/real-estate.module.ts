import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RealEstateController } from './real-estate.controller';
import { RealEstatePropertyService } from './services/real-estate-property.service';
import { RealEstateCategoryService } from './services/real-estate-category.service';
import { RealEstateProperty } from './entities/real-estate-property.entity';
import { RealEstateCategory } from './entities/real-estate-category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([RealEstateProperty, RealEstateCategory]),
  ],
  controllers: [RealEstateController],
  providers: [RealEstatePropertyService, RealEstateCategoryService],
  exports: [RealEstatePropertyService, RealEstateCategoryService],
})
export class RealEstateModule {}


