import { injectable } from 'inversify';
import { z } from 'zod';

@injectable()
export class EnvVarsService {
  private static schema = z.object({
    AWS_CREDENTIALS_ACCESS_KEY_ID: z.string(),
    AWS_CREDENTIALS_SECRET_ACCESS_KEY: z.string(),
    AWS_REGION: z.string(),
    
    // TODO: remove as optional
    DATABASE_URL: z.string().optional().default('<DATABASE_URL>'),

    NODE_ENV: z.enum(['development', 'production']),
  });

  private static envVars?: z.infer<typeof EnvVarsService.schema>;

  static getEnvVars(): z.infer<typeof EnvVarsService.schema> {
    return EnvVarsService.envVars || EnvVarsService.validateEnvVars();
  }

  static validateEnvVars(): z.infer<typeof EnvVarsService.schema> {
    const envVars = EnvVarsService.schema.parse(process.env);
    EnvVarsService.envVars = envVars;
    return EnvVarsService.envVars;
  }
}
