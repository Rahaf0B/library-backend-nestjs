import { Transform, Type } from 'class-transformer';
import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

// Validation for ordering queries
export class orderByDTO {
  @ValidateIf(
    (dto) => dto.order_direction !== undefined && dto.order_direction !== null,
    { message: 'order_direction is required.' },
  )
  @IsNotEmpty({ message: 'orderBy should not be empty.' })
  @IsString({ message: 'orderBy must be a string.' })
  @IsIn(['id', 'title', 'price', 'publication_date'], {
    message:
      'orderBy must be one of the following: id, title, price, publication_date',
  })
  order_by?: string;

  @IsOptional()
  @IsNotEmpty({ message: 'orderDirection should not be empty.' })
  @IsString({ message: 'orderDirection must be a string.' })
  @IsIn(['ASC', 'DESC', 'asc', 'desc'], {
    message: 'orderDirection must be one of the following: ASC, DESC',
  })
  order_direction?: string;
}
