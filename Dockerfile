# ---------- 1️⃣ Build Stage ----------
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first (for layer caching)
COPY package.json package-lock.json* ./

RUN npm install

# Copy rest of the app
COPY . .

# Build Next.js app
RUN npm run build


# ---------- 2️⃣ Production Stage ----------
FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production

# Only copy necessary files from builder
COPY --from=builder /app/package.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

CMD ["npm", "start"]
