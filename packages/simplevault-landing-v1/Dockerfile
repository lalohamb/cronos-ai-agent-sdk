# Multi-stage build for SimpleVault Landing v1
FROM node:18-alpine AS builder

WORKDIR /app

# Copy root package.json and all packages
# Note: Build context is repo root when using Dockerfile Location in Coolify
COPY package*.json ./
COPY packages ./packages

# Install ALL workspace dependencies
RUN npm install || (echo "npm install failed" && exit 1)

# Build core package first (required dependency)
RUN cd packages/core && npm run build || (echo "Core build failed" && exit 1)

# Build simplevault-landing-v1
RUN cd packages/simplevault-landing-v1 && npm run build || (echo "Simplevault build failed" && exit 1)

# Verify build output exists and show contents
RUN echo "=== Build output ===" && \
    ls -laR /app/packages/simplevault-landing-v1/dist || (echo "Build failed: dist folder not found" && exit 1)

# Production stage with Nginx
FROM nginx:alpine

# Install wget and curl for healthcheck
RUN apk add --no-cache wget curl

# Copy built assets from builder
COPY --from=builder /app/packages/simplevault-landing-v1/dist /usr/share/nginx/html

# Verify files were copied and show what's in nginx html folder
RUN echo "=== Contents of /usr/share/nginx/html ===" && \
    ls -laR /usr/share/nginx/html && \
    echo "=== Checking for index.html ===" && \
    test -f /usr/share/nginx/html/index.html || (echo "ERROR: index.html not found" && exit 1)

# Create nginx config for SPA routing
RUN cat > /etc/nginx/conf.d/default.conf << 'EOF'
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;
    
    # Disable access log for performance
    access_log off;
    error_log /var/log/nginx/error.log warn;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # SPA routing - serve index.html for all routes
    location / {
        try_files $uri $uri/ /index.html =404;
    }
    
    # Health check endpoint
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
    
    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json application/javascript;
}
EOF

# Verify nginx config and show it
RUN echo "=== Nginx Config ===" && \
    cat /etc/nginx/conf.d/default.conf && \
    echo "=== Testing Nginx Config ===" && \
    nginx -t

# Expose port 80
EXPOSE 80

# Health check - try curl first, fallback to wget
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD curl -f http://localhost/health || wget -q -O- http://localhost/health || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
