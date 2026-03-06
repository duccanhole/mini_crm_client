# Docker Setup Guide

## Files

- `Dockerfile` - Production build (multi-stage)
- `Dockerfile.dev` - Development with hot reload
- `docker-compose.yml` - Production
- `docker-compose.dev.yml` - Development
- `.dockerignore` - Exclude unnecessary files
- `.env.example` - Environment variables

## Quick Start

### Production
```bash
docker-compose up -d
docker-compose logs -f crm-client
docker-compose down
```

### Development 
```bash
docker-compose -f docker-compose.dev.yml up
docker-compose -f docker-compose.dev.yml down
```

## Common Commands

```bash
# View running containers
docker-compose ps

# View logs
docker-compose logs -f crm-client

# Execute command in container
docker exec -it mini-crm-client sh

# Stop & remove containers
docker-compose down

# Rebuild image
docker-compose build --no-cache
```

## Environment Variables

Create `.env` from `.env.example`:

```bash
cp .env.example .env
```

Key variables:
- `NEXT_PUBLIC_API_URL` - Backend API URL (default: `http://localhost:3001/api`)
- `NEXT_PUBLIC_APP_URL` - App URL (default: `http://localhost:3000`)
- `NEXT_PUBLIC_DEFAULT_ADMIN_EMAIL` - Default admin email (default: `admin@mail.com`)
- `NEXT_PUBLIC_DEFAULT_SALE_EMAIL` - Default sale email (default: `sale@mail.com`)
- `NEXT_PUBLIC_DEFAULT_MANAGER_EMAIL` - Default manager email (default: `manager@mail.com`)
- `NODE_ENV` - Environment (production/development)

For Docker networks, use container names:
```bash
NEXT_PUBLIC_API_URL=http://backend:3001/api
```

## Troubleshooting

**Port already in use:**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :3000
kill -9 <PID>
```

**Check logs for errors:**
```bash
docker-compose logs crm-client
```

**Container won't start:**
```bash
docker-compose build --no-cache
docker-compose up
```

**Verify environment variables:**
```bash
docker exec mini-crm-client env | grep NEXT_PUBLIC
```
