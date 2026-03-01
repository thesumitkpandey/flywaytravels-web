# ---------- Stage 1: Build ----------
FROM node:20-alpine AS builder

WORKDIR /app

# Enable pnpm
RUN corepack enable

# Copy dependency files first (for caching)
COPY package.json pnpm-lock.yaml ./

# Install all dependencies
RUN pnpm install --frozen-lockfile

# Copy project files
COPY . .

# Increase Node memory (important for small VPS)
ENV NODE_OPTIONS="--max-old-space-size=1536"

# Disable Turbopack (must be env, not CLI)
ENV NEXT_DISABLE_TURBOPACK=1

# Build Next.js app
RUN pnpm build


# ---------- Stage 2: Production ----------
FROM node:20-alpine

WORKDIR /app

RUN corepack enable

# Copy required files from builder
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./next.config.js

# Install production dependencies only
RUN pnpm install --prod --frozen-lockfile

# Ensure production mode
ENV NODE_ENV=production

EXPOSE 3000

CMD ["pnpm", "start"]