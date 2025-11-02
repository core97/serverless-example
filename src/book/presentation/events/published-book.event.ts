import { inject, injectable } from 'inversify';
import { Event } from '@/shared/presentation/event';
import { Book } from '@/book/domain/entities/book.entity';
import { AuthorRepo } from '@/author/domain/repositories/author.repository';

type Input = { book: Book };

@injectable()
export class PublishedBook extends Event<Input> {
  protected eventName = 'PublishedBook';

  constructor(@inject(AuthorRepo.name) private readonly authorRepo: AuthorRepo) {
    super();
  }

  protected async run(input: Input) {
    this.logger.info('Executing PublishedBook event');
    this.logger.info(input);

    const author = await this.authorRepo.findOneById(input?.book?.authorId);

    this.logger.info(`${input?.book?.title} has been published!`);
    this.logger.info(`Thanks to the author ${author?.name}`);
  }
}
