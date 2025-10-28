import { inject, injectable } from 'inversify';
import { PrismaClient as NodePrismaClient } from '@prisma/client';
import { EnvVarsService } from '@/shared/application/core/services/env-vars.service';
import { LoggerService } from '@/shared/application/core/services/logger.service';

@injectable()
export class PrismaDb {
  client!: NodePrismaClient;

  constructor(@inject(LoggerService.name) private readonly logger: LoggerService) {}

  async connect(): Promise<ReturnType<PrismaDb['createDbClient']>> {
    try {
      const { DATABASE_URL } = EnvVarsService.getEnvVars();

      const databaseUrl = new URL(DATABASE_URL);

      if (!this.client) {
        this.client = this.createDbClient() as NodePrismaClient;
      }

      this.logger.info(`Connecting to database ${databaseUrl.hostname} ...`);

      await this.client.$connect();

      this.logger.info(`Successful connection to database: ${databaseUrl.hostname}`);
    } catch (error) {
      this.logger.error(error, 'Unexpected error in database connection');
    }

    return this.client;
  }

  async disconnect() {
    if (this.client) {
      await this.client.$disconnect();
    }
  }

  private createDbClient() {
    return new NodePrismaClient();
  }
}
