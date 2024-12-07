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
  
    @Index("fulltext_title_index",{ fulltext: true })
    @Column({unique:true})
    title: string;

    @OneToMany(() => Book, (book) => book.category)
    books: Book[]
  
  }