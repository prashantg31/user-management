import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
//import { PermissionRoleEntity } from '../entities/permission-role.entity';
import { PermissionRoleService } from '../permission/permission-role.service';
import { RolesAndPermissionsRolesName } from '../role-permissions/roles-permissions-config.service';
import { RolePermission } from 'src/role-permissions/entities/role-permission.entity';

@Injectable()
export class ValidatePermissionRolesPipe implements PipeTransform {

  constructor(
    private prService: PermissionRoleService,
  ) {}

  async transform(prs: RolePermission[], metadata: ArgumentMetadata) {
    const validPrs = [];
    for (const i in prs) {
      const pr = prs[i];
      const prWithRole = await this.prService.getSingle(pr.id);
      if (prWithRole && prWithRole.role.name !== RolesAndPermissionsRolesName.Admin) {
        validPrs.push(pr);
      }
    }
    return validPrs;
  }
}
