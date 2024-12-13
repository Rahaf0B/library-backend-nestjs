import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource, EntitySchema } from 'typeorm';
import * as dotenv from 'dotenv';
import { Book } from '../../book/entities/book.entity';
import { Category } from '../../category/entities/category.entity';
import { Author } from '../../author/entities/author.entity';
dotenv.config();


export const createDataBaseConfig = (
  dataBase:string,
  synchronize=false
): TypeOrmModuleOptions => ({
    type: 'mysql',
    host: process.env.MYSQL_HOST,
    port: parseInt(process.env.MYSQL_PORT),
    password: process.env.MYSQL_PASSWORD,
    username: process.env.MYSQL_USER,
    autoLoadEntities: true,
    database: dataBase,
    synchronize ,
    logging: true,
    entities: [Book,  Author,Category],
    
});


