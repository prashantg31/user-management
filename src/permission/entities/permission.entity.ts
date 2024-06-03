import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, OneToMany, JoinColumn, Unique } from 'typeorm';
import { Role } from '../../role/entities/role.entity';
import { RolePermission } from 'src/role-permissions/entities/role-permission.entity';

@Entity()
@Unique(['key'])
// export class Permission {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column()
//   name: string;

//   @ManyToMany(() => Role, (role) => role.permissions)
//   roles: Role[];
// }
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 127, unique: true })
  key: string;

  @Column()
  description: string;

  @Column('varchar', { length: 64, default: 'Custom' })
  group: string;

  @ManyToMany(() => Role, (role) => role.permissions)
  roles: Role[];

  @OneToMany(() => RolePermission, (permissionRole) => permissionRole.permission)
  @JoinColumn()
  permissionRoles: RolePermission[];

  constructor(data?: Partial<Permission>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}