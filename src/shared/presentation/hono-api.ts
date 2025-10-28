import { inject, injectable } from 'inversify';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { HonoRouter, HonoEnv } from '@/shared/presentation/types/hono-api.type';
import { LoggerService } from '@/shared/application/core/services/logger.service';
import { ContextService } from '@/shared/application/core/services/context.service';
import { AppError } from '@/shared/domain/types/app-error.type';
import { PrismaDb } from '@/shared/infra/database/prisma-database';

@injectable()
export class HonoApi {
  constructor(
    @inject(LoggerService.name) private readonly logger: LoggerService,
    @inject(ContextService.name) private readonly contextService: ContextService,
    @inject(PrismaDb.name) private readonly prismaDb: PrismaDb,
  ) {}

  async run(router: HonoRouter | HonoRouter[]): Promise<Hono<HonoEnv>> {
    try {
      const routers = Array.isArray(router) ? router : [router];

      await this.prismaDb.connect();

      const app = new Hono<HonoEnv>();

      this.initalizeContext(app);

      this.handleGlobalError(app);

      this.showRequest(app);

      app.use('*', cors());

      this.attachRouters(routers, app);

      this.showRoutes(app);

      return app;
    } catch (error) {
      await this.prismaDb.disconnect();
      throw error;
    }
  }

  private attachRouters(routers: HonoRouter[], rootApp: Hono<HonoEnv>) {
    const newApp = new Hono<HonoEnv>();
    for (const router of routers) {
      router.run(newApp);
      rootApp.route(router.basePath, newApp);
    }
  }

  private handleGlobalError(app: Hono<HonoEnv>) {
    app.onError((err, c) => {
      const [req, res] = [c.req.raw, c.res];

      this.logger.error(err);

      return err instanceof AppError
        ? err.getResponse(req, res)
        : AppError.getDefaultResponse(req, res);
    });
  }

  private initalizeContext(app: Hono<HonoEnv>) {
    app.use('*', async (c, next) => {
      const requestId = c.env.lambdaContext?.awsRequestId;
      const traceId = requestId || this.contextService.generateTraceId();

      await this.contextService.initializeStore(next, {
        request: { method: c.req.method, url: c.req.url },
        traceId,
      });

      c.res.headers.set(ContextService.httpHeaders.traceId, traceId);
    });
  }

  private showRequest(app: Hono<HonoEnv>) {
    // Middleware de logging personalizado
    app.use('*', async (c, next) => {
      const method = c.req.method;
      const path = new URL(c.req.url).pathname;

      this.logger.info(`-→ ${method} ${path}`);

      const startTime = Date.now();
      await next();
      const duration = Date.now() - startTime;

      this.logger.info(`←- ${method} ${path} ${duration}ms`);
    });
  }

  private showRoutes(app: Hono<HonoEnv>): void {
    for (const route of app.routes) {
      this.logger.info(`${route.method}  ${route.path}`);
    }
  }
}
