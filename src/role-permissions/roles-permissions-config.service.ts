import { Injectable } from '@nestjs/common';
import { RolesAndPermissionsConfig } from './roles-permissions-config.interface';
import { Role } from 'src/role/entities/role.entity';
import { Permission } from 'src/permission/entities/permission.entity';

export enum RolesAndPermissionsPermissionsKeys {
  ViewRole = 'RolesAndPermissionsViewRole',
  AddRole = 'RolesAndPermissionsAddRole',
  EditRole = 'RolesAndPermissionsEditRole',
  RemoveRole = 'RolesAndPermissionsRemoveRole',
  ManagePermissions = 'RolesAndPermissionsManagePermissions',
}

export enum RolesAndPermissionsRolesName {
  Admin = 'Site Owner',
  Anonymous = 'Anonymous',
  User = 'User',
}

@Injectable()
export class RolesAndPermissionsConfigService implements RolesAndPermissionsConfig {

  public readonly MODULE_GROUP = 'Default';
  public readonly MODULE_ROLES_GROUP = 'Default';
  public readonly MODULE_PERMISSIONS_GROUP = 'Roles & Permissions';

  public readonly MODULE_ROLES = [
    new Role({
      name: RolesAndPermissionsRolesName.Admin,
      description: 'I am the Lizard King, I can do anything',
      group: this.MODULE_ROLES_GROUP,
      isDefault: true,
    }),
    new Role({
      name: RolesAndPermissionsRolesName.Anonymous,
      description: 'Base role for all anonymous users',
      group: this.MODULE_ROLES_GROUP,
      isDefault: true,
    }),
    new Role({
      name: RolesAndPermissionsRolesName.User,
      description: 'Base role for all authorized users',
      group: this.MODULE_ROLES_GROUP,
      isDefault: true,
    }),
  ];

  public readonly MODULE_PERMISSIONS = [
    new Permission({
      key: RolesAndPermissionsPermissionsKeys.ManagePermissions,
      description: 'Manage permissions',
      group: this.MODULE_PERMISSIONS_GROUP,
    }),
    new Permission({
      key: RolesAndPermissionsPermissionsKeys.ViewRole,
      description: 'View roles',
      group: this.MODULE_PERMISSIONS_GROUP,
    }),
    new Permission({
      key: RolesAndPermissionsPermissionsKeys.AddRole,
      description: 'Add roles',
      group: this.MODULE_PERMISSIONS_GROUP,
    }),
    new Permission({
      key: RolesAndPermissionsPermissionsKeys.EditRole,
      description: 'Edit roles',
      group: this.MODULE_PERMISSIONS_GROUP,
    }),
    new Permission({
      key: RolesAndPermissionsPermissionsKeys.RemoveRole,
      description: 'Remove roles',
      group: this.MODULE_PERMISSIONS_GROUP,
    }),
  ];

}
