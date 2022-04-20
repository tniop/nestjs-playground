import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import { CreatePostDto } from '../dto/create-post.dto';

export class CreatePostDtoSnakeToCamelCasePipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(body: any, metadata: ArgumentMetadata): CreatePostDto {
    const dto = new CreatePostDto();
    dto.id = body.id;
    dto.title = body.title;
    dto.content = body.content || null;
    dto.published = body.published || false;
    dto.authorId = body.author_id;
    return dto;
  }
}
