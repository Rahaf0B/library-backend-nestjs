import { Transform } from "class-transformer";
import { IsDate, IsEmail, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Matches, MaxDate, Validate } from "class-validator";
import { IsValidDate } from "src/config/dateValidation";



export class searchBookDTO{


    //Define the id property
    @IsOptional()
    @IsNotEmpty()
    @IsInt()
    id?:number;


    // Define the title property
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    title?:string;

    // Define the author property
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    author?:string;

    // Define the date property
    @IsOptional()
    @Validate(IsValidDate)
    date?: Date;


    // Define the category property
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    category?:string;


    // Define the price property
    @IsOptional()
    @IsNotEmpty()
    @IsInt()
    price?:number;

}
