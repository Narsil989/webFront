# Next.js Docker App

A simple Next.js application with Docker containerization and JSON file-based database.

## Features

- Next.js 15 with App Router
- TypeScript
- Tailwind CSS (mobile-first design)
- Docker containerization
- JSON file-based database
- RESTful API endpoints
- Two pages: Home (Items List) and Add Item

## Prerequisites

- Docker
- Docker Compose

## Getting Started

### 1. Build and Run with Docker

```bash
cd nextjs-docker-app
docker-compose up --build
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### 2. Stop the Application

```bash
docker-compose down
```

## Project Structure

```
nextjs-docker-app/
├── app/
│   ├── api/items/          # API routes
│   ├── items/add/          # Add item page
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page (items list)
│   └── globals.css         # Global styles
├── components/
│   ├── features/           # Feature components
│   ├── layout/             # Layout components
│   └── ui/                 # UI components
├── lib/
│   └── db.ts              # Database utilities
├── data/
│   └── db.json            # JSON database (auto-created)
├── Dockerfile             # Docker configuration
├── docker-compose.yml     # Docker Compose configuration
└── next.config.js         # Next.js configuration
```

## API Endpoints

### GET /api/items
List all items

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1234567890",
      "title": "Item Title",
      "description": "Item Description",
      "status": "active",
      "createdAt": "2023-11-19T10:00:00.000Z"
    }
  ],
  "count": 1
}
```

### POST /api/items
Create a new item

**Request Body:**
```json
{
  "title": "Item Title",
  "description": "Item Description (optional)",
  "status": "active"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "1234567890",
    "title": "Item Title",
    "description": "Item Description",
    "status": "active",
    "createdAt": "2023-11-19T10:00:00.000Z"
  }
}
```

## Mobile-First Design

The application is designed with a mobile-first approach using Tailwind CSS:
- Base styles target mobile devices
- Responsive breakpoints: `sm:` (640px), `md:` (768px), `lg:` (1024px)
- Touch-friendly UI elements
- Adaptive layouts and spacing

## Database

The application uses a simple JSON file-based database stored in `/data/db.json`:
- Automatic initialization on first run
- Atomic file writes for data integrity
- Queue-based write operations to handle concurrent access
- Persistent storage through Docker volumes

## Development

If you want to develop without Docker:

```bash
npm install
npm run dev
```

The development server will run on [http://localhost:3000](http://localhost:3000)

## Building for Production

```bash
npm run build
npm start
```

## Docker Commands

```bash
# Build and start
npm run docker:up

# Stop containers
npm run docker:down

# View logs
docker-compose logs -f

# Rebuild from scratch
docker-compose up --build --force-recreate
```

## License

MIT
