import 'source-map-support/register';
import 'reflect-metadata';
import 'dotenv/config';
import { handle } from 'hono/aws-lambda';
import { HonoApi } from '@/shared/presentation/hono-api';
import { HonoRouter } from '@/shared/presentation/types/hono-api.type';
import { CronJob } from '@/shared/presentation/cron-job';
import { container } from '@/inversify.config';

export function createHttpHandler(routerName: string) {
  async function createApp() {
    const honoApi = container.get<HonoApi>(HonoApi.name);

    const router = container.get<HonoRouter>(routerName);

    const app = await honoApi.run(router);
    return app;
  }

  let appPromise: ReturnType<typeof createApp> | null = null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return async (event: any, context: any) => {
    if (!appPromise) {
      appPromise = createApp();
    }
    const app = await appPromise;
    return handle(app)(event, context);
  };
}

export function createCronHandler(cronJobName: string) {
  let cronJobInstance: CronJob | null = null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return async (_event: any, _context: any) => {
    if (!cronJobInstance) {
      cronJobInstance = container.get<CronJob>(cronJobName);
    }

    await cronJobInstance.execute();
  };
}
