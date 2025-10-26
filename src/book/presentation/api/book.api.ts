import 'reflect-metadata';
import 'dotenv/config';
import { handle } from 'hono/aws-lambda';
import { container } from '@/inversify.config';
import { HonoApi } from '@/shared/presentation/hono-api';
import { BookRouter } from '@/book/presentation/routers/book.router';

function main() {
  const honoApi = container.get<HonoApi>(HonoApi.name);
  const bookRouter = container.get<BookRouter>(BookRouter.name);
  const bookApi = honoApi.run(bookRouter);

  return bookApi;
}

const app = await main();

export const handler = handle(app);
