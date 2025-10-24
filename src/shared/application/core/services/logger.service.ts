import { ContextService } from '@/shared/application/core/services/context.service';

export abstract class LoggerService {
  protected readonly MESSAGE_KEY = 'message';

  constructor(private readonly contextService: ContextService) {}

  abstract debug<T>(obj: T, msg?: string): void;

  abstract error(error: unknown, msg?: string): void;

  abstract info<T>(obj: T, msg?: string): void;

  abstract warn<T>(obj: T, msg?: string): void;

  getMetadataFromStore() {
    const httpStore = this.contextService.getStore();
    const { request, traceId } = httpStore || {};

    return {
      ...(request && { request }),
      ...(traceId && { traceId }),
    };
  }

  normalizeLogData<T>(obj: T, msg?: string) {
    return {
      ...(typeof obj === 'object' && obj),
      ...this.getMetadataFromStore(),
      [this.MESSAGE_KEY]: typeof obj === 'string' ? obj : msg,
    };
  }
}
