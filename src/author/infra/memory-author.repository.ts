import { injectable } from 'inversify';
import { mockAuthors, mockBooks } from 'data/mocks';
import { AuthorRepo } from '@/author/domain/repositories/author.repository';
import { Author } from '@/author/domain/entities/author.entity';
import { Book } from '@/book/domain/entities/book.entity';

@injectable()
export class MemoryAuthorRepo implements AuthorRepo {
  constructor() {}

  async create(...params: Parameters<AuthorRepo['create']>): ReturnType<AuthorRepo['create']> {
    const [data] = params;
    mockAuthors.push(data);
    return data;
  }

  async deleteOneById(
    ...params: Parameters<AuthorRepo['deleteOneById']>
  ): ReturnType<AuthorRepo['deleteOneById']> {
    const [authorId] = params;

    const index = mockAuthors.findIndex(author => author.id === authorId);

    if (index !== -1) {
      mockAuthors.splice(index, 1);
    }
  }

  async findMany(
    ...params: Parameters<AuthorRepo['findMany']>
  ): ReturnType<AuthorRepo['findMany']> {
    const [{ name }] = params;

    const results = mockAuthors.filter(el => {
      const conditions: boolean[] = [];

      if (name) {
        conditions.push(el.name.toLowerCase().includes(name.toLowerCase()));
      }

      return conditions.length === 0 ? true : conditions.every(condition => condition === true);
    });

    return {
      results: results.map(el => new Author(el)),
      total: mockAuthors.length,
    };
  }

  async findOneById(
    ...params: Parameters<AuthorRepo['findOneById']>
  ): ReturnType<AuthorRepo['findOneById']> {
    const [id] = params;

    const result = mockAuthors.find(el => el.id === id);

    if (!result) return null;

    return new Author(result);
  }

  async findOneByIdForDetails(
    ...params: Parameters<AuthorRepo['findOneByIdForDetails']>
  ): ReturnType<AuthorRepo['findOneByIdForDetails']> {
    const [id] = params;

    const author = mockAuthors.find(el => el.id === id);

    if (!author) return null;

    const books = mockBooks.filter(el => el.authorId === author.id);

    return { author: new Author(author), books: books.map(el => new Book(el)) };
  }

  async updateOneById(
    ...params: Parameters<AuthorRepo['updateOneById']>
  ): ReturnType<AuthorRepo['updateOneById']> {
    const [id, data] = params;

    const index = mockAuthors.findIndex(author => author.id === id);

    if (index === -1) {
      throw new Error(`Author with id ${id} not found to update`);
    }

    const updatedAuthor = new Author({
      ...mockAuthors[index],
      ...data,
      updatedAt: new Date(),
    });

    mockAuthors[index] = updatedAuthor;

    return updatedAuthor;
  }
}
