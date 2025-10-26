import { Container } from 'inversify';
import { BookModule } from '@/book/book.module';
import { SharedModule } from '@/shared/shared.module';
import { ShopModule } from '@/shop/shop.module';

export const container = new Container();

container.load(BookModule, SharedModule, ShopModule);
