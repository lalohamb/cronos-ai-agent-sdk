# Docker Deployment Guide

Complete guide for containerizing and deploying the Cronos AI Agent SDK and all demo applications.

## Table of Contents

- [Quick Start](#quick-start)
- [UI Demo Deployment](#ui-demo-deployment)
- [Commercial Demo Deployment](#commercial-demo-deployment)
- [SDK as API Service](#sdk-as-api-service)
- [Docker Compose (All Services)](#docker-compose-all-services)
- [Coolify Deployment](#coolify-deployment)
- [Environment Variables](#environment-variables)

---

## Quick Start

### Prerequisites
```bash
# Install Docker
docker --version

# Install Docker Compose
docker-compose --version
```

### Build All Images
```bash
# From project root
docker-compose build
```

### Run All Services
```bash
docker-compose up -d
```

**Access:**
- UI Demo: http://localhost:3000
- Commercial Demo: http://localhost:3001
- SDK API: http://localhost:3002

---

## UI Demo Deployment

### Dockerfile

Create `packages/examples/ui-demo/Dockerfile`:

```dockerfile
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

# Copy nginx config (optional)
COPY packages/examples/ui-demo/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### Nginx Config

Create `packages/examples/ui-demo/nginx.conf`:

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Enable gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

### Build & Run

```bash
# Build image
docker build -f packages/examples/ui-demo/Dockerfile -t cronos-ui-demo .

# Run container
docker run -d \
  --name cronos-ui-demo \
  -p 3000:80 \
  -e VITE_CRONOS_RPC_URL=https://evm-t3.cronos.org \
  cronos-ui-demo

# View logs
docker logs -f cronos-ui-demo

# Stop container
docker stop cronos-ui-demo
```

---

## Commercial Demo Deployment

### Dockerfile

Create `packages/examples02/defi-dashboard/Dockerfile`:

```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

# Copy workspace files
COPY package*.json ./
COPY packages/core/package*.json ./packages/core/
COPY packages/ui/package*.json ./packages/ui/
COPY packages/examples02/defi-dashboard/package*.json ./packages/examples02/defi-dashboard/

RUN npm install

# Copy source
COPY packages/core ./packages/core
COPY packages/ui ./packages/ui
COPY packages/examples02/defi-dashboard ./packages/examples02/defi-dashboard

# Build
RUN npm run build --workspace=packages/core
RUN npm run build --workspace=packages/ui
RUN npm run build --workspace=packages/examples02/defi-dashboard

# Production
FROM nginx:alpine

COPY --from=builder /app/packages/examples02/defi-dashboard/dist /usr/share/nginx/html
COPY packages/examples02/defi-dashboard/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### Build & Run

```bash
# Build
docker build -f packages/examples02/defi-dashboard/Dockerfile -t cronos-commercial-demo .

# Run
docker run -d \
  --name cronos-commercial-demo \
  -p 3001:80 \
  cronos-commercial-demo
```

---

## SDK as API Service

### Dockerfile

Create `packages/core/Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY packages/core/package*.json ./

# Install production dependencies
RUN npm install --production

# Copy built SDK (or source if building in container)
COPY packages/core/dist ./dist
COPY packages/core/src ./src

# Create API server entry point
COPY packages/core/server.js ./

EXPOSE 3002

CMD ["node", "server.js"]
```

### API Server

Create `packages/core/server.js`:

```javascript
const express = require('express');
const { SentinelAgentSDK } = require('./dist');

const app = express();
app.use(express.json());

const sdk = new SentinelAgentSDK({
  network: process.env.CRONOS_NETWORK || 'cronos-testnet',
  rpcUrl: process.env.CRONOS_RPC_URL,
  privateKey: process.env.AGENT_PRIVATE_KEY
});

app.post('/api/execute-agent', async (req, res) => {
  try {
    const { agentId, params } = req.body;
    const result = await sdk.executeAgent(agentId, params);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`SDK API running on port ${PORT}`);
});
```

### Build & Run

```bash
# Build SDK first
cd packages/core
npm run build

# Build Docker image
docker build -f packages/core/Dockerfile -t cronos-sdk-api .

# Run with environment variables
docker run -d \
  --name cronos-sdk-api \
  -p 3002:3002 \
  -e AGENT_PRIVATE_KEY=your_private_key \
  -e CRONOS_RPC_URL=https://evm-t3.cronos.org \
  -e OPENAI_API_KEY=your_openai_key \
  cronos-sdk-api
```

---

## Docker Compose (All Services)

### docker-compose.yml

Create in project root:

```yaml
version: '3.8'

services:
  # UI Demo
  ui-demo:
    build:
      context: .
      dockerfile: packages/examples/ui-demo/Dockerfile
    ports:
      - "3000:80"
    environment:
      - VITE_CRONOS_RPC_URL=${CRONOS_RPC_URL}
      - VITE_API_URL=http://sdk-api:3002
    depends_on:
      - sdk-api
    restart: unless-stopped

  # Commercial Demo
  commercial-demo:
    build:
      context: .
      dockerfile: packages/examples02/defi-dashboard/Dockerfile
    ports:
      - "3001:80"
    environment:
      - VITE_CRONOS_RPC_URL=${CRONOS_RPC_URL}
      - VITE_API_URL=http://sdk-api:3002
    depends_on:
      - sdk-api
    restart: unless-stopped

  # SDK API Service
  sdk-api:
    build:
      context: .
      dockerfile: packages/core/Dockerfile
    ports:
      - "3002:3002"
    environment:
      - AGENT_PRIVATE_KEY=${AGENT_PRIVATE_KEY}
      - CRONOS_RPC_URL=${CRONOS_RPC_URL}
      - CRONOS_NETWORK=${CRONOS_NETWORK:-cronos-testnet}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - PORT=3002
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:3002/health"]
      interval: 30s
      timeout: 10s
      retries: 3

networks:
  default:
    name: cronos-network
```

### .env.docker

Create environment file:

```bash
# Cronos Network
CRONOS_NETWORK=cronos-testnet
CRONOS_RPC_URL=https://evm-t3.cronos.org

# Agent Configuration
AGENT_PRIVATE_KEY=your_private_key_here

# Optional: OpenAI Integration
OPENAI_API_KEY=your_openai_key_here

# Optional: Custom Ports
UI_DEMO_PORT=3000
COMMERCIAL_DEMO_PORT=3001
SDK_API_PORT=3002
```

### Usage

```bash
# Build all services
docker-compose build

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Rebuild and restart
docker-compose up -d --build

# Remove all containers and volumes
docker-compose down -v
```

---

## Coolify Deployment

### Method 1: Single Service Deployment

1. **Create New Application** in Coolify
2. **Connect Git Repository**
3. **Configure Build:**
   - Build Pack: `Dockerfile`
   - Dockerfile Location: `packages/examples/ui-demo/Dockerfile`
   - Build Context: `.` (root)
4. **Set Port:** `80`
5. **Add Environment Variables:**
   ```
   VITE_CRONOS_RPC_URL=https://evm-t3.cronos.org
   ```
6. **Deploy**

### Method 2: Docker Compose Deployment

1. **Create New Application** in Coolify
2. **Select "Docker Compose"**
3. **Upload `docker-compose.yml`**
4. **Add Environment Variables** from `.env.docker`
5. **Deploy All Services**

### Method 3: GitHub Actions + Coolify

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Coolify

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Coolify
        uses: flawiddsouza/coolify-deploy-action@v1
        with:
          coolify-url: ${{ secrets.COOLIFY_URL }}
          coolify-token: ${{ secrets.COOLIFY_TOKEN }}
          application-id: ${{ secrets.COOLIFY_APP_ID }}
```

---

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `AGENT_PRIVATE_KEY` | Private key for agent wallet | `0x123...` |
| `CRONOS_RPC_URL` | Cronos RPC endpoint | `https://evm-t3.cronos.org` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `CRONOS_NETWORK` | Network name | `cronos-testnet` |
| `OPENAI_API_KEY` | OpenAI API key | - |
| `PORT` | API server port | `3002` |
| `NODE_ENV` | Environment | `production` |

### Setting Variables

**Docker Run:**
```bash
docker run -e AGENT_PRIVATE_KEY=xxx -e CRONOS_RPC_URL=yyy ...
```

**Docker Compose:**
```bash
# Use .env file
docker-compose --env-file .env.docker up
```

**Coolify:**
- Add in Application Settings → Environment Variables

---

## Production Best Practices

### 1. Security
```bash
# Never commit .env files
echo ".env*" >> .gitignore

# Use secrets management
docker secret create agent_key ./agent_private_key.txt
```

### 2. Health Checks
```dockerfile
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --quiet --tries=1 --spider http://localhost/health || exit 1
```

### 3. Multi-Stage Builds
- Reduces image size by 70%+
- Separates build and runtime dependencies
- Improves security

### 4. Resource Limits
```yaml
services:
  sdk-api:
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
```

### 5. Logging
```yaml
services:
  sdk-api:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

---

## Troubleshooting

### Build Fails
```bash
# Clear Docker cache
docker builder prune -a

# Rebuild without cache
docker-compose build --no-cache
```

### Container Won't Start
```bash
# Check logs
docker logs container-name

# Inspect container
docker inspect container-name

# Check environment variables
docker exec container-name env
```

### Network Issues
```bash
# Check network
docker network ls
docker network inspect cronos-network

# Restart networking
docker-compose down
docker network prune
docker-compose up
```

### Port Already in Use
```bash
# Find process using port
lsof -i :3000

# Kill process
kill -9 <PID>

# Or use different port
docker run -p 3010:80 ...
```

---

## CI/CD Integration

### GitHub Actions

```yaml
name: Build and Push Docker Images

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build UI Demo
        run: docker build -f packages/examples/ui-demo/Dockerfile -t cronos-ui-demo .
      
      - name: Push to Registry
        run: |
          echo ${{ secrets.DOCKER_PASSWORD }} | docker login -u ${{ secrets.DOCKER_USERNAME }} --password-stdin
          docker push cronos-ui-demo
```

### GitLab CI

```yaml
build:
  stage: build
  script:
    - docker build -f packages/examples/ui-demo/Dockerfile -t cronos-ui-demo .
    - docker push cronos-ui-demo
```

---

## Support

For issues or questions:
- GitHub Issues: [Create Issue](https://github.com/your-repo/issues)
- Documentation: [README.md](./README.md)
- Examples: [packages/examples](./packages/examples)

---

## License

MIT
