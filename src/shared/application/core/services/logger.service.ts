import { ContextService } from '@/shared/application/core/services/context.service';

export abstract class LoggerService {
  protected readonly MESSAGE_KEY = 'message';

  protected readonly OBJECT_KEY = 'data';

  constructor(private readonly contextService: ContextService) {}

  abstract debug<T>(obj: T, msg?: string): void;

  abstract error(error: unknown, msg?: string): void;

  abstract info<T>(obj: T, msg?: string): void;

  abstract warn<T>(obj: T, msg?: string): void;

  getMetadataFromStore() {
    const store = this.contextService.getStore();
    const { request, traceId, cron, event } = store || {};

    return {
      ...(request && { request }),
      ...(cron && { cron }),
      ...(event && { event }),
      ...(traceId && { traceId }),
    };
  }

  normalizeLogData<T>(obj: T, msg?: string) {
    return {
      ...(typeof obj === 'object' && { [this.OBJECT_KEY]: obj }),
      ...this.getMetadataFromStore(),
      [this.MESSAGE_KEY]: typeof obj === 'string' ? obj : msg,
    };
  }
}

/**
 * How to find logs in CloudWatch:
 * - Go to CloudWatch -> Logs -> Log groups in AWS Console
 * - You can filter logs:
 *    + By level:
 *        * { $.level = "info" }
 *        * { $.level = "info" && $.request.method = "GET" }
 *        * { $.level = "info" || $.level = "warn" }
 *        * { $.level != "info" }
 *   + By words included:
 *        * { $.message = "*check*" }
 *        * { $.request.url = "*\/api/health*" }
 *   + By event name:
 *        * { $.event.name = "PublishedBook" }
 *        * { $.level = "error" && $.event.name = "PublishedBook" }
 *   + By cron name:
 *        * { $.cron.name = "AuthorsListCron" }
 *        * { $.level = "error" && $.cron.name = "AuthorsListCron" }
 */
