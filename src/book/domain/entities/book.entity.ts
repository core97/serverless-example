import { Entity, EntityProps } from '@/shared/domain/types/entity.type';

export class Book extends Entity {
  authorId: string;

  isPublished: boolean;

  title: string;

  constructor(params: Partial<EntityProps> & Pick<Book, 'authorId' | 'isPublished' | 'title'>) {
    super(params);
    this.authorId = params.authorId;
    this.isPublished = params.isPublished;
    this.title = params.title;
  }
}
