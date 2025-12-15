# Ocean City, MD Restaurant Directory

A comprehensive, user-friendly directory of all restaurants located in Ocean City, MD. Built with React, TypeScript, Express.js, and PostgreSQL.

## Project Structure

This is a Turborepo monorepo containing:

- `apps/web` - Frontend React application (Vite + TypeScript)
- `apps/api` - Backend Express.js API (TypeScript)
- `apps/scraper` - Web scraping service for restaurant data
- `packages/shared` - Shared TypeScript types and utilities
- `packages/config` - Shared configuration (ESLint, TypeScript, etc.)

## Getting Started

### Prerequisites

- Node.js 18+ and npm 9+
- PostgreSQL 15+
- Redis (optional, for caching)

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env

# Start development servers
npm run dev
```

### Development

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

## Documentation

- [Product Requirements Document](./docs/prd.md)
- [Front-End Specification](./docs/front-end-spec.md)
- [Architecture Document](./docs/architecture.md)

## Tech Stack

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS
- **Backend:** Node.js, Express.js, TypeScript
- **Database:** PostgreSQL 15
- **Cache:** Redis
- **Maps:** Google Maps API
- **Monorepo:** Turborepo

## License

Private project
