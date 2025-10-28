import { inject, injectable } from 'inversify';
import { CronJob } from '@/shared/presentation/cron-job';
import { LoggerService } from '@/shared/application/core/services/logger.service';
import { ContextService } from '@/shared/application/core/services/context.service';
import { PrismaDb } from '@/shared/infra/database/prisma-database';
import { AuthorRepo } from '@/author/domain/repositories/author.repository';

@injectable()
export class AuthorsListCron extends CronJob {
  protected readonly cronName = 'AuthorsListCron';

  constructor(
    @inject(LoggerService.name) logger: LoggerService,
    @inject(ContextService.name) contextService: ContextService,
    @inject(PrismaDb.name) prismaDb: PrismaDb,
    @inject(AuthorRepo.name) private readonly authorRepo: AuthorRepo,
  ) {
    super(logger, contextService, prismaDb);
  }

  protected async run(): Promise<void> {
    this.logger.info('Executing authors list cron logic...');

    const authors = await this.authorRepo.findMany({});

    authors.results.forEach(el => {
      this.logger.info(`There is an author "${el.name}" with id: ${el.id}`);
    });
  }
}
