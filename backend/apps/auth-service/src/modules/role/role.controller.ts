import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { RoleService } from './role.service';

@ApiTags('roles')
@Controller('auth/roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new role' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        permissions: { type: 'array', items: { type: 'string' } },
        description: { type: 'string' },
      },
    },
  })
  async createRole(@Body() body: { name: string; permissions: string[]; description?: string }) {
    return await this.roleService.createRole(body.name, body.permissions, body.description);
  }

  @Get()
  @ApiOperation({ summary: 'Get all roles' })
  async getRoles() {
    return await this.roleService.getRoles();
  }
}