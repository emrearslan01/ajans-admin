# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json ./

# Install dependencies (npm install because package-lock.json is not committed)
RUN npm install

# Copy source code
COPY . .

# Build application
# NUXT_PUBLIC_API_BASE is passed as build arg and used as env var during build
ARG NUXT_PUBLIC_API_BASE
ENV NUXT_PUBLIC_API_BASE=$NUXT_PUBLIC_API_BASE

RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy package.json first
COPY --from=builder /app/package.json ./

# Install only production dependencies
RUN npm install --production --ignore-scripts

# Copy built files from builder
COPY --from=builder /app/.output ./.output

# Expose port
EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

# Start application
# Nuxt 3 reads HOST and PORT from environment variables
CMD ["node", ".output/server/index.mjs"]
