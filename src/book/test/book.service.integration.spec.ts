import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookService } from '../book.service';
import { Book } from '../entities/book.entity';
import { DataSource, ILike } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import { Category } from '../../category/entities/category.entity';
import { Author } from '../../author/entities/author.entity';
import * as dotenv from 'dotenv';
import { createDataBaseConfig } from '../../database/config/dbConfig';
dotenv.config();
describe('Book Service Integration', () => {
  let bookService: BookService;
  let dataSource: DataSource;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(
          createDataBaseConfig(process.env.MYSQL_DATABASE_BOOK_TEST, true),
        ),
        TypeOrmModule.forFeature([Book, Category, Author]),
      ],
      providers: [BookService],
    }).compile();

    bookService = module.get<BookService>(BookService);
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

  it('should save and retrieve a book by title', async () => {
    const bookData = {
      title: 'Test Book',
      price: 19.99,
      publication_date: '2000-01-01',
    };

    // Create and Save the book
    const savedBook = await dataSource.getRepository(Book).save(bookData);

    // Retrieve the book by title
    const books = await bookService.searchForBooks({ title: 'Test' });

    expect(books['data']).toHaveLength(1);
    expect(books['data'][0].title).toBe('Test Book');
  });

  it('should retrieve a book by category', async () => {
    // Create and save a category on the database
    const savedCategory = await dataSource.getRepository(Category).save({
      title: 'Test Category2',
    });

    const bookData = {
      title: 'Test Book2',
      price: 19.99,
      publication_date: '2015-01-01',
      categories: [savedCategory],
    };

    // Create and Save the book
    const savedBook = await dataSource.getRepository(Book).save(bookData);

    // Retrieve the book by category
    const books = await dataSource.getRepository(Book).find({
      where: {
        categories: {
          title: 'Test Category2',
        },
      },
      relations: ['categories'],
    });
    expect(books).toHaveLength(1);
    expect(books[0].categories[0].title).toBe('Test Category2');
  });

  it('should throw a duplicate error when saving a book with duplicate data', async () => {
    const bookData1 = {
      title: 'Test Book Dub',
      price: 19.99,
      publication_date: '2016-01-01',
    };

    const bookData2 = {
      title: 'Test Book Dub',
      price: 50,
      publication_date: '2015-01-01',
    };

    // Create and Save the first book
    await dataSource.getRepository(Book).save(bookData1);

    try {
      // Try saving the duplicate book
      await dataSource.getRepository(Book).save(bookData2);
      expect(bookData2).toThrow();
    } catch (error) {
      expect(error.code).toBe('ER_DUP_ENTRY');
    }
  });
});
