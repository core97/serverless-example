import { inject, injectable } from 'inversify';
import { LoggerService } from '@/shared/application/core/services/logger.service';
import { ContextService } from '@/shared/application/core/services/context.service';

@injectable()
export abstract class CronJob {
  // Must be defined by the concrete cron job
  protected abstract readonly cronName: string;

  protected readonly logger: LoggerService;

  protected readonly contextService: ContextService;

  constructor(
    @inject(LoggerService.name) logger: LoggerService,
    @inject(ContextService.name) contextService: ContextService,
  ) {
    this.logger = logger;
    this.contextService = contextService;
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

      try {
        await this.start();
        await this.run();

        const duration = Date.now() - startTime;
        await this.finish(duration);

        this.logger.info(`Finished cron job: ${this.cronName}`);
      } catch (error) {
        await this.handleError(error);
      }
    }, store);
  }

  // Must be implemented by the concrete use case
  protected abstract run(): Promise<void>;

  private async start(): Promise<void> {
    this.logger.info(`-> Starting ${this.cronName} cron job`);
    // TODO: registrar en base de datos
  }

  private async finish(durationMs: number): Promise<void> {
    this.logger.info(`<- Finishing ${this.cronName} cron job (${durationMs}ms)`);
    // TODO: registrar en base de datos
  }

  protected async handleError(error: unknown): Promise<void> {
    this.logger.error(error, `Error in cron job ${this.cronName}:`);
    // TODO: registrar en base de datos
  }
}
