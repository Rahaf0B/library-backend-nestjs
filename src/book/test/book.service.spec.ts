import { Test, TestingModule } from '@nestjs/testing';
import { BookService } from '../book.service';
import { Book } from '../entities/book.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { searchBookDTO } from '../dto/search-book.dto';
import * as dotenv from 'dotenv';
import { skip } from 'node:test';
import { take } from 'rxjs';
import { ILike, Repository } from 'typeorm';
dotenv.config();

describe('BookService', () => {
  let service: BookService;
  let repository: Repository<Book>;

  // Mock Book repository
  const mockBookRepository = {
    find: jest.fn(),
    findAndCount: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookService,

        {
          provide: getRepositoryToken(Book),
          useValue: mockBookRepository,
        },
      ],
    }).compile();

    service = module.get<BookService>(BookService);
    repository = module.get<Repository<Book>>(getRepositoryToken(Book));
  });

  it('should correctly build the search query for title', async () => {
    const filter: searchBookDTO = {
      title: 'Test Book',
      number_of_items: 10,
      page_number: 1,
    };

    mockBookRepository.findAndCount.mockResolvedValue([[], 0]);

    await service.searchForBooks(filter);

    expect(mockBookRepository.findAndCount).toHaveBeenCalledWith({
      where: { title: ILike('%Test Book%') },
      relations: ['authors', 'categories'],
      order: { id: 'ASC' },
      take: 10,
      skip: 0,
    });
  });

  it('should apply ordering query correctly', async () => {
    const filter: searchBookDTO = {
      title: 'Test Book',
      number_of_items: 10,
      page_number: 1,
      order_by: 'price',
      order_direction: 'desc',
    };

    mockBookRepository.findAndCount.mockResolvedValue([[], 0]);

    await service.searchForBooks(filter);

    expect(mockBookRepository.findAndCount).toHaveBeenCalledWith({
      where: { title: ILike('%Test Book%') },
      relations: ['authors', 'categories'],
      order: { price: 'desc' },
      take: 10,
      skip: 0,
    });
  });

  it('should search for books with given filters', async () => {
    const filter = { title: 'Test' };
    const mockBooks = [[{ id: 1, title: 'Test Book' }], 1];
    const result = [{ id: 1, title: 'Test Book' }];
    const total = 1;
    mockBookRepository.findAndCount.mockResolvedValue(mockBooks);

    const searchResult = await service.searchForBooks(filter);

    expect(searchResult.data).toEqual(result);
    expect(searchResult.number_of_items).toEqual(total);

    expect(mockBookRepository.findAndCount).toHaveBeenCalledWith({
      where: { title: expect.any(Object) },
      relations: ['authors', 'categories'],
      order: {
        id: 'ASC',
      },
      skip: 0,
      take: null,
    });
  });

  it('should return an empty array if no books match the filter', async () => {
    mockBookRepository.findAndCount.mockResolvedValue([]);

    const filter: searchBookDTO = {
      title: 'Nonexistent',
    };

    const result = await service.searchForBooks(filter);

    expect(mockBookRepository.findAndCount).toHaveBeenCalledWith({
      where: {
        title: expect.any(Object),
      },
      relations: ['authors', 'categories'],
      order: {
        id: 'ASC',
      },
      skip: 0,
      take: null,
    });
    expect(result).toEqual({ data: undefined, number_of_items: undefined });
  });

  it('should return books sorted by price in ascending order', async () => {
    const OrderingFilter = { order_by: 'price', order_direction: 'asc' };
    const mockBooks = [
      [
        {
          id: 1,
          title: 'Test Book',
          price: 20,
          authors: [],
          categories: [],
          publication_date: '2000-01-01',
        },
        {
          id: 2,
          title: 'NodeJs Book',
          price: 10,
          authors: [],
          categories: [],
          publication_date: '2000-01-01',
        },
        {
          id: 3,
          title: 'NestJs Book',
          price: 15,
          authors: [],
          categories: [],
          publication_date: '2000-01-01',
        },
      ],
      3,
    ];
    const result = [
      {
        id: 2,
        title: 'NodeJs Book',
        price: 10,
        authors: [],
        categories: [],
        publication_date: '2000-01-01',
      },
      {
        id: 3,
        title: 'NestJs Book',
        price: 20,
        authors: [],
        categories: [],
        publication_date: '2000-01-01',
      },
      {
        id: 1,
        title: 'Test Book',
        price: 20,
        authors: [],
        categories: [],
        publication_date: '2000-01-01',
      },
    ];
    const total = 1;

    // Mock the repository method to simulate sorting by price
    jest.spyOn(repository, 'findAndCount').mockResolvedValue([result, total]);

    const searchResult = await service.searchForBooks(OrderingFilter);

    expect(repository.findAndCount).toHaveBeenCalledWith({
      where: {},
      relations: ['authors', 'categories'],
      order: { price: 'asc' },
      take: null,
      skip: 0,
    });
    expect(searchResult.data).toEqual(result);
    expect(searchResult.number_of_items).toEqual(total);
  });
});
