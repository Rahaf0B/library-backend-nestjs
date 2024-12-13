import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from '../../book/entities/book.entity';
import { DataSource, Repository } from 'typeorm';
import { Author } from '../../author/entities/author.entity';
import { Category } from '../../category/entities/category.entity';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export default class MainDataSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    const bookRepository = dataSource.getRepository(Book);
    const authorRepository = dataSource.getRepository(Author);
    const categoryRepository = dataSource.getRepository(Category);

    const seedAuthors = [
      { id: 1, fullName: 'Joshua Bloch' },
      { id: 2, fullName: 'Herbert Schildt' },
      { id: 3, fullName: 'Robert C. Martin' },
      { id: 4, fullName: 'Kathy Sierra' },
      { id: 5, fullName: 'Bert Bates' },
      { id: 6, fullName: 'Craig Walls' },
      { id: 7, fullName: 'Andrew Hunt' },
      { id: 8, fullName: 'David Thomas' },
      { id: 9, fullName: 'Scott Oaks' },
      { id: 10, fullName: 'Martin Fowler' },
      { id: 11, fullName: 'Brian Goetz' },
      { id: 12, fullName: 'Eric Evans' },
      { id: 13, fullName: 'Raoul-Gabriel Urma' },
      { id: 14, fullName: 'Mario Fusco' },
      { id: 15, fullName: 'Alan Mycroft' },
      { id: 16, fullName: 'Erich Gamma' },
      { id: 17, fullName: 'Richard Helm' },
      { id: 18, fullName: 'Ralph Johnson' },
      { id: 19, fullName: 'John Vlissides' },
    ];

    const seedCategories = [
      { id: 1, title: 'Java' },
      { id: 2, title: 'Programming' },
    ];

    const seedBooks = [
      {
        id: 1,
        title: 'Effective Java',
        price: 40,
        publication_date: '2008-05-28',
        authors: [1],
        categories: [1],
      },
      {
        id: 2,
        title: 'Java: The Complete Reference',
        price: 35,
        publication_date: '2011-06-01',
        authors: [2],
        categories: [1],
      },
      {
        id: 3,
        title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
        price: 45,
        publication_date: '2008-08-01',
        authors: [3],
        categories: [2],
      },
      {
        id: 4,
        title: 'Head First Java',
        price: 30,
        publication_date: '2005-02-09',
        authors: [4, 5],
        categories: [1],
      },
      {
        id: 5,
        title: 'Spring in Action',
        price: 40,
        publication_date: '2011-11-15',
        authors: [6],
        categories: [1],
      },
      {
        id: 6,
        title: 'The Pragmatic Programmer',
        price: 50,
        publication_date: '1999-10-30',
        authors: [7, 8],
        categories: [2],
      },
      {
        id: 7,
        title: 'Java Performance: The Definitive Guide',
        price: 40,
        publication_date: '2014-04-14',
        authors: [9],
        categories: [1],
      },
      {
        id: 8,
        title: 'Refactoring: Improving the Design of Existing Code',
        price: 47,
        publication_date: '1999-07-08',
        authors: [10],
        categories: [2],
      },
      {
        id: 9,
        title: 'Java Concurrency in Practice',
        price: 40,
        publication_date: '2006-05-19',
        authors: [11],
        categories: [1],
      },
      {
        id: 10,
        title: 'Domain-Driven Design',
        price: 60,
        publication_date: '2003-08-30',
        authors: [12],
        categories: [2],
      },
      {
        id: 11,
        title: 'Modern Java in Action',
        price: 55,
        publication_date: '2018-08-24',
        authors: [13, 14, 15],
        categories: [1],
      },
      {
        id: 12,
        title: 'Design Patterns: Elements of Reusable Object-Oriented Software',
        price: 42,
        publication_date: '1994-10-21',
        authors: [16, 17, 18, 19],
        categories: [2],
      },
    ];

    // Seed categories only if the category table is empty
    const categoryCount = await categoryRepository.count();
    if (categoryCount === 0) {
      const categories = seedCategories.map((cat) =>
        categoryRepository.create(cat),
      );
      await categoryRepository.save(categories);
    }

    // Seed authors only if the author table is empty
    const authorCount = await authorRepository.count();
    if (authorCount === 0) {
      const authors = seedAuthors.map((auth) =>
        authorRepository.create({ id: auth.id, full_name: auth.fullName }),
      );
      await authorRepository.save(authors);
    }

    // Seed books only if the book table is empty
    const bookCount = await bookRepository.count();
    if (bookCount === 0) {
      for (const bookData of seedBooks) {
        const book = bookRepository.create({
          title: bookData.title,
          price: bookData.price,
          publication_date: bookData.publication_date,
        });
        book.authors = [];
        // Add relationships between book and categories and authors
        for (const authorId of bookData.authors) {
          
          const author = await authorRepository.findOne({
            where: { id: authorId },
          });
          if (author) {
            book.authors.push(author);
          }
        }
        book.categories = [];
        for (const categoryId of bookData.categories) {
          const category = await categoryRepository.findOne({
            where: { id: categoryId },
          });
          if (category) {
            book.categories.push(category);
          }
        }

        await bookRepository.save(book);
      }
    }

    console.log('Seeding Data Done!');
  }
}
