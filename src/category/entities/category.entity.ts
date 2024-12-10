import { Book } from 'src/book/entities/book.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Index,
} from 'typeorm';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  // Add full text search index to enhance performance
  @Index('fulltext_title_index', { fulltext: true })
  @Column({ unique: true })
  title: string;
}
