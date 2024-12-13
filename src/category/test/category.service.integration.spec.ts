import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import { Category } from '../entities/category.entity';
import { Author } from '../../author/entities/author.entity';
import { CategoryService } from '../category.service';
import { Book } from '../../book/entities/book.entity';
import * as dotenv from 'dotenv';
import { createDataBaseConfig } from '../../database/config/dbConfig';
dotenv.config();
describe('Category Integration', () => {
  let categoryService: CategoryService;
  let dataSource: DataSource;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(
          createDataBaseConfig(process.env.MYSQL_DATABASE_CATEGORY_TEST,true),
        ),
        TypeOrmModule.forFeature([Book, Category, Author]),
      ],
      providers: [CategoryService],
    }).compile();

    categoryService = module.get<CategoryService>(CategoryService);
    dataSource = module.get<DataSource>(DataSource);
  });

  afterAll(async () => {
    // Close database connection after tests
    await dataSource.destroy();
  });

  afterEach(async () => {
    // Delete the entries from tables between tests
    await dataSource.query('DELETE FROM category_books_book');
    await dataSource.query('DELETE FROM author_books_book');
    await dataSource.query('DELETE FROM book');
    await dataSource.query('DELETE FROM category');
    await dataSource.query('DELETE FROM author');
  });


  it('should save and retrieve a book', async () => {
    const categoryData = {
      title: 'Test Category',
    };

    // Save the category
    const savedCategory = await dataSource
      .getRepository(Category)
      .save(categoryData);

    // Retrieve the category by title
    const category = await dataSource
      .getRepository(Category)
      .findOne({ where: { title: 'Test Category' } }); 

    expect(category.title).toBe('Test Category');
  });

  it('should throw a duplicate error when saving a Category with duplicate data', async () => {

    const categoryData1 = {
      title: 'Test Category Dub',
    };

    const categoryData2 = {
      title: 'Test Category Dub',
    };

    // Save the first category
    await dataSource.getRepository(Category).save(categoryData1); 

    try {
      // Try saving the duplicate category
      await dataSource.getRepository(Category).save(categoryData2);
      expect(categoryData2).toThrow();
    } catch (error) {
      expect(error.code).toBe('ER_DUP_ENTRY');
    }
  });
});
