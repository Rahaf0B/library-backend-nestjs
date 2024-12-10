import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Query,
  SerializeOptions,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { BookService } from './book.service';
import { Book } from './entities/book.entity';
import { searchBookDTO } from './dto/search-book.dto';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @SerializeOptions({ type: Book })
  // Get Request for Book Search
  @Get('search')
  // Define the Query type for Book Search and the Validation for the input fields
  searchBook(@Query(ValidationPipe) criteria: searchBookDTO) {
    // Call the searchBook method from BookService and return the results
    const result = this.bookService.searchBook(criteria);
    return result;
  }
}
