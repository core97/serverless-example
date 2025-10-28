import { injectable } from 'inversify';
import { AsyncLocalStorage } from 'node:async_hooks';
import { randomUUID } from 'node:crypto';

type ContextStore = {
  cron?: {
    name: string;
  };
  request?: {
    method: string;
    url: string;
  };
  traceId: string;
};

@injectable()
export class ContextService {
  private store = new AsyncLocalStorage<ContextStore>();

  static readonly httpHeaders = {
    traceId: 'X-Trace-Id',
  };

  initializeStore<R>(callback: () => R, store: ContextStore): R {
    return this.store.run(store, callback);
  }

  getStore(): ContextStore | undefined {
    return this.store.getStore();
  }

  generateTraceId(): string {
    return randomUUID();
  }
}
