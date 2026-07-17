import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
  Query,
} from "@nestjs/common";
import { Request } from "express";
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from "@nestjs/swagger";
import { TeamService } from "../team/team.service";
import { PlatformAuthGuard } from "../common/guards/platform-auth.guard";

@ApiTags("admin-team")
@Controller("admin/team")
@UseGuards(PlatformAuthGuard)
export class AdminTeamController {
  constructor(private readonly teamService: TeamService) {}

  private getAdminId(req: Request): string | undefined {
    return (req as any).admin?.adminId;
  }

  @Get()
  @ApiOperation({ summary: "Get all team members" })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiBearerAuth()
  async getTeamMembers(
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 20,
  ) {
    return this.teamService.findAllAdmin(page, limit);
  }

  @Get("departments")
  @ApiOperation({ summary: "Get all existing departments" })
  @ApiBearerAuth()
  async getDepartments() {
    const departments = await this.teamService.getDepartments();
    return { data: departments };
  }

  @Post()
  @ApiOperation({ summary: "Create a new team member" })
  @ApiBearerAuth()
  async createTeamMember(
    @Body()
    createTeamDto: {
      firstName: string;
      lastName: string;
      position: string;
      photoUrl?:string;
      bio?: string;
      email?: string;
      department?: string;
      isVisible?: boolean;
      linkedinUrl?: string;
      branchId?: string;
      managerId?: string;
      displayOrder?: number;
      salary?: number;
    },
    @Req() req: Request,
  ) {
    const teamMember = await this.teamService.create({
      firstName: createTeamDto.firstName,
      lastName: createTeamDto.lastName,
      position: createTeamDto.position,
      bio: createTeamDto.bio,
      photoUrl: createTeamDto.photoUrl,
      linkedinUrl: createTeamDto.linkedinUrl,
      displayOrder: createTeamDto.displayOrder,
      branchId: createTeamDto.branchId,
      managerId: createTeamDto.managerId,
      email: createTeamDto.email,
      salary: createTeamDto.salary,
      department: createTeamDto.department || 'General',
      isVisible: createTeamDto.isVisible,
    });
    return {
      message: "Team member created successfully",
      data: teamMember,
    };
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update team member details" })
  @ApiParam({ name: "id", description: "Team member ID" })
  @ApiBearerAuth()
  async updateTeamMember(
    @Param("id") id: string,
    @Body()
    updateTeamDto: {
      firstName?: string;
      lastName?: string;
      position?: string;
      bio?: string;
      image?: string;
      email?: string;
      department?: string;
    },
  ) {
    const teamMember = await this.teamService.update(id, updateTeamDto);
    return {
      message: "Team member updated successfully",
      data: teamMember,
    };
  }

  @Patch(":id/reorder")
  @ApiOperation({ summary: "Reorder team member position" })
  @ApiParam({ name: "id", description: "Team member ID" })
  @ApiBearerAuth()
  async reorderTeamMember(
    @Param("id") id: string,
    @Body() reorderDto: { direction: "up" | "down" },
  ) {
    const teamMember = await this.teamService.reorder(id, reorderDto.direction);
    return {
      message: "Team member reordered successfully",
      data: teamMember,
    };
  }

  @Patch(":id/visibility")
  @ApiOperation({ summary: "Toggle team member visibility" })
  @ApiParam({ name: "id", description: "Team member ID" })
  @ApiBearerAuth()
  async toggleTeamVisibility(@Param("id") id: string) {
    const teamMember = await this.teamService.toggleVisibility(id);
    return {
      message: "Team member visibility toggled successfully",
      data: teamMember,
    };
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a team member" })
  @ApiParam({ name: "id", description: "Team member ID" })
  @ApiBearerAuth()
  async deleteTeamMember(@Param("id") id: string) {
    await this.teamService.remove(id);
    return { message: "Team member deleted successfully" };
  }
}
