import 'reflect-metadata';
import 'dotenv/config';
import { handle } from 'hono/aws-lambda';
import { container } from '@/inversify.config';
import { HonoApi } from '@/shared/presentation/hono-api';
import { HonoRouter } from '@/shared/presentation/types/hono-api.type';

export function createLambdaHandler(routerName: string | string[]) {
  async function createApp() {
    const honoApi = container.get<HonoApi>(HonoApi.name);

    const routerNames = Array.isArray(routerName) ? routerName : [routerName];
    const routers = routerNames.map(name => container.get<HonoRouter>(name));

    const app = await honoApi.run(routers.length === 1 ? routers[0] : routers);
    return app;
  }

  let appPromise: ReturnType<typeof createApp> | null = null;

  return async (event: any, context: any) => {
    if (!appPromise) {
      appPromise = createApp();
    }
    const app = await appPromise;
    return handle(app)(event, context);
  };
}
