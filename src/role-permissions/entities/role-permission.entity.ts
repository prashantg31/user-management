import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Permission } from '../../permission/entities/permission.entity';
import { Role } from '../../role/entities/role.entity';

@Entity()
@Unique(['permission', 'role'])
export class RolePermission  {

  @PrimaryGeneratedColumn()
  id: number;

  @Column('boolean', { default: false })
  isEnabled: boolean;

  @Column('boolean', { default: false })
  isDefault: boolean;

  @ManyToOne(() => Permission, { onDelete: 'CASCADE' })
  @JoinColumn()
  permission: Permission;

  @ManyToOne(() => Role, { onDelete: 'CASCADE' })
  @JoinColumn()
  role: Role;

  constructor(data?: Partial<RolePermission>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}
