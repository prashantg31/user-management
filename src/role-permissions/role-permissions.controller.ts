// import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
// import { RolePermissionsService } from './role-permissions.service';
// import { CreateRolePermissionDto } from './dto/create-role-permission.dto';
// import { UpdateRolePermissionDto } from './dto/update-role-permission.dto';

// @Controller('role-permissions')
// export class RolePermissionsController {
//   constructor(private readonly rolePermissionsService: RolePermissionsService) {}

//   @Post()
//   create(@Body() createRolePermissionDto: CreateRolePermissionDto) {
//     return this.rolePermissionsService.create(createRolePermissionDto);
//   }

//   @Get()
//   findAll() {
//     return this.rolePermissionsService.findAll();
//   }

//   @Get(':id')
//   findOne(@Param('id') id: string) {
//     return this.rolePermissionsService.findOne(+id);
//   }

//   @Patch(':id')
//   update(@Param('id') id: string, @Body() updateRolePermissionDto: UpdateRolePermissionDto) {
//     return this.rolePermissionsService.update(+id, updateRolePermissionDto);
//   }

//   @Delete(':id')
//   remove(@Param('id') id: string) {
//     return this.rolePermissionsService.remove(+id);
//   }
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
import { RolePermissionsService } from './role-permissions.service';
import { CreateRolePermissionDto } from './dto/create-role-permission.dto';
import { UpdateRolePermissionDto } from './dto/update-role-permission.dto';
import { PermissionsGuard } from '../auth/permissions.guard';
import { RolesAndPermissionsPermissionsKeys } from '../auth/permissions-keys';
import { ValidatePermissionRolesPipe } from './pipes/validate-permission-roles.pipe';
import { PermissionRoleEntity } from './entities/permission-role.entity';
import { User } from '../user/entities/user.entity';

@Controller('role-permissions')
export class RolePermissionsController {
  constructor(
    private readonly rolePermissionsService: RolePermissionsService,
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
  async setRoleAndPermissions(@Body(ValidatePermissionRolesPipe) prs: PermissionRoleEntity[]) {
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
