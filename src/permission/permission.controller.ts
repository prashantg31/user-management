import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';

@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  // @Post()
  // async createPermission(@Body('name') name: string) {
  //   return this.permissionService.createPermission(name);
  // }

  // @Get()
  // async findAll() {
  //   return this.permissionService.findAll();
  // }
  
  // @Post()
  // create(@Body() createPermissionDto: CreatePermissionDto) {
  //   return this.permissionService.create(createPermissionDto);
  // }

  // @Get()
  // findAll() {
  //   return this.permissionService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.permissionService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updatePermissionDto: UpdatePermissionDto) {
  //   return this.permissionService.update(+id, updatePermissionDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.permissionService.remove(+id);
  // }
}
