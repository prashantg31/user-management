import { Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PermissionService {

  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  async createPermission(name: string): Promise<Permission> {
    const permission = new Permission();
    permission.name = name;
    return this.permissionRepository.save(permission);
  }

  async findAll(): Promise<Permission[]> {
    return this.permissionRepository.find();
  }

  async findOneByName(name: string): Promise<Permission> {
    return this.permissionRepository.findOne({ where: { name } });
  }

  
  create(createPermissionDto: CreatePermissionDto) {
    return 'This action adds a new permission';
  }

  // findAll() {
  //   return `This action returns all permission`;
  // }

  findOne(id: number) {
    return `This action returns a #${id} permission`;
  }

  update(id: number, updatePermissionDto: UpdatePermissionDto) {
    return `This action updates a #${id} permission`;
  }

  remove(id: number) {
    return `This action removes a #${id} permission`;
  }
}
