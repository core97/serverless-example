import { createHttpHandler } from '@/shared/presentation/lambda-handler-factory';
import { BookRouter } from '@/book/presentation/routers/book.router';

export const handler = createHttpHandler(BookRouter.name);
