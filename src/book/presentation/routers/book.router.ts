import { Hono } from 'hono';
import { injectable } from 'inversify';
import { HonoRouter, HonoEnv } from '@/shared/presentation/types/hono-api.type';

@injectable()
export class BookRouter extends HonoRouter {
  constructor() {
    super({ basePath: '/books' });
  }

  run(app: Hono<HonoEnv>): void {
    app.get('/', async c => {
      const books = [
        { name: 'El poder del ahora' },
        { name: 'Atomic Habits' },
        { name: '1984' },
        { name: 'Cien años de soledad' },
        { name: 'Don Quijote de la Mancha' },
      ];

      return c.json(books);
    });
  }
}
