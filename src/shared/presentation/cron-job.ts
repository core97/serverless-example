import { inject, injectable } from 'inversify';
import { LoggerService } from '@/shared/application/core/services/logger.service';
import { ContextService } from '@/shared/application/core/services/context.service';
import { PrismaDb } from '@/shared/infra/database/prisma-database';

@injectable()
export abstract class CronJob {
  // Must be defined by the concrete cron job
  protected abstract readonly cronName: string;

  protected readonly logger: LoggerService;

  protected readonly contextService: ContextService;

  protected readonly prismaDb: PrismaDb;

  constructor(
    @inject(LoggerService.name) logger: LoggerService,
    @inject(ContextService.name) contextService: ContextService,
    @inject(PrismaDb.name) prismaDb: PrismaDb,
  ) {
    this.logger = logger;
    this.contextService = contextService;
    this.prismaDb = prismaDb;
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
