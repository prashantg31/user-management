import { Controller, Get, Post, Delete, Put, Param, Body, UseGuards, NotFoundException, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../role/entities/role.entity';
import { RoleName } from '../role/role.enum';

@Controller('users')
@UseGuards(RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User> {
    const userId = Number(id);
    if (isNaN(userId)) {
      throw new NotFoundException('Invalid user ID');
    }
    return this.userService.findOneById(userId);
  }


  @UseGuards(JwtAuthGuard)
  @Get()
  @Roles(RoleName.Manager, RoleName.TeamLead)
  async findAll(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
  ): Promise<User[]> {
    if (page < 1 || pageSize < 1) {
      throw new NotFoundException('Invalid pagination parameters');
    }
    return this.userService.findAll(page, pageSize);
  }

  // @Post()
  // async create(@Body() userData: User): Promise<User> {
  //   return this.userService.createUser(userData.username, userData.password);
  // }

  @Post()
  @Roles(RoleName.Manager)
  async createUser(@Body()  userData: User): Promise<User> {
    const { username, password, email, roles } = userData;
    return this.userService.createUser(username, password, email, roles);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<User> {
    return this.userService.remove(Number(id));
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() userData: User): Promise<User> {
    return this.userService.update(Number(id), userData.username, userData.password);
  }
}
