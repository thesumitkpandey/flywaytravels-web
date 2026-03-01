# ---------- Stage 1: Build ----------
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN corepack enable

# Copy package files first (for caching)
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy rest of project
COPY . .

# Build Next.js app
ENV NODE_OPTIONS="--max-old-space-size=1536"
RUN pnpm build --no-turbo
# ---------- Stage 2: Production ----------
FROM node:20-alpine

WORKDIR /app

RUN corepack enable

# Copy only necessary files from builder
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Install only production deps
RUN pnpm install --prod --frozen-lockfile

EXPOSE 3000

CMD ["pnpm", "start"]