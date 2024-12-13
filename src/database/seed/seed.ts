import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import { runSeeders, SeederOptions } from 'typeorm-extension';
import { Book } from '../../book/entities/book.entity';
import { Author } from '../../author/entities/author.entity';
import { Category } from '../../category/entities/category.entity';
import MainDataSeeder from './main.seeder';
import * as dotenv from 'dotenv';
import { initializeDatabase } from '../setup-database';

dotenv.config();

const options: DataSourceOptions & SeederOptions = {
  type: 'mysql',
  host: process.env.MYSQL_HOST,
  port: parseInt(process.env.MYSQL_PORT),
  password: process.env.MYSQL_PASSWORD,
  username: process.env.MYSQL_USER,
  database: process.env.MYSQL_DATABASE,
  logging: true,
  entities: [Book, Author, Category],
  seeds: [MainDataSeeder],
  factories: [],
};

const dataSource = new DataSource(options);

async function init() {
  // Initialize the database before setting up the data source
  await initializeDatabase();

  const dataSource = new DataSource(options);

  try {
    await dataSource.initialize();
    await dataSource.synchronize(true);
    await runSeeders(dataSource);
  } catch (error) {
    console.error('Error during data source initialization or seeding:', error);
  } finally {
    await dataSource.destroy();
    process.exit();
  }
}

init();
