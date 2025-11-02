# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a serverless API backend built with Hono framework, deployed to AWS Lambda using the Serverless Framework. The project uses TypeScript with ES modules, InversifyJS for dependency injection, and is bundled with tsup. The architecture follows Domain-Driven Design (DDD) with multiple Lambda handlers per domain.

### Tech Stack

**Backend Framework & Deployment**:
- **Hono** - Fast, lightweight web framework for routing and middleware
- **AWS Lambda** - Serverless compute (Node.js 20.x runtime)
- **API Gateway HTTP API (v2)** - HTTP endpoint management
- **Serverless Framework** - Infrastructure as Code and deployment automation

**Database & ORM**:
- **Prisma** - Type-safe database ORM
- **PostgreSQL** (or your database) - Database engine (configured via `DATABASE_URL`)

**Language & Build Tools**:
- **TypeScript** - Type-safe development with ES modules
- **tsup** - Fast TypeScript bundler (powered by esbuild)
- **@swc/core** - Fast TypeScript compiler with decorator metadata support

**Architecture & Patterns**:
- **InversifyJS** - Dependency injection container
- **Domain-Driven Design (DDD)** - Layered architecture (Domain, Application, Infrastructure, Presentation)
- **Zod** - Runtime type validation and schema definition for DTOs

**Code Quality**:
- **ESLint** - Code linting with TypeScript rules
- **Prettier** - Code formatting

## Development Commands

### Build and Deploy
- `npm run build` - Type-check with tsc and bundle with tsup
- `npm run deploy` - Build and deploy to AWS (dev stage)
- `npm run deploy:prod` - Build and deploy to production stage
- `npm run remove` - Remove deployed serverless resources

