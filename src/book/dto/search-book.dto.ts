import { IntersectionType } from '@nestjs/mapped-types';
import { Transform, Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsEnum,
  isInt,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  Matches,
  MaxDate,
  Min,
  notContains,
  Validate,
} from 'class-validator';
import { IsValidDate } from '../../config/date-validation';
import { orderByDTO } from '../../dto-general/orderBy.dto';
import { paginationDTO } from '../../dto-general/pagination.dto';

export class searchBookDTO extends IntersectionType(orderByDTO, paginationDTO) {
  //Define the id property
  @IsOptional()
  @IsNotEmpty({ message: 'Id should not be empty.' })
  @Type(() => Number)
  @IsInt()
  @Transform(({ value }) => {
    return parseInt(value);
  })
  @Min(1)
  id?: number;

  // Define the title property
  @IsOptional()
  @IsNotEmpty({ message: 'Title should not be empty.' })
  @IsString({ message: 'Title must be a string.' })
  title?: string;

  // Define the author property
  @IsOptional()
  @IsNotEmpty({ message: 'Author should not be empty.' })
  @IsString({ message: 'Author must be a string.' })
  author?: string;

  // Define the date property
  @IsOptional()
  @IsNotEmpty({ message: 'date should not be empty.' })
  @Validate(IsValidDate)
  date?: Date;

  // Define the category property
  @IsOptional()
  @IsNotEmpty({ message: 'Category should not be empty.' })
  @IsString({ message: 'Category must be a string.' })
  category?: string;

  // Define the price property
  @IsOptional()
  @IsNotEmpty({ message: 'Price should not be empty.' })
  @Type(() => Number)
  @Min(0, { message: 'Price must be greater than or equal to 0.' })
  price?: number;
}
