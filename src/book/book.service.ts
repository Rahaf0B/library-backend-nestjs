import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { DataSource, ILike, Repository } from 'typeorm';
import { Category } from 'src/category/entities/category.entity';
import { searchBookDTO } from './dto/search-book.dto';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
    private dataSource: DataSource,
  ) {}

  // Define an object with the search criteria with the corresponding query
  private _bookSearchCriteriaQueries = {
    id: (value: any) => ({ id: value }),
    title: (value: any) => ({ title: ILike(`%${value}%`) }),
    author: (value: any) => ({ author: { fullName: ILike(`%${value}%`) } }),
    date: (value: any) => ({ publication_date: ILike(`${value}%`) }),
    category: (value: any) => ({ category: { title: ILike(`%${value}%`) } }),
    price: (value: any) => ({ price: value }),
  };

  // Function for searching for books
  async searchBook(filter: searchBookDTO): Promise<Book[]> {
    // Set the where clause with the correct queries
    let whereClause = {};
    for (const key in filter) {
      whereClause = {
        ...whereClause,
        ...this._bookSearchCriteriaQueries[key](filter[key]),
      };
    }

    // Search for the books
    const result = await this.bookRepository.find({
      where: whereClause,
      relations: ['author', 'category'],
    });

    return result;
  }
}
