import { Container } from 'inversify';
import { SharedModule } from '@/shared/shared.module';

export const container = new Container();

container.load(SharedModule);
