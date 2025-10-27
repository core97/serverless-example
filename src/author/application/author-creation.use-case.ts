import { inject, injectable } from 'inversify';
import { UseCase } from '@/shared/application/core/types/use-case.type';
import { LoggerService } from '@/shared/application/core/services/logger.service';

type Input = { id: string };

type Output = void;

@injectable()
export class AuthorCreation extends UseCase<Input, Output> {
  constructor(@inject(LoggerService.name) private readonly logger: LoggerService) {
    super();
  }

  protected async run(params: Input): Promise<Output> {
    this.logger.info(`Creation author: ${params.id}`);
  }
}
