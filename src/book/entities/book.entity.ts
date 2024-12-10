import { Author } from 'src/author/entities/author.entity';
import { Category } from 'src/category/entities/category.entity';
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

  @Column()
  price: number;

  @Column({ type: 'date' })
  publication_date: String;

  @ManyToMany(() => Category)
  @JoinTable()
  category: Category[];

  @ManyToMany(() => Author)
  @JoinTable()
  author: Author[];
}
