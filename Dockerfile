# ============================================
# Build stage
# ============================================
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Accept build arguments
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_APP_URL
ARG NEXT_PUBLIC_DEFAULT_ADMIN_EMAIL
ARG NEXT_PUBLIC_DEFAULT_SALE_EMAIL
ARG NEXT_PUBLIC_DEFAULT_MANAGER_EMAIL

# Set environment variables for Next.js build
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL
ENV NEXT_PUBLIC_DEFAULT_ADMIN_EMAIL=$NEXT_PUBLIC_DEFAULT_ADMIN_EMAIL
ENV NEXT_PUBLIC_DEFAULT_SALE_EMAIL=$NEXT_PUBLIC_DEFAULT_SALE_EMAIL
ENV NEXT_PUBLIC_DEFAULT_MANAGER_EMAIL=$NEXT_PUBLIC_DEFAULT_MANAGER_EMAIL

# Build the application
RUN pnpm build

# ============================================
# Production stage
# ============================================
FROM node:20-alpine

WORKDIR /app

# Install pnpm in production image
RUN npm install -g pnpm

# Set Node environment to production
ENV NODE_ENV=production

# Copy package files from builder
COPY package.json pnpm-lock.yaml ./

# Install production dependencies only
RUN pnpm install --frozen-lockfile --prod

# Copy built application from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./next.config.ts

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start the application
CMD ["pnpm", "start"]
