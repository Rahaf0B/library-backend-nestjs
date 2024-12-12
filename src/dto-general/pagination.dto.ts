import { Transform, Type } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  ValidateIf,
} from 'class-validator';

// Validation for pagination queries
export class paginationDTO {
  @ValidateIf(
    (dto) => dto.page_number !== undefined && dto.page_number !== null,
    { message: 'page_number is required.' },
  )
  @IsNotEmpty({ message: 'number_of_items should not be empty.' })
  @IsInt()
  @Type(() => Number)
  @Transform(({ value }) => {
    return parseInt(value);
  })
  @Min(1)
  number_of_items?: number;

  @ValidateIf(
    (dto) => dto.number_of_items !== undefined && dto.number_of_items !== null,
    { message: 'number_of_items is required.' },
  )
  @IsNotEmpty({ message: 'page_number should not be empty.' })
  @IsInt()
  @Type(() => Number)
  @Transform(({ value }) => {
    return parseInt(value);
  })
  @Min(1)
  page_number?: number;
}
