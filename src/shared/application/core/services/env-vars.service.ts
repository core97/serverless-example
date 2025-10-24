import { injectable } from 'inversify';
import { z } from 'zod';

@injectable()
export class EnvVarsService {
  private static schema = z.object({
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
