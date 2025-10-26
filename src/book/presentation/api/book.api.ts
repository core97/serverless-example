import 'reflect-metadata';
import 'dotenv/config';
import { handle } from 'hono/aws-lambda';
import { container } from '@/inversify.config';
import { HonoApi } from '@/shared/presentation/hono-api';
import { BookRouter } from '@/book/presentation/routers/book.router';

async function createApp() {
  const honoApi = container.get<HonoApi>(HonoApi.name);
  const bookRouter = container.get<BookRouter>(BookRouter.name);
  const bookApi = await honoApi.run(bookRouter);

  return bookApi;
}

let appPromise: ReturnType<typeof createApp> | null = null;

export const handler = async (event: any, context: any) => {
  if (!appPromise) {
    appPromise = createApp();
  }
  const app = await appPromise;
  return handle(app)(event, context);
};
