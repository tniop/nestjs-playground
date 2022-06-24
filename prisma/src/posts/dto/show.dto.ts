import { Posts } from '@prisma/client';

export class PostShowDto {
  id: number;
  title: string;
  content: string | null;
  published: boolean | null;
  author_id: number;

  constructor(post: Posts) {
    this.id = post.id;
    this.title = post.title;
    this.content = post.content;
    this.published = post.published;
    this.author_id = post.authorId;
  }
}
