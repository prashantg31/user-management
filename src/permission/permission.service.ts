import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from './entities/permission.entity';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { Subject } from 'rxjs';

@Injectable()
export class PermissionService {
  private $$permissionRegistered = new Subject<Permission>();
  public $permissionRegistered = this.$$permissionRegistered.asObservable();

  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  async getAll(): Promise<Permission[]> {
    return this.permissionRepository.find();
  }

  async getRolesAssoc(): Promise<Permission[]> {
    return this.permissionRepository.find({
      relations: ['roles'],
      order: {
        group: 'ASC',
        description: 'ASC',
      },
    });
  }

  async registerPermission(permission: Permission): Promise<{ isNew: boolean; permission: Permission }> {
    let isNew = true;
    try {
      permission = await this.permissionRepository.save(permission);
    } catch {
      isNew = false;
      permission = await this.permissionRepository.findOne({ where: { key: permission.key } });
    }

    if (!permission) {
      throw new Error('Permission not found');
    }

    if (isNew) {
      this.$$permissionRegistered.next(permission);
    }
    return { isNew, permission };
  }

  async getPermission(conditions?: Partial<Permission>): Promise<Permission> {
    return this.permissionRepository.findOne({
      where: conditions,
    }
    );
  }
}

