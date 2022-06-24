import { PartialType } from '@nestjs/mapped-types';
// import { IsNumber, IsString } from 'class-validator';
import { CreateMovieDto } from './create-movie.dto';

export class UpdateMovieDto extends PartialType(CreateMovieDto) {}

// {
//     @IsString()
//     readonly title?: string; // ?: 필수 아님 (수정이니까)

//     @IsNumber()
//     readonly year?: number;

//     @IsString({ each: true })
//     readonly genres?: string[];
// }
