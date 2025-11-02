import { inject, injectable } from 'inversify';
import { EventBridgeClient, PutEventsCommand } from '@aws-sdk/client-eventbridge';
import { EventPublisher } from '@/shared/application/core/services/event-publisher.service';
import { EnvVarsService } from '@/shared/application/core/services/env-vars.service';
import { LoggerService } from '@/shared/application/core/services/logger.service';

@injectable()
export class AwsEventBridgePublisher extends EventPublisher {
  private readonly client: EventBridgeClient;

  constructor(@inject(LoggerService.name) private readonly logger: LoggerService) {
    super();

    const { AWS_CREDENTIALS_ACCESS_KEY_ID, AWS_CREDENTIALS_SECRET_ACCESS_KEY, AWS_REGION } =
      EnvVarsService.getEnvVars();

    this.client = new EventBridgeClient({
      region: AWS_REGION,
      credentials: {
        accessKeyId: AWS_CREDENTIALS_ACCESS_KEY_ID,
        secretAccessKey: AWS_CREDENTIALS_SECRET_ACCESS_KEY,
      },
    });
  }

  async publish<T>(params: { source: string; detailType: string; detail: T }): Promise<void> {
    this.logger.info(`Publishing event to EventBridge: ${params.detailType} from ${params.source}`);
    this.logger.debug({ detail: params.detail }, 'Event detail:');

    const command = new PutEventsCommand({
      Entries: [
        {
          EventBusName: 'default', // Use default event bus (can be made configurable via env var)
          Source: params.source,
          DetailType: params.detailType,
          Detail: JSON.stringify(params.detail),
        },
      ],
    });

    const result = await this.client.send(command);

    // Check if the event was published successfully
    if (result.FailedEntryCount && result.FailedEntryCount > 0) {
      const error = result.Entries?.[0];
      this.logger.error(
        { error, failedEntryCount: result.FailedEntryCount },
        'Failed to publish event to EventBridge',
      );
      throw new Error(`Failed to publish event: ${error?.ErrorCode} - ${error?.ErrorMessage}`);
    }

    this.logger.info('Event published successfully to EventBridge');
  }
}
