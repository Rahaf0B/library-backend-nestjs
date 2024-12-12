import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookModule } from './book/book.module';
import { AuthorModule } from './author/author.module';
import { CategoryModule } from './category/category.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import * as cacheManager from 'cache-manager';
@Module({
  imports: [
    BookModule,
    AuthorModule,
    CategoryModule,
    ConfigModule.forRoot({isGlobal: true}),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_HOST,
      port: parseInt(process.env.MYSQL_PORT),
      password: process.env.MYSQL_PASSWORD,
      username: process.env.MYSQL_USER,
      autoLoadEntities: true,
      database: process.env.MYSQL_DATABASE,
      synchronize: true,
      logging: true,
    }),
    CacheModule.register({isGlobal: true,store: 'memory'}),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
