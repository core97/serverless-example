import 'dotenv/config';
import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';
import { showRoutes } from 'hono/dev';
import { handle } from 'hono/aws-lambda';

function main() {
  const app = new Hono().basePath('/api');

  app.use('*', logger());

  app.use('*', cors());

  app.onError((err, c) => {
    console.error(err);

    return c.json(
      {
        code: '000',
        message: 'Uncontrolled unexpected error',
        name: 'UnknownError',
      },
      500,
    );
  });

  app.get('/health', c => c.json({ message: 'Hello world', status: 'OK' }));

  showRoutes(app, { colorize: true });

  return app;
}

const app = main();

export const handler = handle(app);
