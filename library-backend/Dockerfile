# ============================================================
#  NestJS Backend — Multi-stage Dockerfile
#  Stage 1: Build  |  Stage 2: Production (minimal image)
# ============================================================

# ── Stage 1: Builder ─────────────────────────────────────────
FROM node:20-alpine AS builder

# Install build tools (needed for native modules like bcrypt)
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copy dependency manifests first (layer cache optimization)
COPY package*.json ./

# Install ALL deps (including devDeps needed for build)
RUN npm ci

# Copy source code
COPY . .

# Build NestJS app (outputs to /app/dist)
RUN npm run build

# ── Stage 2: Production ──────────────────────────────────────
FROM node:20-alpine AS production

# Security: run as non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser  -S nestjs -u 1001

WORKDIR /app

# Copy only what is needed for production
COPY package*.json ./

# Install production dependencies only
RUN npm ci --omit=dev && npm cache clean --force

# Copy compiled output from builder stage
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist

# Switch to non-root user
USER nestjs

# NestJS app listens on PORT from env (default 3001)
EXPOSE 3001

# Health check — hits /health endpoint every 30s
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD wget -qO- http://localhost:3001/health || exit 1

CMD ["node", "dist/main"]
