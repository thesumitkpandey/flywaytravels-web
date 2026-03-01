# ---------- Stage 1: Build ----------
FROM node:20-alpine AS builder

WORKDIR /app

# Enable pnpm
RUN corepack enable

# Copy dependency files first (better caching)
COPY package.json pnpm-lock.yaml ./

# Install all dependencies
RUN pnpm install --frozen-lockfile

# Copy rest of project
COPY . .

# 🔥 Increase Node memory + disable turbopack (important)
ENV NODE_OPTIONS="--max-old-space-size=1536"

# Build without turbopack (reduces memory usage)
RUN pnpm build --no-turbo


# ---------- Stage 2: Production ----------
FROM node:20-alpine

WORKDIR /app

RUN corepack enable

# Copy only required files from builder
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./next.config.js

# Install production dependencies only
RUN pnpm install --prod --frozen-lockfile

# Set production mode
ENV NODE_ENV=production

EXPOSE 3000

CMD ["pnpm", "start"]