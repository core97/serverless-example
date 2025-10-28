import { Hono } from 'hono';
import { inject, injectable } from 'inversify';
import { zValidator } from '@hono/zod-validator';
import { HonoRouter, HonoEnv } from '@/shared/presentation/types/hono-api.type';
import { AuthorError } from '@/author/domain/errors/author.error';
import { AuthorCreation } from '@/author/application/author-creation.use-case';
import { Author } from '@/author/domain/entities/author.entity';
import { AuthorRepo } from '@/author/domain/repositories/author.repository';
import { AuthorPatch, AuthorPost, AuthorsListGet } from '@/author/presentation/dtos/author.dto';

@injectable()
export class AuthorRouter extends HonoRouter {
  constructor(
    @inject(AuthorRepo.name) private readonly authorRepo: AuthorRepo,
    @inject(AuthorCreation.name) private readonly authorCreation: AuthorCreation,
  ) {
    super({ basePath: '/api/authors' });
  }

  run(app: Hono<HonoEnv>): void {
    app.get('/', zValidator('query', AuthorsListGet), async c => {
      const { limit, name, skip } = c.req.valid('query');

      const authors = await this.authorRepo.findMany({ limit, name, skip });

      return c.json(authors);
    });

    app.get('/:authorId', async c => {
      const authorId = c.req.param('authorId');

      const author = await this.authorRepo.findOneByIdForDetails(authorId);

      if (!author) {
        throw new AuthorError.NotFoundById(`Author not found by id: ${authorId}`);
      }

      return c.json(author);
    });

    app.delete('/:authorId', async c => {
      const authorId = c.req.param('authorId');

      await this.authorRepo.deleteOneById(authorId);

      return c.json({ authorId });
    });

    app.patch('/:authorId', zValidator('json', AuthorPatch), async c => {
      const authorId = c.req.param('authorId');
      const data = c.req.valid('json');

      const author = await this.authorRepo.updateOneById(authorId, data);

      return c.json(author);
    });

    app.post('/', zValidator('json', AuthorPost), async c => {
      const data = c.req.valid('json');

      const author = new Author({ name: data.name });

      await this.authorCreation.execute({ author });

      return c.json({ author }, 201);
    });
  }
}
