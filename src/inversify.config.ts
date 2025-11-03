import { Container } from 'inversify';
import { AuthorModule } from '@/author/author.module';
import { BookModule } from '@/book/book.module';
import { SharedModule } from '@/shared/shared.module';

/**
 * TODO:
 * - Crear un dashboard de gráficos en cloudwatch de los errores
 *  * Codigos de error más comunes
 *  * Cuantos errores en total tengo cada día
 *  * Cuantas invocaciones de lambda en total tengo cada día
 *  * Cuántas invocaciones fallidas tengo cada día
 * 
 * - Crear una step function
 */

export const container = new Container();

container.load(AuthorModule, BookModule, SharedModule);
