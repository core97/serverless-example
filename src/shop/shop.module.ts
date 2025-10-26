import { ContainerModule } from 'inversify';
import { ShopRouter } from '@/shop/presentation/routers/shop.router';

export const ShopModule = new ContainerModule(({ bind }) => {
  bind<ShopRouter>(ShopRouter.name).to(ShopRouter).inSingletonScope();
});
