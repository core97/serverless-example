import { inject, injectable } from 'inversify';
import { Prisma } from '@prisma/client';
import { PrismaDb } from '@/shared/infra/database/prisma-database';
import { AuthorRepo } from '@/author/domain/repositories/author.repository';
import { Author } from '@/author/domain/entities/author.entity';
import { Book } from '@/book/domain/entities/book.entity';

@injectable()
export class PrismaAuthorRepo implements AuthorRepo {
  constructor(@inject(PrismaDb.name) private readonly prismaDb: PrismaDb) {}

  async create(...params: Parameters<AuthorRepo['create']>): ReturnType<AuthorRepo['create']> {
    const [data] = params;

    const result = await this.prismaDb.client.author.create({ data });

    return new Author(result);
  }

  async deleteOneById(
    ...params: Parameters<AuthorRepo['deleteOneById']>
  ): ReturnType<AuthorRepo['deleteOneById']> {
    const [authorId] = params;

    await this.prismaDb.client.$transaction([
      this.prismaDb.client.book.deleteMany({ where: { authorId } }),
      this.prismaDb.client.author.delete({ where: { id: authorId } }),
    ]);
  }

  async findMany(
    ...params: Parameters<AuthorRepo['findMany']>
  ): ReturnType<AuthorRepo['findMany']> {
    const [{ limit, skip, name }] = params;

    const where: Prisma.AuthorWhereInput = {
      ...(name && { name: { mode: 'insensitive', contains: name } }),
    };

    const [results, total] = await Promise.all([
      this.prismaDb.client.author.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prismaDb.client.author.count({ where }),
    ]);

    return {
      results: results.map(el => new Author(el)),
      total,
    };
  }

  async findOneById(
    ...params: Parameters<AuthorRepo['findOneById']>
  ): ReturnType<AuthorRepo['findOneById']> {
    const [id] = params;

    const result = await this.prismaDb.client.author.findUnique({
      where: { id },
    });

    if (!result) return null;

    return new Author(result);
  }

  async findOneByIdForDetails(
    ...params: Parameters<AuthorRepo['findOneByIdForDetails']>
  ): ReturnType<AuthorRepo['findOneByIdForDetails']> {
    const [id] = params;

    const result = await this.prismaDb.client.author.findUnique({
      where: { id },
      include: { books: true },
    });

    if (!result) return null;

    const { books, ...author } = result;

    return { author: new Author(author), books: books.map(el => new Book(el)) };
  }

  async updateOneById(
    ...params: Parameters<AuthorRepo['updateOneById']>
  ): ReturnType<AuthorRepo['updateOneById']> {
    const [id, data] = params;

    const update = await this.prismaDb.client.author.update({
      where: { id },
      data,
    });

    return new Author(update);
  }
}
