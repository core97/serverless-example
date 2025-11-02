export abstract class EventPublisher {
  abstract publish<T>(params: {
    source: string;
    detailType: string;
    detail: T;
  }): Promise<void>;
}
