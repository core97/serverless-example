import { z } from 'zod';
import { TextHelper } from '@/shared/domain/helpers/text.helper';

export const PaginationParamsSchema = z.object({
  limit: z
    .string()
    .regex(TextHelper.regex.positiveIntegerDigits)
    .transform(value => Number(value)),
  skip: z
    .string()
    .regex(TextHelper.regex.positiveIntegerDigits)
    .transform(value => Number(value)),
});
