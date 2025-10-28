import { ContainerModule } from 'inversify';
import { TextHelper } from '@/shared/domain/helpers/text.helper';
import { EnvVarsService } from '@/shared/application/core/services/env-vars.service';
import { ContextService } from '@/shared/application/core/services/context.service';
import { LoggerService } from '@/shared/application/core/services/logger.service';
import { PrismaDb } from '@/shared/infra/database/prisma-database';
import { PinoLogger } from '@/shared/infra/logger/pino-logger';
import { HonoApi } from '@/shared/presentation/hono-api';

export const SharedModule = new ContainerModule(({ bind }) => {
  bind<TextHelper>(TextHelper.name).to(TextHelper).inSingletonScope();

  bind<EnvVarsService>(EnvVarsService.name).to(EnvVarsService).inSingletonScope();
  bind<ContextService>(ContextService.name).to(ContextService).inSingletonScope();
  bind<LoggerService>(LoggerService.name).to(PinoLogger).inSingletonScope();
  bind<PrismaDb>(PrismaDb.name).to(PrismaDb).inSingletonScope();

  bind<HonoApi>(HonoApi.name).to(HonoApi).inSingletonScope();
});
