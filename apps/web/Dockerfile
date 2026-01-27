# apps/web/Dockerfile
FROM oven/bun:1-alpine AS base
WORKDIR /app

# Install Node.js for production runtime
RUN apk add --no-cache nodejs

# Install dependencies
FROM base AS deps
COPY package.json bun.lock ./
COPY apps/web/package.json ./apps/web/
COPY apps/backend/package.json ./apps/backend/
COPY packages/shared/package.json ./packages/shared/
RUN bun install --frozen-lockfile

# Build application
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Build shared package first, then web
RUN bun run build:shared && bun run build:web

# Production image
FROM base AS runner
WORKDIR /app
RUN apk add --no-cache nodejs
COPY --from=builder /app/apps/web/.output ./.output
COPY --from=builder /app/apps/web/package.json ./
COPY --from=deps /app/node_modules ./node_modules

EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
