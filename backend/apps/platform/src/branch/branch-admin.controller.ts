import {
  Controller,
  Post,
  Patch,
  Get,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { Request } from "express";
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from "@nestjs/swagger";
import { BranchService } from "./branch.service";
import { PlatformAuthGuard } from "../common/guards/platform-auth.guard";
import { CreateBranchDto, UpdateBranchDto } from "./dto/branch.dto";

@ApiTags("admin-branches")
@Controller("admin/branches")
@UseGuards(PlatformAuthGuard)
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class AdminBranchController {
  constructor(private readonly branchService: BranchService) {}

  private getAdminId(req: Request): string | undefined {
    return (req as any).admin?.adminId;
  }

  @Get()
  @ApiOperation({ summary: "Get all branches (Admin)" })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiBearerAuth()
  async getAllBranches(
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 20,
  ) {
    return this.branchService.findAllAdmin(Number(page), Number(limit));
  }

  @Post()
  @ApiOperation({ summary: "Create a new branch/location" })
  @ApiBearerAuth()
  async createBranch(
    @Body() createBranchDto: CreateBranchDto,
    @Req() req: Request,
  ) {
    const branch = await this.branchService.create({
      ...createBranchDto,
      createdBy: this.getAdminId(req),
    });
    return {
      message: "Branch created successfully",
      data: branch,
    };
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update branch details" })
  @ApiParam({ name: "id", description: "Branch ID" })
  @ApiBearerAuth()
  async updateBranch(
    @Param("id") id: string,
    @Body() updateBranchDto: UpdateBranchDto,
  ) {
    const branch = await this.branchService.update(id, updateBranchDto);
    return {
      message: "Branch updated successfully",
      data: branch,
    };
  }

  @Patch(":id/visibility")
  @ApiOperation({ summary: "Toggle branch visibility" })
  @ApiParam({ name: "id", description: "Branch ID" })
  @ApiBearerAuth()
  async toggleBranchVisibility(@Param("id") id: string) {
    const branch = await this.branchService.toggleVisibility(id);
    return {
      message: "Branch visibility toggled successfully",
      data: branch,
    };
  }

  @Patch(":id/reorder")
  @ApiOperation({ summary: "Reorder branch position" })
  @ApiParam({ name: "id", description: "Branch ID" })
  @ApiBearerAuth()
  async reorderBranch(
    @Param("id") id: string,
    @Body() reorderDto: { direction: "up" | "down" },
  ) {
    const branch = await this.branchService.reorder(id, reorderDto.direction);
    return {
      message: "Branch reordered successfully",
      data: branch,
    };
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a branch" })
  @ApiParam({ name: "id", description: "Branch ID" })
  @ApiBearerAuth()
  async deleteBranch(@Param("id") id: string) {
    await this.branchService.remove(id);
    return { message: "Branch deleted successfully" };
  }
}
