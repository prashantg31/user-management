import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from 'src/permission/entities/permission.entity';
import { Role } from './entities/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Role, Permission])],
  providers: [RoleService],
  controllers: [RoleController],
  exports: [RoleService],

  // controllers: [RoleController],
  // providers: [RoleService],
})
export class RoleModule {}
