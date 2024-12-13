import { Test, TestingModule } from '@nestjs/testing';
import { BookController } from '../book.controller';
import { BookService } from '../book.service';
import { searchBookDTO } from '../dto/search-book.dto';
import { ISearchResult } from '../../config/interfaces';
import { CacheInterceptor } from '@nestjs/cache-manager';

// Mock data for to use it for testing
const mockSearchResult: ISearchResult = {
  number_of_items: 2,
  data: [
    {
      id: 1,
      title: 'Mock Book Title 1',
      authors: [
        {
          full_name: 'Mock Author 1',
          id: 1,
        },
      ],
      publication_date: '2024-01-01',
      categories: [{ title: 'Mock Category 1', id: 1 }],
      price: 19.99,
    },
    {
      id: 2,
      title: 'Mock Book Title 2',
      authors: [{ full_name: 'Mock Author 2', id: 2 }],
      publication_date: '2024-02-01',
      categories: [{ title: 'Mock Category 2', id: 2 }],
      price: 29.99,
    },
  ],
};

describe('BookController', () => {
  let bookController: BookController;
  let bookService: BookService;

  // Create a mock BookService with the mock data
  const mockBookService = {
    searchForBooks: jest.fn().mockResolvedValue(mockSearchResult),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookController],
      providers: [{ provide: BookService, useValue: mockBookService }],
    })
      .overrideInterceptor(CacheInterceptor) // Remove the CacheInterceptor for testing purposes
      .useValue(null)
      .compile();

    bookController = module.get<BookController>(BookController);
    bookService = module.get<BookService>(BookService);
  });

  describe('searchBookAPI', () => {
    it('should return a list of books based on search criteria', async () => {
      // Define the query parameters for the test
      const filter: searchBookDTO = {
        title: 'Mock Book Title',
        page_number: 1,
        number_of_items: 10,
        order_by: 'id',
        order_direction: 'asc',
      };

      const result = await bookController.searchBook(filter);

      expect(bookService.searchForBooks).toHaveBeenCalledWith(filter);
      expect(result).toEqual(mockSearchResult);
    });

    it('should handle empty search results correctly', async () => {
      // Define a mock empty result
      const emptySearchResult: ISearchResult = { number_of_items: 0, data: [] };
      mockBookService.searchForBooks.mockResolvedValue(emptySearchResult);

      const filter: searchBookDTO = {
        title: 'Nonexistent Book',
        page_number: 1,
        number_of_items: 10,
        order_by: 'id',
        order_direction: 'asc',
      };

      const result = await bookController.searchBook(filter);

      expect(bookService.searchForBooks).toHaveBeenCalledWith(filter);
      expect(result).toEqual(emptySearchResult);
    });
  });
});
