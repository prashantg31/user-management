import { Role} from '../role/entities/role.entity';
import { Permission} from '../permission/entities/permission.entity';

export abstract class RolesAndPermissionsModuleConfig {
  public readonly abstract MODULE_GROUP: string;
  public readonly abstract MODULE_ROLES: Role[];
  public readonly abstract MODULE_PERMISSIONS: Permission[];
  public readonly abstract MODULE_CONTENTS: any[];
  public readonly abstract MODULE_DEFAULT_PERMISSION_ROLES: {
    [k: string]: boolean;
  };

  protected constructor() { }

  // Helper function to replace contentPermissionHelper.getKeyAsString
  private getKeyAsString(key: any): string {
    return key.toString();
  }

  // Helper function to replace contentPermissionHelper.getKeyByContentName
  private getKeyByContentName(key: string, name: string): string {
    return `${key}_${name}`;
  }

  // Helper function to replace contentPermissionHelper.getPermissionRoleKey
  private getPermissionRoleKey(key: string, role: string): string {
    return `${role}_${key}`;
  }
  protected addDefPerRole(key: any, name: string, role: string) {
    const keyAsString = this.getKeyAsString(key);
    const keyByContentName = this.getKeyByContentName(keyAsString, name);
    const permissionRoleKey = this.getPermissionRoleKey(keyByContentName, role);

    this.MODULE_DEFAULT_PERMISSION_ROLES[permissionRoleKey] = true;
  }

  protected addDefPerRoleShort(key: string, role: string) {
    const permissionRoleKey = this.getPermissionRoleKey(key, role);

    this.MODULE_DEFAULT_PERMISSION_ROLES[permissionRoleKey] = true;
  }
}
