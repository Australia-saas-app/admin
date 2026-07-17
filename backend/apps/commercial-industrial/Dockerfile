FROM node:20-alpine AS builder

WORKDIR /app

# Install build dependencies for native modules
RUN apk add --no-cache python3 make g++

# Copy package files first (for better caching)
COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./

# Verify package.json name (ensures correct package is being used)
RUN cat package.json | grep -q "vero2-commercial-industrial-service" || (echo "ERROR: Wrong package.json!" && exit 1)

# Install dependencies
# Using npm ci for faster, reliable, reproducible builds (requires package-lock.json)
RUN npm ci && npm cache clean --force

# Copy source code
COPY src ./src

# Build application
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Create non-root user for security (before copying files)
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

# Copy package files
COPY package*.json ./

# Copy node_modules from builder stage (already compiled for Alpine Linux)
# This ensures native modules are correctly compiled for the target architecture
COPY --from=builder /app/node_modules ./node_modules

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Remove dev dependencies to reduce image size
RUN npm prune --production && npm cache clean --force

# Change ownership of app directory
RUN chown -R nestjs:nodejs /app
USER nestjs

# Expose port
EXPOSE 3021

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3021/api/commercial-industrial/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start application
CMD ["node", "dist/main"]

