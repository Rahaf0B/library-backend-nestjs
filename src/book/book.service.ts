import {  Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import {  ILike, Repository } from 'typeorm';
import { searchBookDTO } from './dto/search-book.dto';
import { ISearchResult } from '../config/interfaces';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private bookRepository: Repository<Book>  ) {}

  // Define an object with the search criteria with the corresponding query
  private _bookSearchCriteriaQueries = {
    id: (value: any) => ({ id: value }),
    title: (value: any) => ({ title: ILike(`%${value}%`) }),
    author: (value: any) => ({ authors: { full_name: ILike(`%${value}%`) } }),
    date: (value: any) => ({ publication_date: ILike(`${value}%`) }),
    category: (value: any) => ({ categories: { title: ILike(`%${value}%`) } }),
    price: (value: any) => ({ price: value }),
  };

  // Function for searching for books
  async searchForBooks(filter: searchBookDTO): Promise<ISearchResult> {
    // Set the where clause with the correct queries
    let whereClause = {};
    for (const key in filter) {
      if (key in this._bookSearchCriteriaQueries) {
        whereClause = {
          ...whereClause,
          ...this._bookSearchCriteriaQueries[key](filter[key]),
        };
      }
    }

    // Define the order options if the order_by is not specified then it will order the data by the id in ascending order
    const orderOption = {};
    if (filter.order_by) {
      orderOption[filter.order_by] = filter.order_direction ?? 'asc';
    } else {
      orderOption['id'] = 'ASC';
    }
    // Search for the books
    const result = await this.bookRepository.findAndCount({
      where: whereClause,
      relations: ['authors', 'categories'],
      order: orderOption,
      relationLoadStrategy:"query",
      take: filter['number_of_items'] || null,
      skip: filter['page_number']
        ? (filter['page_number'] - 1) * filter['number_of_items']
        : 0,
    });

    return { number_of_items: result[1], data: result[0] };
  }
}
