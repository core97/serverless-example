import 'dotenv/config';
import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';
import { showRoutes } from 'hono/dev';
import { handle } from 'hono/aws-lambda';
import { type Context as LambdaContext } from 'aws-lambda';

// Define los tipos de las variables de entorno disponibles en Hono
type Bindings = {
  lambdaContext?: LambdaContext;
};

function main() {
  const app = new Hono<{ Bindings: Bindings }>().basePath('/api');

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

  app.get('/health', c => {
    // El request ID de AWS Lambda está disponible en el contexto del evento
    // Ahora TypeScript conoce el tipo correcto de c.env.lambdaContext
    const requestId = c.env.lambdaContext?.awsRequestId;

    return c.json({
      message: 'Hello world',
      status: 'OK',
      requestId: requestId || 'not-available-in-local',
    });
  });

  showRoutes(app, { colorize: true });

  return app;
}

const app = main();

export const handler = handle(app);
