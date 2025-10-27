import { createLambdaHandler } from '@/shared/presentation/lambda-handler-factory';
import { AuthorRouter } from '@/book/presentation/routers/author.router';

export const handler = createLambdaHandler(AuthorRouter.name);
