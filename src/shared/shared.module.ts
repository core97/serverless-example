import { ContainerModule } from 'inversify';
import { EnvVarsService } from '@/shared/application/core/services/env-vars.service';
import { ContextService } from '@/shared/application/core/services/context.service';
import { LoggerService } from '@/shared/application/core/services/logger.service';
import { PinoLogger } from '@/shared/infra/logger/pino-logger';

export const SharedModule = new ContainerModule(({ bind }) => {
  bind<EnvVarsService>(EnvVarsService.name).to(EnvVarsService).inSingletonScope();
  bind<ContextService>(ContextService.name).to(ContextService).inSingletonScope();
  bind<LoggerService>(LoggerService.name).to(PinoLogger).inSingletonScope();
});
