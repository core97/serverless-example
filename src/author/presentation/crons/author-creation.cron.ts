import { inject, injectable } from 'inversify';
import { CronJob } from '@/shared/presentation/cron-job';
import { LoggerService } from '@/shared/application/core/services/logger.service';
import { ContextService } from '@/shared/application/core/services/context.service';
import { AuthorError } from '@/author/domain/errors/author.error';

@injectable()
export class AuthorCreationCron extends CronJob {
  protected readonly cronName = 'AuthorCreationCron';

  constructor(
    @inject(LoggerService.name) logger: LoggerService,
    @inject(ContextService.name) contextService: ContextService,
  ) {
    super(logger, contextService);
  }

  protected async run(): Promise<void> {
    this.logger.info('Executing author creation cron logic...');
    throw new AuthorError.Example('Esto es un error provocado de prueba desde el cron');
  }
}
