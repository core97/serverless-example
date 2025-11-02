import { Container } from 'inversify';
import { AuthorModule } from '@/author/author.module';
import { BookModule } from '@/book/book.module';
import { SharedModule } from '@/shared/shared.module';

/**
 * TODO:
 * - Crear un evento por EventBridge
 *      + Hacer una constante con los nombres de los eventos
 *      + Debugear a ver que recibe como parametro en el event
 *        y chequear que reciba el parametro correcto
 * 
 * - Crear una step function
 * 
 * - Crear un dashboard de gráficos en cloudwatch de los errores
 */

export const container = new Container();

container.load(AuthorModule, BookModule, SharedModule);
