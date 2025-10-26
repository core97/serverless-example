import 'reflect-metadata';
import 'dotenv/config';
import { handle } from 'hono/aws-lambda';
import { container } from '@/inversify.config';
import { HonoApi } from '@/shared/presentation/hono-api';
import { ShopRouter } from '@/shop/presentation/routers/shop.router';

async function createApp() {
  const honoApi = container.get<HonoApi>(HonoApi.name);
  const shopRouter = container.get<ShopRouter>(ShopRouter.name);
  const shopApi = await honoApi.run(shopRouter);

  return shopApi;
}

let appPromise: ReturnType<typeof createApp> | null = null;

export const handler = async (event: any, context: any) => {
  if (!appPromise) {
    appPromise = createApp();
  }
  const app = await appPromise;
  return handle(app)(event, context);
};
