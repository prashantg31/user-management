// import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
// import { RoleService } from './role.service';
// import { CreateRoleDto } from './dto/create-role.dto';
// import { UpdateRoleDto } from './dto/update-role.dto';
import {
  Body,
  Controller, Delete,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Patch,
  Post, Put, Query,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
// import { PermissionsGuard } from '../guards/permissions.guard';
// import { ForbidDefaultRoleActionGuard } from '../guards/forbid-default-role-action.guard';
// import { RolesAndPermissionsPermissionsKeys } from '../services/roles-and-permissions-config.service';
// import { Role } from '../role/entities/role.entity';
// import { RolesService } from '../services/roles.service';
// import { ValidateRolePipe } from '../pipes/validate-role.pipe';
// import { RolesAndPermissionsService } from '../services/roles-and-permissions.service';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PermissionsGuard } from '../auth/permissions.guard';
import { RolesAndPermissionsPermissionsKeys } from '../auth/permissions-keys';
import { ForbidDefaultRoleActionGuard } from '../auth/forbid-default-role-action.guard';
import { ValidateRolePipe } from './pipes/validate-role.pipe';
import { Role } from './entities/role.entity';

@Controller('role')
export class RoleController {
  constructor(
    private readonly roleService: RoleService,
    private readonly rolesAndPermissionsService: RolesAndPermissionsService,
  ) {}

  @Get()
  @UseGuards(PermissionsGuard(() => RolesAndPermissionsPermissionsKeys.ViewRole))
  async loadRoles(@Query('name') name: string): Promise<Role[]> {
    if (name) {
      return this.roleService.getRoles({ name });
    } else {
      return this.roleService.getAll(false);
    }
  }

  @Post()
  @UseGuards(PermissionsGuard(() => RolesAndPermissionsPermissionsKeys.AddRole))
  async createRole(@Body(new ValidateRolePipe()) role: Role): Promise<Role> {
    role.isDefault = false;
    try {
      const roles = await this.rolesAndPermissionsService.registerRoles([role]).toPromise();
      return roles[0];
    } catch (e: any) {
      if (e.code === 'ER_DUP_ENTRY') {
        throw new UnprocessableEntityException('Role already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  @Get(':id')
  @UseGuards(PermissionsGuard(() => RolesAndPermissionsPermissionsKeys.ViewRole))
  async loadRole(@Param('id') id: number): Promise<Role> {
    const role = await this.roleService.getRole({ id });
    if (!role) {
      throw new NotFoundException();
    }
    return role;
  }

  @Delete(':id')
  @UseGuards(PermissionsGuard(() => RolesAndPermissionsPermissionsKeys.RemoveRole))
  @UseGuards(ForbidDefaultRoleActionGuard)
  async removeRole(@Param('id') id: string): Promise<Role> {
    return await this.roleService.removeRole(+id);
  }

  @Patch(':id')
  @UseGuards(PermissionsGuard(() => RolesAndPermissionsPermissionsKeys.EditRole))
  @UseGuards(ForbidDefaultRoleActionGuard)
  async updateRole(
    @Param('id') id: string,
    @Body(new ValidateRolePipe()) role: Role,
  ): Promise<Role> {
    role.id = parseInt(id, 10);
    role.isDefault = false;
    try {
      return await this.roleService.updateRole(new Role(role));
    } catch (e: any) {
      if (e.code === 'ER_DUP_ENTRY') {
        throw new UnprocessableEntityException('Role already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
