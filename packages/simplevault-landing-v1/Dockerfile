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

# Install wget and curl for healthcheck
RUN apk add --no-cache wget curl

# Copy built assets from builder
COPY --from=builder /app/packages/simplevault-landing-v1/dist /usr/share/nginx/html

# Verify files were copied
RUN ls -la /usr/share/nginx/html && test -f /usr/share/nginx/html/index.html || (echo "index.html not found" && exit 1)

# Create nginx config for SPA routing
RUN printf 'server {\n\
    listen 80;\n\
    server_name localhost;\n\
    root /usr/share/nginx/html;\n\
    index index.html;\n\
    \n\
    location / {\n\
        try_files \$uri \$uri/ /index.html;\n\
    }\n\
    \n\
    location /health {\n\
        access_log off;\n\
        return 200 "healthy\\n";\n\
        add_header Content-Type text/plain;\n\
    }\n\
    \n\
    gzip on;\n\
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;\n\
}\n' > /etc/nginx/conf.d/default.conf

# Verify nginx config
RUN cat /etc/nginx/conf.d/default.conf && nginx -t

# Expose port 80
EXPOSE 80

# Health check - try curl first, fallback to wget
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD curl -f http://localhost/health || wget -q -O- http://localhost/health || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
