import { Hono } from 'hono';
import { inject, injectable } from 'inversify';
import { zValidator } from '@hono/zod-validator';
import { HonoRouter, HonoEnv } from '@/shared/presentation/types/hono-api.type';
import { BookPatch, BookPost, BooksListGet } from '@/book/presentation/dtos/book.dto';
import { BookRepo } from '@/book/domain/repositories/book.repository';
import { Book } from '@/book/domain/entities/book.entity';
import { BookError } from '@/book/domain/errors/book.error';
import { EventPublisher } from '@/shared/application/core/services/event-publisher.service';
import { LoggerService } from '@/shared/application/core/services/logger.service';

@injectable()
export class BookRouter extends HonoRouter {
  constructor(
    @inject(BookRepo.name) private readonly bookRepo: BookRepo,
    @inject(EventPublisher.name) private readonly eventPublisher: EventPublisher,
    @inject(LoggerService.name) private readonly logger: LoggerService,
  ) {
    super({ basePath: '/api/books' });
  }

  run(app: Hono<HonoEnv>): void {
    app.get('/', zValidator('query', BooksListGet), async c => {
      const { limit, authorId, title, skip } = c.req.valid('query');

      const books = await this.bookRepo.findMany({ authorId, title, limit, skip });

      return c.json(books);
    });

    app.get('/:bookId', async c => {
      const bookId = c.req.param('bookId');

      const book = await this.bookRepo.findOneById(bookId);

      if (!book) {
        throw new BookError.NotFoundById(`Book not found by id: ${bookId}`);
      }

      return c.json({ book });
    });

    app.delete('/:bookId', async c => {
      const bookId = c.req.param('bookId');

      const book = await this.bookRepo.findOneById(bookId);

      if (!book) {
        throw new BookError.NotFoundById(`Book not found by id: ${bookId}`);
      }

      await this.bookRepo.deleteOneById(bookId);

      return c.json({ bookId });
    });

    app.patch('/:bookId', zValidator('json', BookPatch), async c => {
      const bookId = c.req.param('bookId');
      const data = c.req.valid('json');

      const previousBook = await this.bookRepo.findOneById(bookId);

      const book = await this.bookRepo.updateOneById(bookId, data);

      if (previousBook?.isPublished === false && book.isPublished) {
        this.logger.info('Book publication detected, publishing event...');

        await this.eventPublisher.publish({
          source: 'custom.books',
          detailType: 'BookPublished',
          detail: { book },
        });
      }

      return c.json(book);
    });

    app.post('/', zValidator('json', BookPost), async c => {
      const data = c.req.valid('json');

      const book = new Book({
        authorId: data.authorId,
        isPublished: data.isPublished,
        title: data.title,
      });

      await this.bookRepo.create(book);

      if (book.isPublished) {
        await this.eventPublisher.publish({
          source: 'custom.books',
          detailType: 'BookPublished',
          detail: { book },
        });
      }

      return c.json({ book }, 201);
    });
  }
}
