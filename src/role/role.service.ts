import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleName } from './role.enum';
import { Subject } from 'rxjs';

@Injectable()
export class RoleService {

  private $$roleRegistered = new Subject<Role>();
  public $roleRegistered = this.$$roleRegistered.asObservable();

  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  // async createRole(name: string): Promise<Role> {
  //   const role = new Role();
  //   role.name = name;
  //   return this.registerRole(role);
  // }

  async findAll(excludeSystem = true): Promise<Role[]> {
    const conditions: any = {};
    if (excludeSystem) {
      conditions.isSystem = false;
    }
    return this.roleRepository.find(conditions);
  }

  async findOneByName(name: string): Promise<Role> {
    return this.roleRepository.findOneOrFail({ where: { name } });
  }

  async getRole(conditions?: any): Promise<Role> {
    return this.roleRepository.findOne(conditions);
  }

  async getRoles(conditions?: any, excludeSystem = true): Promise<Role[]> {
    conditions = conditions || {};
    if (excludeSystem) {
      conditions.isSystem = false;
    }
    return this.roleRepository.find(conditions);
  }

  async updateRole(role: Role): Promise<Role> {
    return this.roleRepository.save(role);
  }

  async registerRole(role: Role): Promise<{ isNew: boolean; role: Role }> {
    let isNew = true;
    const existedRole = await this.roleRepository.findOne({ where: { name: role.name } });

    if (existedRole) {
      role = existedRole;
      isNew = false;
    } else {
      role = await this.roleRepository.save(role);
    }

    if (isNew) {
      this.$$roleRegistered.next(role);
    }

    return { isNew, role };
  }

  async removeRole(roleId: number): Promise<Role> {
    const role = await this.getRole({ id: roleId });
    return this.roleRepository.remove(role);
  }

  async update(id: number, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const role = await this.roleRepository.findOne({where:{id}});
    if (!role) {
      throw new NotFoundException(`Role with id ${id} not found`);
    }
    Object.assign(role, updateRoleDto);
    return this.updateRole(role);
  }

  async remove(id: number): Promise<void> {
    const role = await this.roleRepository.findOne({where:{id}});
    if (!role) {
      throw new NotFoundException(`Role with id ${id} not found`);
    }
    await this.roleRepository.remove(role);
  }
}
