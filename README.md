# 🚀 Serverless API Example

> Una API serverless completa construida con AWS Lambda, API Gateway, EventBridge y Serverless Framework, siguiendo Domain-Driven Design (DDD).

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D20.x-brightgreen)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![Serverless Framework](https://img.shields.io/badge/Serverless-3.x-red)](https://www.serverless.com/)
[![AWS Lambda](https://img.shields.io/badge/AWS-Lambda-orange)](https://aws.amazon.com/lambda/)

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Uso](#-uso)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Arquitectura](#-arquitectura)
- [Desarrollo](#-desarrollo)
- [Deployment](#-deployment)
- [Tecnologías](#-tecnologías)
- [Contribución](#-contribución)
- [Licencia](#-licencia)

## ✨ Características

- 🌐 **API REST completa** con AWS Lambda y API Gateway HTTP API v2
- 📡 **Event-Driven Architecture** con AWS EventBridge
- ⏰ **Cron Jobs** programados con EventBridge Scheduler
- 🏛️ **Domain-Driven Design (DDD)** con separación en 4 capas
- 💉 **Dependency Injection** con InversifyJS
- ✔️ **Validación robusta** con Zod schemas
- 📊 **Logging estructurado** con Pino
- 🗺️ **Source maps** para debugging en producción
- 🔥 **Hot reload** local con serverless-offline
- ⚡ **Build optimizado** con tsup (esbuild)
- 🎯 **Type-safe** con TypeScript en build-time y runtime

## 📦 Requisitos Previos

- **Node.js** >= 20.x
- **npm** >= 9.x
- **AWS CLI** configurado con credenciales válidas
- Cuenta de **AWS** con permisos para Lambda, API Gateway, EventBridge, CloudWatch

## 🚀 Instalación

```bash
# Clonar el repositorio
git clone <repository-url>
cd serverless-example

# Instalar dependencias
npm install
```

## ⚙️ Configuración

1. **Crear archivo `.env`** en la raíz del proyecto:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"

# Environment
NODE_ENV="development"

# AWS (opcional, si no usas AWS CLI configurado)
# AWS_ACCESS_KEY_ID="your-access-key"
# AWS_SECRET_ACCESS_KEY="your-secret-key"
# AWS_REGION="eu-west-3"
```

2. **Configurar AWS credentials** (si no lo has hecho):

```bash
aws configure
```

## 🎮 Uso

### Desarrollo Local

```bash
# Iniciar servidor local (serverless-offline)
npm run dev

# La API estará disponible en http://localhost:3000
```

### Endpoints disponibles

```bash
# Books
GET    http://localhost:3000/api/books
GET    http://localhost:3000/api/books/:bookId
POST   http://localhost:3000/api/books
PATCH  http://localhost:3000/api/books/:bookId
DELETE http://localhost:3000/api/books/:bookId

# Authors
GET    http://localhost:3000/api/authors
GET    http://localhost:3000/api/authors/:authorId
POST   http://localhost:3000/api/authors
PATCH  http://localhost:3000/api/authors/:authorId
DELETE http://localhost:3000/api/authors/:authorId
```

### Ejemplos de requests

**Crear un autor:**
```bash
curl -X POST http://localhost:3000/api/authors \
  -H "Content-Type: application/json" \
  -d '{"name": "Jane Doe"}'
```

**Crear un libro:**
```bash
curl -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Awesome Book",
    "authorId": "uuid-del-autor",
    "isPublished": false
  }'
```

**Publicar un libro (dispara evento EventBridge):**
```bash
curl -X PATCH http://localhost:3000/api/books/:bookId \
  -H "Content-Type: application/json" \
  -d '{"isPublished": true}'
```

## 📁 Estructura del Proyecto

```
src/
├── shared/                          # Infraestructura compartida
│   ├── domain/                      # Tipos base (Entity, errors)
│   ├── application/                 # Servicios core (Logger, Context, EventPublisher)
│   ├── infra/                       # Implementaciones (AWS EventBridge, Pino Logger)
│   └── presentation/                # Factories (Lambda handlers, Cron, Events)
│
├── book/                            # Módulo de dominio: Books
│   ├── domain/
│   │   ├── entities/                # Book.entity.ts
│   │   ├── repositories/            # BookRepo (abstracto)
│   │   └── errors/                  # BookError
│   ├── application/                 # Use cases (lógica de negocio)
│   ├── infra/                       # MemoryBookRepo (implementación)
│   └── presentation/
│       ├── routers/                 # BookRouter (rutas HTTP)
│       ├── functions/
│       │   ├── http/                # book.http.ts (Lambda handler)
│       │   └── event/               # published-book.event.ts (EventBridge handler)
│       ├── events/                  # PublishedBook event class
│       └── dtos/                    # Schemas Zod para validación
│
└── author/                          # Módulo de dominio: Authors
    ├── domain/
    ├── application/
    ├── infra/
    └── presentation/
        ├── routers/                 # AuthorRouter
        ├── functions/
        │   ├── http/                # author.http.ts
        │   └── cron/                # authors-list.cron.ts (Cron job)
        ├── crons/                   # AuthorsListCron class
        └── dtos/
```

## 🏛️ Arquitectura

El proyecto sigue **Domain-Driven Design (DDD)** con 4 capas:

### 1️⃣ Domain Layer
- Lógica de negocio pura
- Entidades y repositorios (interfaces)
- Sin dependencias externas

### 2️⃣ Application Layer
- Orquesta la lógica de negocio mediante Use Cases
- Depende solo de la capa de dominio

### 3️⃣ Infrastructure Layer
- Implementaciones concretas de repositorios
- Servicios externos

### 4️⃣ Presentation Layer
- API HTTP (routers, handlers)
- DTOs con validación Zod
- Event handlers y Cron jobs

**Flujo de dependencias:**
```
Presentation → Application → Domain ← Infrastructure
```

Para más detalles, consulta [CLAUDE.md](./CLAUDE.md) o lee el [artículo completo](./ARTICLE.md).

## 🛠️ Desarrollo

### Comandos disponibles

```bash
# Desarrollo
npm run dev              # Servidor local con hot reload
npm run build            # Compilar TypeScript y bundlear con tsup

# Code Quality
npm run lint             # Ejecutar ESLint
npm run lint:fix         # Ejecutar ESLint con auto-fix
npm run prettier:fix     # Formatear código con Prettier

# Deployment
npm run deploy           # Desplegar a AWS (stage: dev)
npm run deploy:prod      # Desplegar a AWS (stage: prod)
npm run remove           # Eliminar recursos de AWS
```

### Agregar un nuevo módulo

Para agregar un nuevo módulo de dominio (ej: `product`), sigue estos pasos:

1. **Crear estructura de carpetas:**
```bash
mkdir -p src/product/{domain/{entities,repositories,errors},application,infra,presentation/{routers,functions/http,dtos}}
```

2. **Definir entidad de dominio** en `src/product/domain/entities/product.entity.ts`

3. **Definir repositorio abstracto** en `src/product/domain/repositories/product.repository.ts`

4. **Implementar repositorio** en `src/product/infra/memory-product.repository.ts`

5. **Crear DTOs con Zod** en `src/product/presentation/dtos/product.dto.ts`

6. **Crear router** en `src/product/presentation/routers/product.router.ts`

7. **Crear Lambda handler** en `src/product/presentation/functions/http/product.http.ts`

8. **Registrar en DI container** en `src/product/product.module.ts` y `src/inversify.config.ts`

9. **Agregar función a `serverless.yml`**

El sistema de build con tsup descubrirá automáticamente el nuevo handler y lo compilará.

## 🚀 Deployment

### Deploy a AWS

```bash
# Deploy a desarrollo (stage: dev)
npm run deploy

# Deploy a producción (stage: prod)
npm run deploy:prod

# Deploy a stage personalizado
npx serverless deploy --stage staging
```

### Output del deployment

```
endpoints:
  ANY - https://xxx.execute-api.eu-west-3.amazonaws.com/dev/api/books
  ANY - https://xxx.execute-api.eu-west-3.amazonaws.com/dev/api/authors

functions:
  bookHandler: serverless-example-dev-bookHandler
  authorHandler: serverless-example-dev-authorHandler
  authorsListCron: serverless-example-dev-authorsListCron
  publishedBookEvent: serverless-example-dev-publishedBookEvent
```

### Eliminar recursos

```bash
npm run remove
```

## 🔧 Tecnologías

### Backend & Infrastructure
- [Serverless Framework](https://www.serverless.com/) - Infrastructure as Code
- [AWS Lambda](https://aws.amazon.com/lambda/) - Serverless compute
- [API Gateway HTTP API v2](https://aws.amazon.com/api-gateway/) - HTTP endpoints
- [EventBridge](https://aws.amazon.com/eventbridge/) - Event bus
- [Node.js 20.x](https://nodejs.org/) - Runtime

### Framework & Libraries
- [Hono](https://hono.dev/) - Fast web framework
- [TypeScript](https://www.typescriptlang.org/) - Type-safe development
- [InversifyJS](https://inversify.io/) - Dependency injection
- [Zod](https://zod.dev/) - Schema validation
- [Pino](https://getpino.io/) - Fast logging

### Build Tools
- [tsup](https://tsup.egoist.dev/) - TypeScript bundler (esbuild)
- [ESLint](https://eslint.org/) - Linting
- [Prettier](https://prettier.io/) - Code formatting

### Guías de estilo

- Seguir la arquitectura DDD establecida
- Usar TypeScript estricto
- Validar inputs con Zod
- Escribir tests para nuevas features
- Seguir convenciones de ESLint y Prettier

## 📚 Recursos Adicionales

- [CLAUDE.md](./CLAUDE.md) - Guía completa del proyecto para Claude Code
- [Serverless Framework Docs](https://www.serverless.com/framework/docs)
- [AWS Lambda Best Practices](https://docs.aws.amazon.com/lambda/latest/dg/best-practices.html)

---

**Desarrollado con ❤️ usando Serverless y TypeScript**
