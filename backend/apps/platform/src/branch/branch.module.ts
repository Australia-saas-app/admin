import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BranchController } from "./branch.controller";
import { AdminBranchController } from "./branch-admin.controller";
import { BranchService } from "./branch.service";
import { Branch } from "../entities/branch.entity";
import { CommonModule } from "../common/common.module";

@Module({
  imports: [TypeOrmModule.forFeature([Branch]), CommonModule],
  controllers: [BranchController, AdminBranchController],
  providers: [BranchService],
  exports: [BranchService],
})
export class BranchModule {}
