# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a serverless API backend built with Hono framework, deployed to AWS Lambda using the Serverless Framework. The project uses TypeScript with ES modules and is bundled with tsup.

## Development Commands

### Build and Deploy
- `npm run build` - Type-check with tsc and bundle with tsup
- `npm run deploy` - Build and deploy to AWS (dev stage)
- `npm run deploy:prod` - Build and deploy to production stage
- `npm run remove` - Remove deployed serverless resources

### Local Development
- `npm run dev` - Run serverless-offline (starts local API server on http://localhost:3000)
  - API will be available at: `http://localhost:3000/dev/api/` (note the `/dev` stage prefix)
  - Example: `http://localhost:3000/dev/api/health`
- `npm start` - Run the built application directly with Node.js

### Code Quality
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Run ESLint with auto-fix
- `npm run prettier:fix` - Format code with Prettier

## Architecture

### Entry Point
- **src/main.ts** - Main application file that:
  - Configures the Hono app with `/api` base path
  - Sets up global middleware (logger, CORS)
  - Defines error handling for unhandled exceptions
  - Exports AWS Lambda handler via `hono/aws-lambda`

### Build System
- **tsup** bundles the application into a single CommonJS module in `dist/`
- Output: `dist/main.cjs` (minified, with sourcemaps)
- TypeScript paths `@/*` map to `src/*` and `lib/*` map to `lib/*`
- Format is CJS for compatibility with serverless-offline and AWS Lambda

### Deployment
- Deploys to AWS Lambda with Node.js 20.x runtime
- API Gateway with catch-all routes (`/{proxy+}` and `/`)
- Default stage: `dev` (override with `--stage` flag)
- Function config: 256MB memory, 30s timeout

### Configuration Notes
- Environment variables loaded via dotenv (`.env` file)
- CORS enabled globally
- Prettier configured: single quotes, 100 char width, arrow parens: avoid
- ESLint: TypeScript strict mode, unused vars must be prefixed with `_`

## Testing
No test framework is currently configured. The `npm test` command will fail with "Error: no test specified".

## Node Version
Requires Node.js >= 20
