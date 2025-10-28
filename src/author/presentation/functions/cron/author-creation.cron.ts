import { createCronHandler } from '@/shared/presentation/lambda-handler-factory';
import { AuthorCreationCron } from '@/author/presentation/crons/author-creation.cron';

export const handler = createCronHandler(AuthorCreationCron.name);


