import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, OneToMany, JoinColumn } from 'typeorm';
import { Permission } from '../../permission/entities/permission.entity';
import { User } from '../../user/entities/user.entity';
import { RolePermission } from 'src/role-permissions/entities/role-permission.entity';

@Entity()
// export class Role {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column()
//   name: string;

//   @ManyToMany(() => Permission, (permission) => permission.roles)
//   permissions: Permission[];

//   @ManyToMany(() => User, (user) => user.roles)
//   users: User[];
// }

// @Entity('roles')
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 64 })
  name: string;

  @Column('text')
  description: string;

  @Column('varchar', { length: 64, default: 'Custom' })
  group: string;

  @Column('boolean', { default: false })
  isDefault: boolean;

  @Column('boolean', { default: false })
  isSystem: boolean = false;

  @ManyToMany(() => Permission, (permission) => permission.roles)
  @JoinTable({
    name: 'role_permissions',
    joinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'permission_id',
      referencedColumnName: 'id',
    },
  })
  permissions: Permission[];

  @ManyToMany(() => User, (user) => user.roles)
  users: User[];

  @OneToMany(() => RolePermission, (permissionRole) => permissionRole.role)
  @JoinColumn()
  permissionRoles: RolePermission[];

  constructor(data?: Partial<Role>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}
