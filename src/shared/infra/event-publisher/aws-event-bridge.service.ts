import { injectable } from 'inversify';
import { EventBridgeClient, PutEventsCommand } from '@aws-sdk/client-eventbridge';
import { EventPublisher } from '@/shared/application/core/services/event-publisher.service';
import { EnvVarsService } from '@/shared/application/core/services/env-vars.service';

@injectable()
export class AwsEventBridgePublisher extends EventPublisher {
  private readonly client: EventBridgeClient;

  constructor() {
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
    const command = new PutEventsCommand({
      Entries: [
        {
          Source: params.source,
          DetailType: params.detailType,
          Detail: JSON.stringify(params.detail),
        },
      ],
    });

    await this.client.send(command);
  }
}
