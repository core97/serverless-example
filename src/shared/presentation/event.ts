import { injectable } from 'inversify';
import { container } from '@/inversify.config';
import { LoggerService } from '@/shared/application/core/services/logger.service';
import { ContextService } from '@/shared/application/core/services/context.service';
import { EnvVarsService } from '@/shared/application/core/services/env-vars.service';

@injectable()
export abstract class Event<Input> {
  // Must be defined by the concrete event
  protected abstract readonly eventName: string;

  // Lazy-loaded dependencies from container
  private _logger?: LoggerService;
  private _contextService?: ContextService;

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

  async execute(input: Input): Promise<void> {
    const store = {
      traceId: this.contextService.generateTraceId(),
      event: {
        name: this.eventName,
      },
    };

    await this.contextService.initializeStore(async () => {
      const startTime = Date.now();
      let durationMs = -1;

      try {
        this.logger.info(`-> Starting ${this.eventName} event`);

        EnvVarsService.validateEnvVars();

        await this.start();
        await this.run(input);
        await this.finish();

        durationMs = Date.now() - startTime;
      } catch (error) {
        this.logger.error(error, `Error in event ${this.eventName}:`);

        await this.handleError(error);
      } finally {
        this.logger.info(`<- Finishing ${this.eventName} event (${durationMs}ms)`);
      }
    }, store);
  }

  // Must be implemented by the concrete use case
  protected abstract run(input: Input): Promise<void>;

  private async start(): Promise<void> {
    // TODO: registrar en base de datos y guardar el input
  }

  private async finish(): Promise<void> {
    // TODO: registrar en base de datos y borrar el input recibido
  }

  protected async handleError(error: unknown): Promise<void> {
    // TODO: registrar en base de datos
  }
}
