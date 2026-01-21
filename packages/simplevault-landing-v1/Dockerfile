# Multi-stage build for SimpleVault Landing v1
FROM node:18-alpine AS builder

WORKDIR /app

# Copy entire monorepo structure
COPY package*.json ./
COPY packages ./packages

# Install ALL workspace dependencies
RUN npm install

# Build core package first (required dependency)
RUN cd packages/core && npm run build

# Build simplevault-landing-v1
RUN cd packages/simplevault-landing-v1 && npm run build

# Verify build output exists
RUN ls -la /app/packages/simplevault-landing-v1/dist || (echo "Build failed: dist folder not found" && exit 1)

# Production stage with Nginx
FROM nginx:alpine

# Install wget for healthcheck
RUN apk add --no-cache wget

# Copy built assets from builder
COPY --from=builder /app/packages/simplevault-landing-v1/dist /usr/share/nginx/html

# Verify files were copied
RUN ls -la /usr/share/nginx/html && test -f /usr/share/nginx/html/index.html || (echo "index.html not found" && exit 1)

# Accept PORT as build arg (default 80)
ARG PORT=80
ENV PORT=${PORT}

# Create nginx config for SPA routing with configurable port
RUN echo "server { \
    listen ${PORT}; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files \$uri \$uri/ /index.html; \
    } \
    location /health { \
        access_log off; \
        return 200 \"healthy\\n\"; \
        add_header Content-Type text/plain; \
    } \
    gzip on; \
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript; \
}" > /etc/nginx/conf.d/default.conf

# Expose the configured port
EXPOSE ${PORT}

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:${PORT}/health || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
