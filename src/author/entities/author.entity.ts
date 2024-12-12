import { Book } from '../../book/entities/book.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  JoinTable,
  ManyToMany,
} from 'typeorm';

@Entity()
export class Author {
  @PrimaryGeneratedColumn()
  id: number;

  // Add full text search index to enhance performance
  @Index('fulltext_title_index', { fulltext: true })
  @Column()
  full_name: string;

   // Define the many-to-many relationship (an author can have multiple books)
  @ManyToMany(() => Book, (book) => book.authors)
  @JoinTable()
  books: Book[];
}
