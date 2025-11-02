import 'source-map-support/register';
import 'reflect-metadata';
import 'dotenv/config';
import { handle } from 'hono/aws-lambda';
import { HonoApi } from '@/shared/presentation/hono-api';
import { HonoRouter } from '@/shared/presentation/types/hono-api.type';
import { CronJob } from '@/shared/presentation/cron-job';
import { Event } from '@/shared/presentation/event';
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createEventHandler<Input = any>(eventName: string) {
  let eventInstance: Event<Input> | null = null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return async (event: any, _context: any) => {
    if (!eventInstance) {
      eventInstance = container.get<Event<Input>>(eventName);
    }

    // Extract the 'detail' field from EventBridge event structure
    // EventBridge sends events with this structure:
    // { version, id, detail-type, source, account, time, region, resources, detail }
    // The actual payload is in the 'detail' field
    const payload = event.detail || event;

    await eventInstance.execute(payload);
  };
}
