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

  protected async run({ book }: Input) {
    const author = await this.authorRepo.findOneById(book.authorId);

    this.logger.info(`${book.title} has been published!`);
    this.logger.info(`Thanks to the author ${author?.name}`);
  }
}
