
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'Some12345.',
  database: 'user_management',//'nestjs_db', // Name of your database
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: true, // This option automatically creates database tables based on your entities. Be careful using it in production.
};
