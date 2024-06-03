import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcryptjs';
import { Logger } from '@nestjs/common';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.findOneByUsername(username);
    if (user && bcrypt.compareSync(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    this.logger.error(`Authentication failed for user: ${username}`);
    return null;
  }

  async login(user: any) {
    this.logger.log(`User logged in: ${user.username}`);
    this.logger.debug(`User loggin error: ${user.username}`); 
    const payload = { username: user.username,email:user.email,roles: user.roles, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
  
  async register(user: any): Promise<{ access_token: string }> {
    const existingUsername = await this.userService.findOneByUsername(user.username);
    if (existingUsername) {
      throw new ConflictException('Username already exists');
    }

    const existingEmail = await this.userService.findOneByEmail(user.email);
    if (existingEmail) {
      throw new ConflictException('Email already exists');
    }
    const hashedPassword = bcrypt.hashSync(user.password, 10);
    const newUser = await this.userService.createUser(user.username, hashedPassword,user.email,user.roles);
    const payload = { username: newUser.username, sub: newUser.id, role:newUser.roles };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
