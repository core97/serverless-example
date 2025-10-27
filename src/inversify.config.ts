import { Container } from 'inversify';
import { AuthorModule } from '@/author/author.module';
import { BookModule } from '@/book/book.module';
import { SharedModule } from '@/shared/shared.module';

/**
 * TODO:
 * - Estrcuturar mejor los módulos lo compilado dentro de "dist",
 *   teniendo handlers de apis, jobs, step-functions, etc
 * 
 * - Añadir un cron job de ejemplo
 */

export const container = new Container();

container.load(AuthorModule, BookModule, SharedModule);
