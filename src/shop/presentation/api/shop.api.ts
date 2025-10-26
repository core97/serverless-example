import 'reflect-metadata';
import 'dotenv/config';
import { handle } from 'hono/aws-lambda';
import { container } from '@/inversify.config';
import { HonoApi } from '@/shared/presentation/hono-api';
import { ShopRouter } from '@/shop/presentation/routers/shop.router';

function main() {
  const honoApi = container.get<HonoApi>(HonoApi.name);
  const shopRouter = container.get<ShopRouter>(ShopRouter.name);
  const shopApi = honoApi.run(shopRouter);

  return shopApi;
}

const app = await main();

export const handler = handle(app);
