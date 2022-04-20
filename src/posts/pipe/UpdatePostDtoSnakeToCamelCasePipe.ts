import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import { UpdatePostDto } from '../dto/update-post.dto';

export class UpdatePostDtoSnakeToCamelCasePipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(body: any, metadata: ArgumentMetadata): UpdatePostDto {
    // console.log(body);
    const dto = new UpdatePostDto();
    dto.id = body.id;
    dto.title = body.title;
    dto.content = body.content || null;
    dto.published = body.published || false;
    dto.authorId = body.author_id;
    return dto;
  }
}
