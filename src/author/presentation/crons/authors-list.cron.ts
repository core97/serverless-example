import { inject, injectable } from 'inversify';
import { CronJob } from '@/shared/presentation/cron-job';
import { AuthorRepo } from '@/author/domain/repositories/author.repository';

@injectable()
export class AuthorsListCron extends CronJob {
  protected readonly cronName = 'AuthorsListCron';

  constructor(@inject(AuthorRepo.name) private readonly authorRepo: AuthorRepo) {
    super();
  }

  protected async run(): Promise<void> {
    this.logger.info('Executing authors list cron logic...');

    const authors = await this.authorRepo.findMany({});

    authors.results.forEach(el => {
      this.logger.info(`There is an author "${el.name}" with id: ${el.id}`);
    });
  }
}
