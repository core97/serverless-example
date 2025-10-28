import { Container } from 'inversify';
import { AuthorModule } from '@/author/author.module';
import { BookModule } from '@/book/book.module';
import { SharedModule } from '@/shared/shared.module';

/**
 * TODO:
 * - Conectar a una base de datos usando Prisma
 * 
 * - Crear un evento por EventBridge o SQS
 * 
 * - Crear una step function
 * 
 * - Crear un dashboard de gráficos en cloudwatch de los errores
 */

export const container = new Container();

container.load(AuthorModule, BookModule, SharedModule);
