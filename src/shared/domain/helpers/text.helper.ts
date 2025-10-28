import { injectable } from 'inversify';

@injectable()
export class TextHelper {
  static regex = {
    positiveIntegerDigits: /^\d+$/,
  };
}
