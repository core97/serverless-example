import { injectable } from 'inversify';
import { container } from '@/inversify.config';
import { LoggerService } from '@/shared/application/core/services/logger.service';
import { ContextService } from '@/shared/application/core/services/context.service';
import { PrismaDb } from '@/shared/infra/database/prisma-database';

@injectable()
export abstract class CronJob {
  // Must be defined by the concrete cron job
  protected abstract readonly cronName: string;

  // Lazy-loaded dependencies from container
  private _logger?: LoggerService;
  private _contextService?: ContextService;
  private _prismaDb?: PrismaDb;

  protected get logger(): LoggerService {
    if (!this._logger) {
      this._logger = container.get<LoggerService>(LoggerService.name);
    }
    return this._logger;
  }

  protected get contextService(): ContextService {
    if (!this._contextService) {
      this._contextService = container.get<ContextService>(ContextService.name);
    }
    return this._contextService;
  }

  protected get prismaDb(): PrismaDb {
    if (!this._prismaDb) {
      this._prismaDb = container.get<PrismaDb>(PrismaDb.name);
    }
    return this._prismaDb;
  }

  async execute(): Promise<void> {
    const store = {
      traceId: this.contextService.generateTraceId(),
      cron: {
        name: this.cronName,
      },
    };

    await this.contextService.initializeStore(async () => {
      const startTime = Date.now();
      let durationMs = -1;

      try {
        this.logger.info(`-> Starting ${this.cronName} cron job`);

        await this.prismaDb.connect();

        await this.start();
        await this.run();
        await this.finish();

        durationMs = Date.now() - startTime;
      } catch (error) {
        this.logger.error(error, `Error in cron job ${this.cronName}:`);

        await this.handleError(error);
      } finally {
        this.logger.info(`<- Finishing ${this.cronName} cron job (${durationMs}ms)`);
        await this.prismaDb.disconnect();
      }
    }, store);
  }

  // Must be implemented by the concrete use case
  protected abstract run(): Promise<void>;

  private async start(): Promise<void> {
    // TODO: registrar en base de datos
  }

  private async finish(): Promise<void> {
    // TODO: registrar en base de datos
  }

  protected async handleError(error: unknown): Promise<void> {
    // TODO: registrar en base de datos
  }
}
