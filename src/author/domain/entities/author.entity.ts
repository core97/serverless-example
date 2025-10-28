import { Entity, EntityProps } from '@/shared/domain/types/entity.type';

export class Author extends Entity {
  name: string;

  constructor(params: Partial<EntityProps> & Pick<Author, 'name'>) {
    super(params);
    this.name = params.name;
  }
}
