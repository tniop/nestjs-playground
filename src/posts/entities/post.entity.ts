import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 30 })
  title: string;

  @Column({ length: 30, nullable: true })
  content: string;

  @Column({ nullable: true, default: false })
  published: boolean;

  @ManyToOne(() => User, (user) => user.posts)
  user: User;
}
