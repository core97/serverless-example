import { inject, injectable } from 'inversify';
import { UseCase } from '@/shared/application/core/types/use-case.type';
import { LoggerService } from '@/shared/application/core/services/logger.service';
import { Author } from '@/author/domain/entities/author.entity';
import { AuthorRepo } from '../domain/repositories/author.repository';

type Input = { author: Author };

type Output = void;

@injectable()
export class AuthorCreation extends UseCase<Input, Output> {
  constructor(
    @inject(LoggerService.name) private readonly logger: LoggerService,
    @inject(AuthorRepo.name) private readonly authorRepo: AuthorRepo,
  ) {
    super();
  }

  protected async run({ author }: Input): Promise<Output> {
    this.logger.info(`Creating author: ${author.name}`);

    await this.authorRepo.create(author);

    this.logger.info(`Author "${author.name}" created successfully`);
  }
}
