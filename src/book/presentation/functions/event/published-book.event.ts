import { createEventHandler } from '@/shared/presentation/lambda-handler-factory';
import { PublishedBook } from '@/book/presentation/events/published-book.event';
import { Book } from '@/book/domain/entities/book.entity';

type Input = { book: Book };

export const handler = createEventHandler<Input>(PublishedBook.name);
