import { Book } from 'src/book/entities/book.entity';

export interface ISearchResult {
  number_of_items: number;
  data: Book[];
}
