import { Book } from '../../book/entities/book.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Index,
  JoinTable,
  ManyToMany,
} from 'typeorm';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  // Add full text search index to enhance performance
  @Index('fulltext_title_index', { fulltext: true })
  @Column({ unique: true })
  title: string;

  // Define the many-to-many relationship ( a category can have many books )
  @ManyToMany(() => Book, (book) => book.categories)
  @JoinTable()
  books: Book[]
}
