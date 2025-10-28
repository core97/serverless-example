import { createCronHandler } from '@/shared/presentation/lambda-handler-factory';
import { AuthorsListCron } from '@/author/presentation/crons/authors-list.cron';

export const handler = createCronHandler(AuthorsListCron.name);


