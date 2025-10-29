import { z } from 'zod';
import { PaginationParamsSchema } from '@/shared/application/core/schemas/pagination.schema';

export const BooksListGet = z
  .object({ title: z.string(), authorId: z.uuid() })
  .extend(PaginationParamsSchema.shape)
  .partial();

export const BookPost = z.object({
  title: z.string().nonempty(),
  isPulished: z.boolean().optional().default(false),
  authorId: z.uuid(),
});

export const BookPatch = BookPost.partial();
