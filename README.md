# 🎵 MusicGPT Generation Platform

A full-stack AI music generation platform where users submit text prompts, jobs are queued and processed asynchronously, and the UI updates in real-time via WebSockets.

---

## 🚀 Quick Start (Docker)

```bash
git clone https://github.com/rahulprasad0710/music-generation-app.git
cd music-generation-app

# copy and fill env files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local

# spin up everything
docker-compose up --build
```

| Service  | URL                        |
| -------- | -------------------------- |
| Frontend | http://localhost:3000      |
| Backend  | http://localhost:8000      |
| API Docs | http://localhost:8000/docs |

---

## 🧰 Tech Stack

| Layer          | Technology                                                    |
| -------------- | ------------------------------------------------------------- |
| Frontend       | Next.js 14 (App Router), Tailwind CSS, Framer Motion, Zustand |
| Backend        | Node.js, Express, TypeScript                                  |
| ORM            | Prisma                                                        |
| Database       | PostgreSQL                                                    |
| Cache / Queue  | Redis, BullMQ                                                 |
| Real-time      | Socket.io                                                     |
| Infrastructure | Docker, Docker Compose                                        |

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────┐
│                   Frontend (Next.js)             │
│  Zustand Store ←── Socket.io ←── WebSocket      │
└───────────────────────┬─────────────────────────┘
                        │ HTTP REST
┌───────────────────────▼─────────────────────────┐
│                 Backend (Express)                │
│  Routes → Controllers → Services → Prisma ORM   │
│                    │                             │
│         BullMQ Queue + Worker                    │
│         Redis Cache + Rate Limiting              │
└───────┬───────────────────────┬─────────────────┘
        │                       │
┌───────▼──────┐     ┌──────────▼──────┐
│  PostgreSQL  │     │     Redis        │
│  (Prisma)    │     │  Cache + Queue   │
└──────────────┘     └─────────────────┘
```

---

## 🔁 Generation Pipeline

```
POST /prompts
     │
     ▼
Prompt saved (PENDING)
     │
     ▼
Scheduler picks up PENDING → pushes to BullMQ
     │
     ▼
Worker processes job (5–10s simulated delay)
     │  ├── status → PROCESSING  ──→ Socket emit → UI update
     │  └── status → COMPLETED   ──→ Socket emit → UI update
     │          └── FAILED       ──→ Socket emit → UI update
```

---

## 🔐 Token Strategy

### Access Token

- Short-lived JWT (15 minutes)
- Sent in `Authorization: Bearer <token>` header
- Stateless — verified on every request via middleware

### Refresh Token

- Long-lived JWT (7 days / 30 days if Remember Me)
- Stored in the database against the user record
- Rotated on every `/auth/refresh` call — old token is invalidated
- Supports token blacklisting via DB lookup

### Flow

```
Login → { accessToken, refreshToken }
         │
         ▼
accessToken expires → POST /auth/refresh → new accessToken + rotated refreshToken
         │
         ▼
Logout → refreshToken cleared from DB
```

---

## 💳 Rate Limiting

Implemented with Redis sliding window per user:

| Tier             | Limit    |
| ---------------- | -------- |
| FREE             | Low RPM  |
| PAID (isPremium) | High RPM |

BullMQ job priority:

- `PAID` users → priority `1` (processed first)
- `FREE` users → priority `2`

---

## 🔍 Search & Caching

### Endpoint

```
GET /api/audios?q=&cursor=
GET /api/users?q=&cursor=
```

### Ranking (weighted)

| Tier | Match Type       |
| ---- | ---------------- |
| 1    | Exact match      |
| 2    | Starts with      |
| 3    | Full-text search |
| 4    | Fuzzy / trigram  |
| 5    | Partial LIKE     |

### Caching

- Results cached in Redis hash per `query:cursor` field
- TTL: 60 seconds
- Invalidated on any update via `DEL` on the cache key

---

## 📁 Project Structure

```
music-generation-app/
├── docker-compose.yml
├── backend/
│   ├── Dockerfile
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   └── src/
│       ├── config/        # Redis, CORS, Cache, Swagger
│       ├── controllers/   # Route handlers
│       ├── services/      # Business logic
│       ├── middlewares/   # Auth, rate limit, validation
│       ├── queues/        # BullMQ queue definitions
│       ├── workers/       # BullMQ workers
│       ├── schedulers/    # Cron jobs
│       ├── socket/        # Socket.io manager
│       ├── routes/        # Express routers
│       ├── types/         # TypeScript types
│       └── utils/         # Helpers, AppError, tokens
└── frontend/
    ├── Dockerfile
    └── src/
        ├── app/           # Next.js App Router pages
        ├── components/    # UI components
        ├── store/         # Zustand stores
        ├── services/      # API calls (axios)
        ├── hooks/         # useSocket, useAuthInit
        └── providers/     # AuthProvider
```

---

## ⚙️ Environment Variables

**`backend/.env`**

```env
DATABASE=postgresql://user:password@host:5432/dbname
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
PORT=8000
NODE_ENV=development
```

**`frontend/.env.local`**

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 📄 API Documentation

Swagger UI available at:

```
http://localhost:8000/docs
```

---

## 🎥 Demo

[Add your Loom / YouTube demo link here]
