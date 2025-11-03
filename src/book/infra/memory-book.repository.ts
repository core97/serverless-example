import { injectable } from 'inversify';
import { mockBooks } from 'data/mocks';
import { BookRepo } from '@/book/domain/repositories/book.repository';
import { Book } from '@/book/domain/entities/book.entity';
import { BookError } from '@/book/domain/errors/book.error';

@injectable()
export class MemoryBookRepo implements BookRepo {
  constructor() {}

  async create(...params: Parameters<BookRepo['create']>): ReturnType<BookRepo['create']> {
    const [data] = params;
    mockBooks.push(data);
    return data;
  }

  async deleteOneById(
    ...params: Parameters<BookRepo['deleteOneById']>
  ): ReturnType<BookRepo['deleteOneById']> {
    const [bookId] = params;

    const index = mockBooks.findIndex(book => book.id === bookId);

    if (index === -1) {
      throw new BookError.NotFoundById(`Book with id ${bookId} not found to update`);
    } else {
      mockBooks.splice(index, 1);
    }
  }

  async findMany(...params: Parameters<BookRepo['findMany']>): ReturnType<BookRepo['findMany']> {
    const [{ title, authorId }] = params;

    const results = mockBooks.filter(el => {
      const conditions: boolean[] = [];

      if (title) {
        conditions.push(el.title.toLowerCase().includes(title.toLowerCase()));
      }

      if (authorId) {
        conditions.push(el.authorId === authorId);
      }

      return conditions.length === 0 ? true : conditions.every(condition => condition === true);
    });

    return {
      results: results.map(el => new Book(el)),
      total: mockBooks.length,
    };
  }

  async findOneById(
    ...params: Parameters<BookRepo['findOneById']>
  ): ReturnType<BookRepo['findOneById']> {
    const [id] = params;

    const result = mockBooks.find(el => el.id === id);

    if (!result) return null;

    return new Book(result);
  }

  async updateOneById(
    ...params: Parameters<BookRepo['updateOneById']>
  ): ReturnType<BookRepo['updateOneById']> {
    const [id, data] = params;

    const index = mockBooks.findIndex(book => book.id === id);

    if (index === -1) {
      throw new BookError.NotFoundById(`Book with id ${id} not found to update`);
    }

    const updatedBook = new Book({
      ...mockBooks[index],
      ...data,
      updatedAt: new Date(),
    });

    mockBooks[index] = updatedBook;

    return updatedBook;
  }
}
