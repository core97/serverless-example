export type AppErrorOptions = {
  cause?: ErrorOptions['cause'];
  httpStatus?: number;
};

export class AppError extends Error {
  readonly code: string;

  readonly httpStatus: number;

  constructor(code: string, message: string, options?: AppErrorOptions) {
    super(message, { ...(typeof options?.cause !== 'undefined' && { cause: options.cause }) });
    this.name = `${this.getPrefixErrorName(code)}_ERROR.${new.target.name}`;
    this.code = code;
    this.httpStatus = options?.httpStatus ?? 500;
  }

  getResponse(_req: Request, res: Response): Response {
    const body = {
      code: this.code,
      message: this.message,
      name: this.name,
    };

    return new Response(JSON.stringify(body), {
      status: this.httpStatus,
      headers: {
        ...res.headers,
        'Content-Type': 'application/json',
      },
    });
  }

  static getDefaultResponse(req: Request, res: Response) {
    const body = {
      code: '000',
      message: 'Uncontrolled unexpected error',
      name: 'UnknownError',
    };

    return new Response(JSON.stringify(body), {
      status: 500,
      headers: {
        ...res.headers,
        'Content-Type': 'application/json',
      },
    });
  }

  private getPrefixErrorName(code: string): string {
    const [prefixCode] = code.split('-');

    const [prefixErrorName] =
      Object.entries(PREFIX_ERRORS).find(([_key, value]) => value === prefixCode) || [];

    return prefixErrorName || 'UNKNOWN';
  }
}

export const PREFIX_ERRORS = {
  AUTHOR: '1',
  BOOK: '2',
};
