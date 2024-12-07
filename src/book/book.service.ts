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
       private dataSource: DataSource

      ) {}

// Function for searching for books
async searchBook(criteria:searchBookDTO){
    
return [];

}


}
