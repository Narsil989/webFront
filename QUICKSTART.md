# Quick Start Guide

## Run with Docker (Recommended)

```bash
cd nextjs-docker-app
docker-compose up --build
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Run Locally (Development)

```bash
cd nextjs-docker-app
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## What You Can Do

1. **View Items** - The home page shows all items from the database
2. **Add New Item** - Click "Add Item" button to create a new entry
3. **API Access** - Use the REST API at `/api/items`

## Test the API

### List all items:
```bash
curl http://localhost:3000/api/items
```

### Add a new item:
```bash
curl -X POST http://localhost:3000/api/items \
  -H "Content-Type: application/json" \
  -d '{"title":"My First Item","description":"This is a test","status":"active"}'
```

## Project Features

- ✅ Next.js 15 with App Router
- ✅ TypeScript
- ✅ Tailwind CSS 4 (mobile-first)
- ✅ Docker containerization
- ✅ JSON file database
- ✅ RESTful API
- ✅ 2 pages (Home, Add Item)
- ✅ Production-ready build

## Stop the Application

```bash
docker-compose down
```

## Rebuild from Scratch

```bash
docker-compose down
docker-compose up --build --force-recreate
```
