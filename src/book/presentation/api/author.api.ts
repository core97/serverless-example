import 'reflect-metadata';
import 'dotenv/config';
import { handle } from 'hono/aws-lambda';
import { container } from '@/inversify.config';
import { HonoApi } from '@/shared/presentation/hono-api';
import { AuthorRouter } from '@/book/presentation/routers/author.router';

async function createApp() {
  const honoApi = container.get<HonoApi>(HonoApi.name);
  const authorRouter = container.get<AuthorRouter>(AuthorRouter.name);
  const authorApi = await honoApi.run(authorRouter);

  return authorApi;
}

let appPromise: ReturnType<typeof createApp> | null = null;

export const handler = async (event: any, context: any) => {
  if (!appPromise) {
    appPromise = createApp();
  }
  const app = await appPromise;
  return handle(app)(event, context);
};
