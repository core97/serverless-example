import { z } from 'zod';
import { PaginationParamsSchema } from '@/shared/application/core/schemas/pagination.schema';

export const AuthorsListGet = z
  .object({ name: z.string() })
  .extend(PaginationParamsSchema.shape)
  .partial();

export const AuthorPost = z.object({ name: z.string().nonempty() });

export const AuthorPatch = AuthorPost.partial();
