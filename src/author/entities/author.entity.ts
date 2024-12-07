import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Index,
  } from 'typeorm';
  
  @Entity()
  export class Author {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Index("fulltext_title_index",{ fulltext: true })
    @Column()
    fullName: string;
  

  }