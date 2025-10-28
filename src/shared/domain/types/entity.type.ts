export type EntityProps = ConstructorParameters<typeof Entity>[0];

export abstract class Entity {
  createdAt: Date;

  id: string;

  updatedAt: Date;

  constructor(params: Partial<Pick<Entity, 'createdAt' | 'id' | 'updatedAt'>>) {
    const { createdAt, id, updatedAt } = Entity.generateProps();
    this.createdAt = params.createdAt ?? createdAt;
    this.id = params.id ?? id;
    this.updatedAt = params.updatedAt ?? updatedAt;
  }

  static generateId(): Entity['id'] {
    return crypto.randomUUID();
  }

  static generateProps(): Pick<Entity, 'id' | 'createdAt' | 'updatedAt'> {
    return {
      createdAt: new Date(),
      id: Entity.generateId(),
      updatedAt: new Date(),
    };
  }
}
