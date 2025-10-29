# Multi-stage build for optimized production image
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Install build dependencies for native modules (swisseph)
RUN apk add --no-cache \
    libc6-compat \
    python3 \
    py3-setuptools \
    make \
    g++ \
    gcc
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies with native module support
# Use npm install if package-lock.json doesn't exist
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build Next.js application
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('https://api.mondkalender.app/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the application
CMD ["node", "server.js"]
