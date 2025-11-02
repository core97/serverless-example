import { AppError, PREFIX_ERRORS } from '@/shared/domain/types/app-error.type';

export namespace AuthorError {
  export class NotFoundById extends AppError {
    constructor(message: string) {
      super(`${PREFIX_ERRORS.AUTHOR}-001`, message, { httpStatus: 404 });
    }
  }

    export class DeleteWithBooks extends AppError {
    constructor(message: string) {
      super(`${PREFIX_ERRORS.AUTHOR}-002`, message, { httpStatus: 406 });
    }
  }
}
