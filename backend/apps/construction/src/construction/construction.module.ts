import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConstructionController } from './construction.controller';
import { ConstructionServiceService } from './services/construction-service.service';
import { ConstructionCategoryService } from './services/construction-category.service';
import { ConstructionService } from './entities/construction-service.entity';
import { ConstructionCategory } from './entities/construction-category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ConstructionService, ConstructionCategory]),
  ],
  controllers: [ConstructionController],
  providers: [ConstructionServiceService, ConstructionCategoryService],
  exports: [ConstructionServiceService, ConstructionCategoryService],
})
export class ConstructionModule {}


