import { createHttpHandler } from '@/shared/presentation/lambda-handler-factory';
import { AuthorRouter } from '@/author/presentation/routers/author.router';

export const handler = createHttpHandler(AuthorRouter.name);
