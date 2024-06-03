import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { RoleModule } from './role/role.module';
import { PermissionModule } from './permission/permission.module';
import { Role } from './role/entities/role.entity';
import { Permission } from './permission/entities/permission.entity';
import { RolePermissionsModule } from './role-permissions/role-permissions.module';

@Module({
  imports: [
    //UserModule, AuthModule
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'Some12345.',
      database: 'user_management',
      entities: [User,Role,Permission],
      synchronize: true,
    }),
    AuthModule,
    UserModule,
    RoleModule,
    PermissionModule,
    RolePermissionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
