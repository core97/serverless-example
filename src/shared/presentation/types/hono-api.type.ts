import { Hono } from 'hono';
import { type Context as LambdaContext } from 'aws-lambda';

export type HonoEnv = {
  Bindings: {
    lambdaContext?: LambdaContext;
  };
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  Variables: {};
};

export abstract class HonoRouter {
  basePath: string;

  constructor(params: { basePath: string }) {
    this.basePath = params.basePath;
  }

  abstract run(app: Hono<HonoEnv>): void;
}
