import { Role} from '../role/entities/role.entity';
import { Permission} from '../permission/entities/permission.entity';

export interface RolesAndPermissionsConfig {
  readonly MODULE_GROUP: string;
  readonly MODULE_ROLES_GROUP?: string;
  readonly MODULE_PERMISSIONS_GROUP?: string;
  readonly MODULE_ROLES?: Role[];
  readonly MODULE_PERMISSIONS?: Permission[];
  readonly MODULE_CONTENTS?: Function[];
  readonly MODULE_DEFAULT_PERMISSION_ROLES?: {
    [key: string]: boolean;
  };
}
