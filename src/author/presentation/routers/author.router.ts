import { Hono } from 'hono';
import { injectable } from 'inversify';
import { HonoRouter, HonoEnv } from '@/shared/presentation/types/hono-api.type';
import { AuthorError } from '@/author/domain/errors/author.error';

@injectable()
export class AuthorRouter extends HonoRouter {
  constructor() {
    super({ basePath: '/api/authors' });
  }

  run(app: Hono<HonoEnv>): void {
    app.get('/', async c => {
      const authors = [
        { name: 'Cervantes' },
        { name: 'Gabriel Garcia Marquez' },
        { name: 'Isabel Allende' },
        { name: 'J.K. Rowling' },
      ];

      return c.json(authors);
    });

    app.get('/:authorId', async c => {
      const authorId = c.req.param('authorId');
      return c.json({ authorId });
    });

    app.get('/error', async () => {
      throw new AuthorError.Example('Esto es un error provocado de prueba desde el router');
    });
  }
}
