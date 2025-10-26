import 'reflect-metadata';
import 'dotenv/config';
import { handle } from 'hono/aws-lambda';
import { container } from '@/inversify.config';
import { HonoApi } from '@/shared/presentation/hono-api';
import { AuthorRouter } from '@/book/presentation/routers/author.router';

function main() {
  const honoApi = container.get<HonoApi>(HonoApi.name);
  const authorRouter = container.get<AuthorRouter>(AuthorRouter.name);
  const authorApi = honoApi.run(authorRouter);

  return authorApi;
}

const app = await main();

export const handler = handle(app);
