import { Hono } from 'hono';
import { injectable } from 'inversify';
import { HonoRouter, HonoEnv } from '@/shared/presentation/types/hono-api.type';

@injectable()
export class ShopRouter extends HonoRouter {
  constructor() {
    super({ basePath: '/shops' });
  }

  run(app: Hono<HonoEnv>): void {
    app.get('/', async c => {
      const shops = [
        { address: 'Gran via 5, Madrid', bookIds: ['12', '23'] },
        { address: 'Calle 8 #23-45, Bogotá' },
        { address: 'Avenida Paulista 1000, São Paulo', bookIds: ['12', '23'] },
        { address: 'Oxford Street 200, London', bookIds: ['12', '23'] },
      ];

      return c.json(shops);
    });
  }
}
