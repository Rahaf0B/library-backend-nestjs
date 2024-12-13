import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import { Category } from '../../category/entities/category.entity';
import { Author } from '../entities/author.entity';
import { AuthorService } from '../author.service';
import { Book } from '../../book/entities/book.entity';
import { createDataBaseConfig } from '../../database/config/dbConfig';
import * as dotenv from 'dotenv';
dotenv.config();

describe('Author Service Integration', () => {
  let authorService: AuthorService;
  let dataSource: DataSource;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(
          createDataBaseConfig(process.env.MYSQL_DATABASE_AUTHOR_TEST,true),
        ),
        TypeOrmModule.forFeature([Book, Category, Author]),
      ],
      providers: [AuthorService],
    }).compile();

    authorService = module.get<AuthorService>(AuthorService);
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

  it('should save an author and retrieve it by full name', async () => {
    const authorData = {
      full_name: 'Test Author',
    };

    // Save the author
    const savedAuthor = await dataSource.getRepository(Author).save(authorData);

    // Retrieve the author by full name
    const author = await dataSource
      .getRepository(Author)
      .findOne({ where: { full_name: 'Test Author' } });

    expect(author.full_name).toBe('Test Author');
  });
});
