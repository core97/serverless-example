import 'reflect-metadata';
import 'dotenv/config';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { showRoutes } from 'hono/dev';
import { handle } from 'hono/aws-lambda';
import { type Context as LambdaContext } from 'aws-lambda';
import { container } from '@/inversify.config';
import { LoggerService } from '@/shared/application/core/services/logger.service';
import { ContextService } from '@/shared/application/core/services/context.service';

/**
 * TODO:
 * - Hacer el logger con el contexto. Ver como se están guardando esos logs en CloudWatch.
 */

// Define los tipos de las variables de entorno disponibles en Hono
type Bindings = {
  lambdaContext?: LambdaContext;
};

function main() {
  const logger = container.get<LoggerService>(LoggerService.name);
  const contextService = container.get<ContextService>(ContextService.name);

  const app = new Hono<{ Bindings: Bindings }>().basePath('/api');

  app.use('*', async (c, next) => {
    const requestId = c.env.lambdaContext?.awsRequestId;
    const traceId = requestId || contextService.generateTraceId();

    await contextService.initializeStore(next, {
      request: { method: c.req.method, url: c.req.url },
      traceId,
    });

    c.res.headers.set(ContextService.httpHeaders.traceId, traceId);
  });

  // Middleware de logging personalizado
  app.use('*', async (c, next) => {
    const method = c.req.method;
    const path = new URL(c.req.url).pathname;

    logger.info(`-→ ${method} ${path}`);

    const startTime = Date.now();
    await next();
    const duration = Date.now() - startTime;

    logger.info(`←- ${method} ${path} ${duration}ms`);
  });

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
    logger.info('Health check endpoint called');

    return c.json({
      message: 'Hello world',
      status: 'OK',
    });
  });

  showRoutes(app, { colorize: true });

  return app;
}

const app = main();

export const handler = handle(app);
