import { Entity, EntityProps } from '@/shared/domain/types/entity.type';

export class Book extends Entity {
  authorId: string;

  title: string;

  constructor(params: Partial<EntityProps> & Pick<Book, 'authorId' | 'title'>) {
    super(params);
    this.authorId = params.authorId;
    this.title = params.title;
  }
}
