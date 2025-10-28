import { AppError, PREFIX_ERRORS } from '@/shared/domain/types/app-error.type';

export namespace AuthorError {
  export class Example extends AppError {
    constructor(message: string) {
      super(`${PREFIX_ERRORS.AUTHOR}-001`, message, { httpStatus: 400 });
    }
  }
}
