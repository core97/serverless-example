# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a serverless API backend built with Hono framework, deployed to AWS Lambda using the Serverless Framework. The project uses TypeScript with ES modules, InversifyJS for dependency injection, and is bundled with tsup. The architecture follows Domain-Driven Design (DDD) with multiple Lambda handlers per domain.

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
    - `http://localhost:3000/dev/book/api/books` - Get all books (BookRouter)
    - `http://localhost:3000/dev/author/api/...` - Author endpoints (AuthorRouter)
    - `http://localhost:3000/dev/shop/api/...` - Shop endpoints (ShopRouter)
  - Route structure: `/{stage}/{handler-name}/api/{resource-path}`
    - Stage: `dev` (from serverless config)
    - Handler name: matches the file name (e.g., `book` from `book.api.ts`)
    - API path: defined in each router's `basePath` and route definitions
- `npm start` - Run the built application directly with Node.js (not recommended for this multi-handler setup)

### Code Quality
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Run ESLint with auto-fix
- `npm run prettier:fix` - Format code with Prettier

## Architecture

### Project Structure (Domain-Driven Design)

The project follows a modular, domain-driven architecture:

```
src/
├── shared/                          # Shared infrastructure
│   ├── application/core/services/   # Core services (Logger, Context, EnvVars)
│   ├── infra/logger/                # Logger implementations (Pino)
│   ├── presentation/
│   │   ├── hono-api.ts              # Main Hono app orchestrator
│   │   └── types/                   # Shared types
│   └── shared.module.ts             # DI container configuration
│
├── <module>/                        # Domain module (e.g., book, shop)
│   ├── presentation/
│   │   ├── api/
│   │   │   └── *.api.ts             # Lambda handler entry points
│   │   └── routers/
│   │       └── *.router.ts          # Route definitions (define full paths with /api prefix)
│   └── <module>.module.ts           # DI container for module
│
└── inversify.config.ts              # Main DI container
```

### Lambda Handlers (Entry Points)

Each `*.api.ts` file in `src/*/presentation/api/` is a separate Lambda handler:

- **Pattern**: `src/<module>/presentation/api/<handler>.api.ts`
- **Examples**:
  - `src/book/presentation/api/book.api.ts` → Book handler
  - `src/book/presentation/api/author.api.ts` → Author handler
  - `src/shop/presentation/api/shop.api.ts` → Shop handler

Each handler:
- Uses InversifyJS to resolve dependencies from the DI container
- Gets a specific router from the container
- Configures a Hono app with middleware (CORS, logging, context, error handling)
- Exports an async Lambda handler function
- Routes are defined directly in each router (e.g., BookRouter defines `/api/books`)

**Important**:
- Handlers use lazy initialization to avoid top-level await (required for CommonJS compatibility)
- Each router defines its complete path including `/api` prefix (e.g., `/api/books`, `/api/authors`)

### Build System

**tsup** automatically discovers and compiles all `*.api.ts` files:

- **Auto-discovery**: Uses `glob` to find all files matching `src/*/presentation/api/*.api.ts`
- **Multiple entry points**: Each handler is compiled separately
- **Output pattern**: `dist/handlers/<module>-<handler>.cjs` (minified, with sourcemaps)
- **Examples**:
  - `src/book/presentation/api/book.api.ts` → `dist/handlers/book-book.cjs`
  - `src/shop/presentation/api/shop.api.ts` → `dist/handlers/shop-shop.cjs`
- TypeScript paths: `@/*` → `src/*`, `lib/*` → `lib/*`
- Format: CJS for compatibility with serverless-offline and AWS Lambda

### Deployment

- **Multiple Lambda functions**: Each `*.api.ts` file becomes a separate Lambda function
- Runtime: Node.js 20.x
- API Gateway: Each handler gets its own route (e.g., `/book`, `/author`, `/shop`)
- Default stage: `dev` (override with `--stage` flag)
- Function config: 256MB memory, 30s timeout

**Adding a new handler**:
1. Create file: `src/<module>/presentation/api/<name>.api.ts`
2. Run `npm run build` - tsup will automatically compile it to `dist/handlers/<module>-<name>.cjs`
3. Add function to `serverless.yml`:
   ```yaml
   <module><Name>Handler:
     handler: dist/handlers/<module>-<name>.handler
     events:
       - http:
           path: /<name>
           method: ANY
           cors: true
       - http:
           path: /<name/{proxy+}
           method: ANY
           cors: true
   ```

### Dependency Injection (InversifyJS)

- **Container**: `src/inversify.config.ts` - Main DI container
- **Modules**: Each domain has its own module (e.g., `book.module.ts`) that registers dependencies
- **Services**: Shared services (Logger, Context, EnvVars) registered in `shared.module.ts`
- **Usage**: Handlers resolve routers and services from the container using `container.get<T>(name)`

### Configuration Notes
- Environment variables loaded via dotenv (`.env` file)
- CORS enabled globally
- Prettier configured: single quotes, 100 char width, arrow parens: avoid
- ESLint: TypeScript strict mode, unused vars must be prefixed with `_`

## Testing
No test framework is currently configured. The `npm test` command will fail with "Error: no test specified".

## Node Version
Requires Node.js >= 20
