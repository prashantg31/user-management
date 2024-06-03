import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { Role } from 'src/role/entities/role.entity';
import { RoleName } from '../role/role.enum';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async findOneById(id: number): Promise<User> {
    this.logger.log(`Received ID: ${id}, Type: ${typeof id}`);
    if (isNaN(id)) {
      throw new NotFoundException('Invalid user ID');
    }
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findOneByUsername(username: string): Promise<User> {
    return this.userRepository.findOne({ where: { username } });
  }
  async findOneByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ where: { email } });
  }

  // async createUser(username: string, password: string, email: string,roles: RoleName[]): Promise<User> {
  //   const user = new User();
  //   user.username = username;
  //   user.password = password;
  //   user.email = email;
  //   if (roles && roles.length > 0) {
  //     const userRoles = await this.roleRepository.findByIds(roles);
  //     user.roles = userRoles;
  //   }

  //   return this.userRepository.save(user);
  // }

  // async createUser(username: string, password: string, email: string, roles: RoleName[]): Promise<User> {
  //   const user = new User();
  //   user.username = username;
  //   user.password = password;
  //   user.email = email;

  //   if (roles && roles.length > 0) {
  //     const userRoles = await this.roleRepository.find({ where: roles.map(role => ({ name: role })) });
  //     user.roles = userRoles;
  //   }

  //   return this.userRepository.save(user);
  // }

  async createUser(username: string, password: string, email: string, roleNames: string): Promise<User> {
    const user = new User();
    user.username = username;
    user.password = password;
    user.email = email;
    //const roleNames: RoleName[] = roles as RoleName[]; 

    if (roleNames && roleNames.length > 0) {
      const role = await this.roleRepository.findOneOrFail({ where: { name: roleNames } });
      user.roles = role.name; // Assign a single role
    }

    return this.userRepository.save(user);
  }

  async remove(id: number): Promise<User> {
    const user = await this.findOneById(id);
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('User not found');
    }
    //console.log(result,user);
    return user;
  }

  async findAll(page: number = 1, pageSize: number = 10): Promise<User[]> {
    const skip = (page - 1) * pageSize;
    return this.userRepository.find({
      skip,
      take: pageSize,
    });
  }

  async update(id: number, username: string, password: string): Promise<User> {
    const user = await this.findOneById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    // Hash the new password before updating
    const hashedPassword = bcrypt.hashSync(password, 10);
    user.password = hashedPassword;
    return await this.userRepository.save(user);
  }
  
}
