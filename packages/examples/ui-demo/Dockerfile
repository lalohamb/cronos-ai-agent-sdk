# Multi-stage build for UI Demo
FROM node:18-alpine AS builder

WORKDIR /app

# Copy workspace configuration
COPY package*.json ./
COPY packages/core/package*.json ./packages/core/
COPY packages/ui/package*.json ./packages/ui/
COPY packages/examples/ui-demo/package*.json ./packages/examples/ui-demo/

# Install dependencies
RUN npm install

# Copy source code
COPY packages/core ./packages/core
COPY packages/ui ./packages/ui
COPY packages/examples/ui-demo ./packages/examples/ui-demo

# Build packages in order
RUN npm run build --workspace=packages/core
RUN npm run build --workspace=packages/ui
RUN npm run build --workspace=packages/examples/ui-demo

# Production stage
FROM nginx:alpine

# Copy built assets
COPY --from=builder /app/packages/examples/ui-demo/dist /usr/share/nginx/html

# Copy nginx config
COPY packages/examples/ui-demo/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
