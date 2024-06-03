// import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
// import { RolePermissionsService } from './role-permissions.service';
// import { CreateRolePermissionDto } from './dto/create-role-permission.dto';
// import { UpdateRolePermissionDto } from './dto/update-role-permission.dto';

// @Controller('role-permissions')
// export class RolePermissionsController {
// }

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { RolesAndPermissionsService } from './role-permissions.service';
import { CreateRolePermissionDto } from './dto/create-role-permission.dto';
import { UpdateRolePermissionDto } from './dto/update-role-permission.dto';
import { PermissionsGuard } from '../auth/permissions.guard';
import { RolesAndPermissionsPermissionsKeys } from '../role-permissions/roles-permissions-config.service';
import { ValidatePermissionRolesPipe } from '../pipes/validate-permission-roles.pipe';
import { RolePermission } from './entities/role-permission.entity';
import { User } from '../user/entities/user.entity';
import { PermissionRoleService } from 'src/permission/permission-role.service';

@Controller('role-permissions')
export class RolePermissionsController {
  constructor(
    private readonly rolePermissionsService: PermissionRoleService,
    private readonly rolesAndPermissionsService: RolesAndPermissionsService,
  ) {}

  @Get()
  @UseGuards(PermissionsGuard(() => RolesAndPermissionsPermissionsKeys.ManagePermissions))
  async loadRoleAndPermissions() {
    const perms = await this.rolesAndPermissionsService.getPermissionWithRoleAssoc();
    const systemRoles = await this.rolesAndPermissionsService.getRolesByCondition({ isSystem: true });
    const systemRolesIds = systemRoles.map(role => role.id);
    return perms.map(perm => {
      perm.permissionRoles = perm.permissionRoles.filter(pr => !systemRolesIds.includes(pr.roleId));
      return perm;
    });
  }

  @Post()
  @UseGuards(PermissionsGuard(() => RolesAndPermissionsPermissionsKeys.ManagePermissions))
  async setRoleAndPermissions(@Body(ValidatePermissionRolesPipe) prs: RolePermission[]) {
    for (const pr of prs) {
      const isDef = await this.checkIfIsDefault(pr.id);
      if (!isDef) {
        await this.rolePermissionsService.setPermissionRoleAssoc(pr);
      }
    }
    return this.loadRoleAndPermissions();
  }

  @Get('check/:keys')
  async check(@User() user: User, @Param('keys') keys: string) {
    const keysArray = keys.split(',');
    return this.rolesAndPermissionsService.getPermissionsByKeysAndRoles(keysArray, user.roles);
  }

  async checkIfIsDefault(id: number): Promise<boolean> {
    const pr = await this.rolePermissionsService.findOne({
      where: {
        id,
        isDefault: true,
      },
    });
    return !!pr;
  }
}
