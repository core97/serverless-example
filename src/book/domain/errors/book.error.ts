import { AppError, PREFIX_ERRORS } from '@/shared/domain/types/app-error.type';

export namespace BookError {
  export class NotFoundById extends AppError {
    constructor(message: string) {
      super(`${PREFIX_ERRORS.BOOK}-001`, message, { httpStatus: 404 });
    }
  }
}
