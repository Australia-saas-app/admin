import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MenuManagementController } from "./menu-management.controller";
import { MenuManagementService } from "./menu-management.service";
import { Blog } from "../entities/blog.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Blog])],
  controllers: [MenuManagementController],
  providers: [MenuManagementService],
  exports: [MenuManagementService],
})
export class MenuManagementModule {}
