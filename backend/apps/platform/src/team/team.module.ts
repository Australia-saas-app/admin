import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TeamController } from "./team.controller";
import { AdminTeamController } from "./team-admin.controller";
import { TeamService } from "./team.service";
import { Employee } from "../entities/employee.entity";
import { Branch } from "../entities/branch.entity";
import { CommonModule } from "../common/common.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Employee, Branch]),
    CommonModule,
  ],
  controllers: [TeamController, AdminTeamController],
  providers: [TeamService],
  exports: [TeamService],
})
export class TeamModule {}