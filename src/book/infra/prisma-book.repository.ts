import { inject, injectable } from 'inversify';
import { Prisma } from '@prisma/client';
import { PrismaDb } from '@/shared/infra/database/prisma-database';
import { BookRepo } from '@/book/domain/repositories/book.repository';
import { Book } from '@/book/domain/entities/book.entity';

@injectable()
export class PrismaBookRepo implements BookRepo {
  constructor(@inject(PrismaDb.name) private readonly prismaDb: PrismaDb) {}

  async create(...params: Parameters<BookRepo['create']>): ReturnType<BookRepo['create']> {
    const [data] = params;

    const result = await this.prismaDb.client.book.create({ data });

    return new Book(result);
  }

  async deleteOneById(
    ...params: Parameters<BookRepo['deleteOneById']>
  ): ReturnType<BookRepo['deleteOneById']> {
    const [bookId] = params;

    await this.prismaDb.client.book.delete({ where: { id: bookId } });
  }

  async findMany(...params: Parameters<BookRepo['findMany']>): ReturnType<BookRepo['findMany']> {
    const [{ limit, skip, authorId, title }] = params;

    const where: Prisma.BookWhereInput = {
      ...(authorId && { authorId }),
      ...(title && { title: { mode: 'insensitive', contains: title } }),
    };

    const [results, total] = await Promise.all([
      this.prismaDb.client.book.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prismaDb.client.book.count({ where }),
    ]);

    return {
      results: results.map(el => new Book(el)),
      total,
    };
  }

  async findOneById(
    ...params: Parameters<BookRepo['findOneById']>
  ): ReturnType<BookRepo['findOneById']> {
    const [id] = params;

    const result = await this.prismaDb.client.book.findUnique({
      where: { id },
    });

    if (!result) return null;

    return new Book(result);
  }

  async updateOneById(
    ...params: Parameters<BookRepo['updateOneById']>
  ): ReturnType<BookRepo['updateOneById']> {
    const [id, data] = params;

    const update = await this.prismaDb.client.book.update({
      where: { id },
      data,
    });

    return new Book(update);
  }
}
