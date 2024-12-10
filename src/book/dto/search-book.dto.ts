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
import { IsValidDate } from 'src/config/dateValidation';

export class searchBookDTO {
  //Define the id property
  @IsOptional()
  @IsNotEmpty({ message: 'Id should not be empty.' })
  @Type(() => Number)
  @IsInt()
  @Min(0)
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
  // @IsNumber()
  @Type(() => Number)
  @IsInt()
  //  @Matches(new RegExp('/^\d+$/'), { message: 'Price must be a valid positive integer.' })
  @Transform(({ value }) => {
    return parseInt(value);
  })
  @Min(0, { message: 'Price must be greater than or equal to 0.' })
  price?: number;
}
