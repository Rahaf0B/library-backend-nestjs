import { Author } from '../../author/entities/author.entity';
import { Category } from '../../category/entities/category.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  ManyToOne,
  ManyToMany,
  JoinTable,
  Index,
} from 'typeorm';

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  // Add full text search index to enhance performance
  @Index('fulltext_title_index', { fulltext: true })
  @Column({ unique: true })
  title: string;

  @Column({ type: 'double' })
  price: number;

  @Column({ type: 'date' })
  publication_date: String;

  // Define the many-to-many relationship (a book belongs to multiple categories)
  @ManyToMany(() => Category, (category) => category.books)
  categories?: Category[];

   // Define the many-to-many relationship (a book belongs to multiple authors)
  @ManyToMany(() => Author, (author) => author.books)
  authors?: Author[];
}
