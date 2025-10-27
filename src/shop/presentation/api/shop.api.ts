import { createLambdaHandler } from '@/shared/presentation/lambda-handler-factory';
import { ShopRouter } from '@/shop/presentation/routers/shop.router';

export const handler = createLambdaHandler(ShopRouter.name);
