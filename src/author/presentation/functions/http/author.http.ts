import { createLambdaHandler } from '@/shared/presentation/lambda-handler-factory';
import { AuthorRouter } from '@/author/presentation/routers/author.router';

export const handler = createLambdaHandler(AuthorRouter.name);