### Local Development
- `npm run dev` - Run serverless-offline (starts local API server on http://localhost:3000)
  - Each handler has its own Lambda function and routes
  - Example routes:
    - `http://localhost:3000/api/books` - Get all books (BookRouter)
    - `http://localhost:3000/api/authors` - Author endpoints (AuthorRouter)
  - Route structure: `/api/{resource-path}`
    - Stage prefix is disabled in local development via `noPrependStageInUrl: true`
    - API path: defined in each router's route definitions
- `npm start` - Run the built application directly with Node.js (not recommended for this multi-handler setup)

### Code Quality
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Run ESLint with auto-fix
- `npm run prettier:fix` - Format code with Prettier

## Architecture

### Project Structure (Domain-Driven Design)

The project follows a modular, domain-driven architecture with clear separation between layers:

```
src/
├── shared/                                  # Shared infrastructure
│   ├── domain/                              # Shared domain layer
│   │   ├── types/                           # Base types
│   │   │   ├── entity.type.ts               # Base Entity class (id, createdAt, updatedAt)
│   │   │   ├── pagination.type.ts           # Pagination types
│   │   │   └── app-error.type.ts            # Custom error base class
│   │   └── helpers/                         # Utility functions
│   ├── application/
│   │   └── core/
│   │       ├── types/
│   │       │   └── use-case.type.ts         # Abstract UseCase<Input, Output> class
│   │       ├── schemas/                     # Shared Zod validation schemas
│   │       │   └── pagination.schema.ts     # Pagination validation schema
│   │       └── services/                    # Core services (Logger, Context, EnvVars)
│   ├── infra/
│   │   ├── logger/                          # Logger implementations (Pino)
│   │   └── database/
│   │       └── prisma-database.ts           # Prisma client wrapper
│   ├── presentation/
│   │   ├── hono-api.ts                      # Main Hono app orchestrator
│   │   ├── lambda-handler-factory.ts        # Factory for creating Lambda handlers
│   │   ├── cron-job.ts                      # Abstract CronJob base class
│   │   └── types/                           # Shared presentation types
│   └── shared.module.ts                     # DI container configuration
│
├── <module>/                                # Domain module (e.g., book, author)
│   ├── domain/                              # Domain layer (business logic)
│   │   ├── entities/                        # Domain entities
│   │   │   └── <entity>.entity.ts           # Entity classes extending Entity base
│   │   ├── repositories/                    # Repository interfaces (abstracts)
│   │   │   └── <entity>.repository.ts       # Abstract repository contract
│   │   └── errors/                          # Domain-specific errors
│   │       └── <module>.error.ts            # Custom error classes
│   ├── application/                         # Application layer (use cases)
│   │   └── <usecase>.use-case.ts            # Use case implementations extending UseCase<Input, Output>
│   ├── infra/                               # Infrastructure layer
│   │   └── prisma-<entity>.repository.ts    # Concrete repository implementations (Prisma)
│   ├── presentation/                        # Presentation layer (HTTP/API)
│   │   ├── dtos/                            # Data Transfer Objects (Zod schemas)
│   │   │   └── <entity>.dto.ts              # Request/response validation schemas
│   │   ├── routers/
│   │   │   └── <entity>.router.ts           # Route definitions (define full paths with /api prefix)
│   │   ├── functions/                       # Lambda function entry points
│   │   │   ├── http/                        # HTTP handlers (API Gateway)
│   │   │   │   └── *.http.ts                # HTTP Lambda handlers
│   │   │   ├── cron/                        # Scheduled functions (optional)
│   │   │   └── step/                        # Step Functions (optional)
│   │   └── crons/                           # Cron job implementations
│   │       └── *.cron.ts                    # Cron job classes extending CronJob
│   └── <module>.module.ts                   # DI container for module
│
├── prisma/                                  # Prisma ORM
│   └── schema.prisma                        # Database schema definition
│
└── inversify.config.ts                      # Main DI container
```

### Layer Responsibilities

**Domain Layer** (`domain/`) - **Core Business Logic**:
- **Entities**: Core business objects extending from `Entity` base class (provides `id`, `createdAt`, `updatedAt`)
- **Repositories**: Abstract repository interfaces defining data access contracts
- **Errors**: Domain-specific error classes extending `AppError`
- **No dependencies on other layers** - Pure business logic and rules
- **Dependencies**: None (only depends on shared domain types)

**Application Layer** (`application/`) - **Use Case Orchestration**:
- **Use Cases**: Orchestrate business logic by implementing `UseCase<Input, Output>` abstract class
- Use cases have lifecycle hooks: `before()`, `validate()`, `run()`, `after()`
- Coordinate between multiple repositories and domain entities
- **Dependencies**: Domain layer only (entities, repository interfaces)

**Infrastructure Layer** (`infra/`) - **Technical Implementation**:
- **Repository Implementations**: Concrete implementations of domain repositories (e.g., using Prisma)
- **Database Clients**: Prisma client wrapper and connection management
- **External Services**: Any third-party API integrations
- Maps between database models and domain entities
- **Dependencies**: Domain layer (implements repository interfaces)

**Presentation Layer** (`presentation/`) - **API Interface**:
- **DTOs**: Zod schemas for request/response validation
- **Routers**: Define HTTP routes and handle requests/responses
- **Lambda Handlers**: Entry points for AWS Lambda functions
- **Cron Jobs**: Scheduled task implementations extending `CronJob` abstract class
- Transforms DTOs to/from domain entities
- **Dependencies**: Application layer (use cases), Domain layer (entities for responses)

### DDD Principles & Patterns

**Dependency Rule**: Dependencies flow inward (Presentation → Application → Domain):
```
Presentation Layer
    ↓ depends on
Application Layer
    ↓ depends on
Domain Layer (no external dependencies)
    ↑ implemented by
Infrastructure Layer
```

**Key Patterns Used**:

1. **Repository Pattern**: Abstract data access behind interfaces
   - Domain defines the contract (`AuthorRepo` abstract class)
   - Infrastructure provides implementation (`PrismaAuthorRepo`)
   - Application depends on abstraction, not implementation

2. **Use Case Pattern**: Each business operation is a separate use case
   - Single Responsibility: One use case = one business operation
   - Example: `AuthorCreationUseCase` handles only author creation logic
   - Easily testable and maintainable

3. **Entity Pattern**: Domain entities with behavior and validation
   - Entities extend base `Entity` class with common fields
   - Constructor ensures valid entity creation
   - Business logic lives in entity methods (not in services)

4. **DTO Pattern**: Separate API contracts from domain models
   - DTOs define API input/output shape with Zod validation
   - Domain entities represent business concepts
   - Routers transform between DTOs and entities

5. **Dependency Injection**: InversifyJS for loose coupling
   - All dependencies injected via constructor
   - Abstract classes/interfaces for flexibility
   - Easy to swap implementations (e.g., different database)

**Benefits of this architecture**:
- **Testability**: Each layer can be tested independently
- **Maintainability**: Clear separation of concerns
- **Flexibility**: Easy to change infrastructure without touching business logic
- **Scalability**: New features follow established patterns

### Lambda Handlers (Entry Points)

Each `*.http.ts` file in `src/*/presentation/functions/http/` is a separate HTTP Lambda handler:

- **Pattern**: `src/<module>/presentation/functions/http/<handler>.http.ts`
- **Examples**:
  - `src/book/presentation/functions/http/book.http.ts` → Book HTTP handler
  - `src/author/presentation/functions/http/author.http.ts` → Author HTTP handler

The `functions/` directory can contain subdirectories for different function types:
- `http/` - API Gateway HTTP handlers (use `createHttpHandler`)
- `cron/` - Scheduled functions via EventBridge Scheduler (use `createCronHandler`)
- `event/` - EventBridge event handlers (use `createEventHandler`)
- `step/` - Step Functions handlers (to be implemented)
- Custom types as needed

**HTTP Handler Structure**:

HTTP handlers use the `createHttpHandler` factory from `lambda-handler-factory.ts`:

```typescript
import { createHttpHandler } from '@/shared/presentation/lambda-handler-factory';
import { BookRouter } from '@/book/presentation/routers/book.router';

export const handler = createHttpHandler(BookRouter.name);
```

The factory:
- Resolves dependencies from the InversifyJS DI container
- Gets the specified router(s) from the container
- Configures a Hono app with middleware (CORS, logging, context, error handling)
- Uses lazy initialization to avoid top-level await (required for CommonJS compatibility)
- Supports single router: `createHttpHandler(RouterName)` or multiple routers: `createHttpHandler([Router1, Router2])`

**Important**:
- Each router defines its complete path including `/api` prefix (e.g., `/api/books`, `/api/authors`)

### Build System

**tsup** automatically discovers and compiles all handler files:

- **Auto-discovery**: Uses `glob` to find all files matching:
  - `src/*/presentation/functions/http/*.http.ts` (HTTP handlers)
  - `src/*/presentation/functions/cron/*.cron.ts` (Cron handlers)
  - `src/*/presentation/functions/event/*.event.ts` (EventBridge handlers)
- **Multiple entry points**: Each handler is compiled separately
- **Output pattern**: `dist/<module>/functions/<type>/<handler>.cjs` (mirrors source structure, minified, with sourcemaps)
- **Examples**:
  - `src/book/presentation/functions/http/book.http.ts` → `dist/book/functions/http/book.cjs`
  - `src/author/presentation/functions/http/author.http.ts` → `dist/author/functions/http/author.cjs`
  - `src/author/presentation/functions/cron/authors-list.cron.ts` → `dist/author/functions/cron/authors-list.cjs`
  - `src/book/presentation/functions/event/published-book.event.ts` → `dist/book/functions/event/published-book.cjs`
- TypeScript paths: `@/*` → `src/*`, `lib/*` → `lib/*`
- Format: CJS for compatibility with serverless-offline and AWS Lambda
- Extensible: Additional globs can be added in `tsup.config.ts` for other function types (step, etc.)

**Source Maps Configuration**:
- External sourcemaps (`.cjs.map` files) are generated for all bundles
- `source-map-support` is automatically loaded in all handlers via `lambda-handler-factory.ts`
- Error stack traces show original TypeScript source locations with correct line numbers
- Bundle size remains small (~48KB) as sourcemaps are in separate files
- Sourcemaps work in both local development and AWS Lambda

### Deployment

- **Multiple Lambda functions**: Each `*.http.ts` file becomes a separate Lambda function
- Runtime: Node.js 20.x
- **API Gateway HTTP API (v2)**: Modern, faster, and more cost-effective than REST API
  - CORS configured globally in provider settings
  - Payload format version 2.0
  - Each handler gets its own route (e.g., `/api/books`, `/api/authors`)
- Default stage: `dev` (override with `--stage` flag)
- Function config: 256MB memory, 29s timeout (below API Gateway's 30s limit)
- **AWS URLs**: Include stage prefix (e.g., `https://xxx.execute-api.eu-west-3.amazonaws.com/dev/api/books`)
  - To remove stage prefix in production, configure a Custom Domain (requires Route53 domain)

**Adding a new module/feature (complete DDD structure)**:

1. **Domain Layer** - Start with business logic:
   ```typescript
   // src/<module>/domain/entities/<entity>.entity.ts
   import { Entity, EntityProps } from '@/shared/domain/types/entity.type';

   export class YourEntity extends Entity {
     name: string;
     // ... other properties

     constructor(params: Partial<EntityProps> & Pick<YourEntity, 'name'>) {
       super(params);
       this.name = params.name;
     }
   }

   // src/<module>/domain/repositories/<entity>.repository.ts
   import { YourEntity } from '../entities/<entity>.entity';

   export abstract class YourEntityRepo {
     abstract create(params: YourEntity): Promise<YourEntity>;
     abstract findOneById(id: string): Promise<YourEntity | null>;
     // ... other repository methods
   }

   // src/<module>/domain/errors/<module>.error.ts
   import { AppError } from '@/shared/domain/types/app-error.type';

   export class YourModuleError extends AppError {
     constructor(message: string, public readonly code: string) {
       super(message);
       this.name = 'YourModuleError';
     }
   }
   ```

2. **Infrastructure Layer** - Implement data access:
   ```typescript
   // src/<module>/infra/prisma-<entity>.repository.ts
   import { injectable, inject } from 'inversify';
   import { PrismaDb } from '@/shared/infra/database/prisma-database';
   import { YourEntityRepo } from '../domain/repositories/<entity>.repository';
   import { YourEntity } from '../domain/entities/<entity>.entity';

   @injectable()
   export class PrismaYourEntityRepo implements YourEntityRepo {
     constructor(@inject(PrismaDb.name) private readonly prismaDb: PrismaDb) {}

     async create(params: YourEntity): Promise<YourEntity> {
       const result = await this.prismaDb.client.yourEntity.create({ data: params });
       return new YourEntity(result);
     }
     // ... implement other methods
   }
   ```

3. **Application Layer** - Create use cases:
   ```typescript
   // src/<module>/application/<action>.use-case.ts
   import { injectable, inject } from 'inversify';
   import { UseCase } from '@/shared/application/core/types/use-case.type';
   import { YourEntityRepo } from '../domain/repositories/<entity>.repository';
   import { YourEntity } from '../domain/entities/<entity>.entity';

   type Input = { name: string };
   type Output = YourEntity;

   @injectable()
   export class YourActionUseCase extends UseCase<Input, Output> {
     constructor(@inject(YourEntityRepo.name) private readonly repo: YourEntityRepo) {
       super();
     }

     protected async run(input: Input): Promise<Output> {
       return await this.repo.create(new YourEntity(input));
     }
   }
   ```

4. **Presentation Layer** - DTOs, routers, and handlers:
   ```typescript
   // src/<module>/presentation/dtos/<entity>.dto.ts
   import { z } from 'zod';

   export const YourEntityPost = z.object({
     name: z.string().nonempty(),
   });

   // src/<module>/presentation/routers/<entity>.router.ts
   import { injectable, inject } from 'inversify';
   import { Hono } from 'hono';
   import { YourActionUseCase } from '@/<module>/application/<action>.use-case';
   import { YourEntityPost } from '../dtos/<entity>.dto';

   @injectable()
   export class YourEntityRouter {
     router = new Hono();

     constructor(@inject(YourActionUseCase.name) private useCase: YourActionUseCase) {
       this.router.post('/api/your-entities', async (c) => {
         const body = await c.req.json();
         const data = YourEntityPost.parse(body);
         const result = await this.useCase.execute(data);
         return c.json(result, 201);
       });
     }
   }

   // src/<module>/presentation/functions/http/<entity>.http.ts
   import { createHttpHandler } from '@/shared/presentation/lambda-handler-factory';
   import { YourEntityRouter } from '@/<module>/presentation/routers/<entity>.router';

   export const handler = createHttpHandler(YourEntityRouter.name);
   ```

5. **DI Container** - Register dependencies:
   ```typescript
   // src/<module>/<module>.module.ts
   import { ContainerModule } from 'inversify';
   import { YourEntityRepo } from './domain/repositories/<entity>.repository';
   import { PrismaYourEntityRepo } from './infra/prisma-<entity>.repository';
   import { YourActionUseCase } from './application/<action>.use-case';
   import { YourEntityRouter } from './presentation/routers/<entity>.router';

   export const yourModuleContainer = new ContainerModule((bind) => {
     bind(YourEntityRepo.name).to(PrismaYourEntityRepo);
     bind(YourActionUseCase.name).to(YourActionUseCase);
     bind(YourEntityRouter.name).to(YourEntityRouter);
   });

   // Then load this module in src/inversify.config.ts
   ```

6. **Prisma Schema** - Define database model:
   ```prisma
   // prisma/schema.prisma
   model YourEntity {
     id        String   @id @default(uuid())
     name      String
     createdAt DateTime @default(now())
     updatedAt DateTime @updatedAt
   }
   ```
   Run `npx prisma generate` to generate types

7. **Build and Deploy**:
   - Run `npm run build` - tsup automatically compiles to `dist/<module>/functions/http/<entity>.cjs`
   - Add function to `serverless.yml`:
     ```yaml
     yourEntityHandler:
       handler: dist/<module>/functions/http/<entity>.handler
       events:
         - httpApi:
             path: /api/your-entities
             method: '*'
         - httpApi:
             path: /api/your-entities/{proxy+}
             method: '*'
     ```

**Adding cron jobs**:
1. Create cron job class in `src/<module>/presentation/crons/<name>.cron.ts`:
   ```typescript
   import { injectable, inject } from 'inversify';
   import { CronJob } from '@/shared/presentation/cron-job';
   import { YourUseCase } from '@/<module>/application/<usecase>.use-case';

   @injectable()
   export class YourCronJob extends CronJob {
     protected readonly cronName = 'YourCronJob';

     constructor(@inject(YourUseCase.name) private readonly useCase: YourUseCase) {
       super();
     }

     protected async run(): Promise<void> {
       await this.useCase.execute({});
     }
   }
   ```
   **Note**: The `CronJob` base class uses property injection for common dependencies (logger, contextService, prismaDb), so you only need to inject your cron's specific dependencies.
2. Create handler in `src/<module>/presentation/functions/cron/<name>.cron.ts`:
   ```typescript
   import { container } from '@/inversify.config';
   import { YourCronJob } from '@/<module>/presentation/crons/<name>.cron';

   export const handler = async () => {
     const cronJob = container.get<YourCronJob>(YourCronJob.name);
     await cronJob.execute();
   };
   ```
3. Register in DI container and add to `serverless.yml` with schedule event

**Adding EventBridge event handlers**:

EventBridge is AWS's event bus service for building event-driven architectures. It allows you to publish custom events and have Lambda functions react to them.

**Event Structure**: When EventBridge invokes a Lambda, it sends an event with this structure:
```json
{
  "version": "0",
  "id": "event-id",
  "detail-type": "BookPublished",
  "source": "custom.books",
  "account": "123456789012",
  "time": "2025-11-02T19:00:00Z",
  "region": "eu-west-3",
  "resources": [],
  "detail": {
    // Your actual payload is here
    "book": { "id": "123", "title": "My Book" }
  }
}
```

**Important**: The `createEventHandler` factory automatically extracts the `detail` field, so your event handler receives only the payload.

1. **Publishing events** - Use the `EventPublisher` service injected in your router or use case:
   ```typescript
   import { EventPublisher } from '@/shared/application/core/services/event-publisher.service';

   @injectable()
   export class BookRouter extends HonoRouter {
     constructor(
       @inject(EventPublisher.name) private readonly eventPublisher: EventPublisher
     ) {
       super({ basePath: '/api/books' });
     }

     async someMethod() {
       // Publish event to EventBridge
       await this.eventPublisher.publish({
         source: 'custom.books',           // Custom source (use dot notation)
         detailType: 'BookPublished',       // Event type
         detail: { book: someBook }         // Your payload (will be in 'detail' field)
       });
     }
   }
   ```

2. **Create event handler class** in `src/<module>/presentation/events/<name>.event.ts`:
   ```typescript
   import { injectable, inject } from 'inversify';
   import { Event } from '@/shared/presentation/event';
   import { YourUseCase } from '@/<module>/application/<usecase>.use-case';

   type Input = { book: Book };  // Define your payload type

   @injectable()
   export class YourEvent extends Event<Input> {
     protected eventName = 'YourEvent';

     constructor(@inject(YourUseCase.name) private readonly useCase: YourUseCase) {
       super();
     }

     protected async run(input: Input): Promise<void> {
       // Your event handling logic
       this.logger.info('Executing event handler');
       await this.useCase.execute(input);
     }
   }
   ```
   **Note**: The `Event` base class uses lazy-loaded getters for common dependencies (logger, contextService), so you only need to inject your event's specific dependencies.

3. **Create Lambda handler** in `src/<module>/presentation/functions/event/<name>.event.ts`:
   ```typescript
   import { createEventHandler } from '@/shared/presentation/lambda-handler-factory';
   import { YourEvent } from '@/<module>/presentation/events/<name>.event';

   type Input = { book: Book };  // Must match your event's Input type

   export const handler = createEventHandler<Input>(YourEvent.name);
   ```

4. **Register in DI container** (`src/<module>/<module>.module.ts`):
   ```typescript
   bind<YourEvent>(YourEvent.name).to(YourEvent).inSingletonScope();
   ```

5. **Configure in `serverless.yml`**:
   ```yaml
   yourEventHandler:
     handler: dist/<module>/functions/event/<name>.handler
     events:
       - eventBridge:
           # eventBus: default  # Optional, defaults to 'default' event bus
           pattern:
             source:
               - custom.books      # Must match the source you publish
             detail-type:
               - BookPublished     # Must match the detailType you publish
   ```

**Event Bus Configuration**:
- By default, events are published to and consumed from the `default` event bus
- The `eventBus` field in `serverless.yml` is optional when using `default`
- For custom event buses, you must:
  1. Create the event bus in `serverless.yml` resources
  2. Specify `eventBus: my-custom-bus` in the function event configuration
  3. Update `EventBusName` in `AwsEventBridgePublisher` service (can be made configurable via env var)

**Debugging EventBridge events**:
- Check CloudWatch logs for the **publisher Lambda** to verify the event was sent successfully
  - Look for: "Publishing event to EventBridge: ..." and "Event published successfully"
- Check CloudWatch logs for the **event handler Lambda** to verify it was triggered
  - Look for: "Starting YourEvent event" and your custom logs
- Use CloudWatch Insights to query across log groups:
  ```
  fields @timestamp, @message
  | filter @message like /EventBridge/
  | sort @timestamp desc
  ```
- Check EventBridge metrics in CloudWatch for `Invocations` and `FailedInvocations`

**Common pitfalls**:
- Event pattern in `serverless.yml` must exactly match the `source` and `detailType` you publish
- The `detail` field contains your payload - the handler factory extracts it automatically
- IAM permissions: The Lambda execution role needs `events:PutEvents` permission (already configured in provider.iam.role.statements)

### Dependency Injection (InversifyJS)

- **Container**: `src/inversify.config.ts` - Main DI container
- **Modules**: Each domain has its own module (e.g., `book.module.ts`) that registers dependencies
- **Services**: Shared services (Logger, Context, EnvVars) registered in `shared.module.ts`
- **Usage**: Handlers resolve routers and services from the container using `container.get<T>(name)`
- **Injection patterns**:
  - **Lazy-loaded getters**: Used in abstract base classes (like `CronJob`) for shared dependencies
    - Allows derived classes to only inject their specific dependencies without repeating base dependencies
    - Dependencies are resolved from the container on-demand when first accessed
    - Survives bundling/minification (unlike `@lazyInject` from `inversify-inject-decorators`)
    - Example:
      ```typescript
      private _logger?: LoggerService;
      protected get logger(): LoggerService {
        if (!this._logger) {
          this._logger = container.get<LoggerService>(LoggerService.name);
        }
        return this._logger;
      }
      ```
  - **Constructor injection**: Used in concrete classes for their specific dependencies
    - Dependencies are injected via constructor parameters
    - Example: `constructor(@inject(YourUseCase.name) private useCase: YourUseCase)`

  **Why lazy getters over other alternatives?**
  - `LazyServiceIdentifier` from InversifyJS requires calling as a function: `this.logger().info()` (awkward API)
  - `@lazyInject` from `inversify-inject-decorators` breaks during bundling/minification with tsup
  - Lazy getters provide the best balance: clean API, robust, and compatible with all build tools

### Database (Prisma ORM)

**Prisma** is used as the ORM for database access:

- **Schema**: Defined in `prisma/schema.prisma`
- **Client**: Wrapped in `PrismaDb` class (`src/shared/infra/database/prisma-database.ts`)
- **Connection**: Managed via InversifyJS DI container
- **Repository Pattern**: All database access goes through repository implementations in `infra/` folders

**Common Prisma commands**:
```bash
npx prisma generate      # Generate Prisma Client after schema changes
npx prisma migrate dev   # Create and apply migrations in development
npx prisma studio        # Open Prisma Studio GUI
npx prisma db push       # Push schema changes without migrations (dev only)
npx prisma db seed       # Run seed script if configured
```

**Important notes**:
- Always run `npx prisma generate` after changing `schema.prisma` to update TypeScript types
- Repository implementations (`PrismaYourEntityRepo`) map Prisma results to domain entities
- The `PrismaDb` service handles connection lifecycle and provides the Prisma client
- Use transactions for operations that modify multiple tables (see `PrismaAuthorRepo.deleteOneById` as example)

### Configuration Notes
- Environment variables loaded via dotenv (`.env` file)
- **Database**: Requires `DATABASE_URL` environment variable for Prisma connection
- **API Gateway**: Uses HTTP API (v2) instead of REST API for better performance and lower cost
- **CORS**: Enabled globally via `provider.httpApi.cors: true`
- **Local URLs**: Stage prefix disabled via `noPrependStageInUrl: true` in serverless-offline config
- **Decorator Metadata**: Requires `@swc/core` to emit decorator metadata for InversifyJS dependency injection
- **Validation**: Zod schemas for request/response validation in DTOs
- Prettier configured: single quotes, 100 char width, arrow parens: avoid
- ESLint: TypeScript strict mode, unused vars must be prefixed with `_`

## Testing
No test framework is currently configured. The `npm test` command will fail with "Error: no test specified".

## Node Version
Requires Node.js >= 20
