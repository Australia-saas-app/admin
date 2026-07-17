import { Controller, Get, Query, Param } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiQuery, ApiParam } from "@nestjs/swagger";
import { TeamService } from "./team.service";

@ApiTags("team")
@Controller("team")
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Get()
  @ApiOperation({
    summary: "Get all team members",
  })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  async getTeamMembers(
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 20,
  ) {
    return this.teamService.findAll(page, limit);
  }

  @Get("departments")
  @ApiOperation({ summary: "Get all existing departments" })
  async getDepartments() {
    const departments = await this.teamService.getDepartments();
    return { data: departments };
  }

  @Get("search/:name")
  @ApiOperation({ summary: "Search team members by name" })
  @ApiParam({ name: "name", description: "Search term" })
  async searchTeamMembers(@Param("name") name: string) {
    return this.teamService.search(name);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get specific team member details" })
  @ApiParam({ name: "id", description: "Team member ID" })
  async getTeamMemberDetails(@Param("id") id: string) {
    const member = await this.teamService.findOne(id);
    return {
      data: member,
    };
  }
}
