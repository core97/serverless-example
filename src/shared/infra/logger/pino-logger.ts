import { inject, injectable } from 'inversify';
import { pino, type Logger } from 'pino';
import { EnvVarsService } from '@/shared/application/core/services/env-vars.service';
import { LoggerService } from '@/shared/application/core/services/logger.service';
import { ContextService } from '@/shared/application/core/services/context.service';

@injectable()
export class PinoLogger extends LoggerService {
  private pinoLogger: Logger;

  constructor(@inject(ContextService.name) contextService: ContextService) {
    super(contextService);

    const { NODE_ENV } = EnvVarsService.getEnvVars();
    const isDevelopment = NODE_ENV === 'development';

    this.pinoLogger = pino({
      messageKey: this.MESSAGE_KEY,
      level: 'info',
      formatters: {
        level(label) {
          return { level: label };
        },
      },
      timestamp: pino.stdTimeFunctions.isoTime,
      // Only use pino-pretty in LOCAL development, NEVER in Lambda.
      ...(isDevelopment && {
        transport: {
          target: 'pino-pretty',
          options: {
            messageKey: this.MESSAGE_KEY,
            singleLine: true,
          },
        },
      }),
    });
  }

  info<T>(obj: T, msg?: string): void {
    this.pinoLogger.info(this.normalizeLogData(obj, msg));
  }

  warn<T>(obj: T, msg?: string): void {
    this.pinoLogger.warn(this.normalizeLogData(obj, msg));
  }

  debug<T>(obj: T, msg?: string): void {
    this.pinoLogger.debug(this.normalizeLogData(obj, msg));
  }

  error(error: unknown, msg?: string): void {
    this.pinoLogger.error({
      ...this.getMetadataFromStore(),
      ...(!!msg && { [this.MESSAGE_KEY]: msg }),
      err: error,
    });
  }
}
