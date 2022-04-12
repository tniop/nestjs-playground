import { PartialType } from '@nestjs/mapped-types';
// import { IsOptional, IsString } from 'class-validator';
import { CreatePostDto } from './create-post.dto';

export class UpdatePostDto extends PartialType(CreatePostDto) {}

// @IsString()
// readonly title: string;

// @IsOptional()
// @IsString()
// readonly content: string;

// @IsOptional()
// readonly published: boolean;
