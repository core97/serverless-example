import { PaginationParams, PaginationResult } from '@/shared/domain/types/pagination.type';
import { Author } from '@/author/domain/entities/author.entity';
import { Book } from '@/book/domain/entities/book.entity';

export abstract class AuthorRepo {
  abstract create: (params: Author) => Promise<Author>;

  abstract deleteOneById: (id: Author['id']) => Promise<void>;

  abstract findMany: (
    filters: Partial<PaginationParams & Pick<Author, 'name'>>,
  ) => Promise<PaginationResult<Author>>;

  abstract findOneById: (id: Author['id']) => Promise<Author | null>;

  abstract findOneByIdForDetails: (
    id: Author['id'],
  ) => Promise<{ author: Author; books: Book[] } | null>;

  abstract updateOneById: (
    id: Author['id'],
    params: Partial<Pick<Author, 'name'>>,
  ) => Promise<Author>;
}
