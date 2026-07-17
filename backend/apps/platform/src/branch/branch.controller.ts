import { Controller, Get, Query, Param } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiQuery, ApiParam } from "@nestjs/swagger";
import { BranchService } from "./branch.service";

@ApiTags("branches")
@Controller("branches")
export class BranchController {
  constructor(private readonly branchService: BranchService) {}

  @Get()
  @ApiOperation({
    summary: "Get all branches/locations",
  })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  async getBranches(
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 20,
  ) {
    return this.branchService.findAll(page, limit);
  }

  @Get("search/:name")
  @ApiOperation({ summary: "Search branches by name" })
  @ApiParam({ name: "name", description: "Search term" })
  async searchBranches(@Param("name") name: string) {
    return this.branchService.search(name);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get specific branch details" })
  @ApiParam({ name: "id", description: "Branch ID" })
  async getBranchDetails(@Param("id") id: string) {
    const branch = await this.branchService.findOne(id);
    return {
      data: branch,
    };
  }
}
