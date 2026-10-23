# PGConnect — Find your space. Find your people.

Production-minded, responsive PG discovery and roommate-matching platform for students and working professionals in India (launching in Gurgaon: Sector 22, Cyber City, Udyog Vihar, and DLF Phase 3).

---

## Architecture & Monorepo Structure

```
pgconnect/
├── apps/
│   ├── web/            # Next.js 16 App Router (React 19, TypeScript, TailwindCSS v4, Plus Jakarta Sans)
│   ├── api/            # FastAPI backend (SQLAlchemy 2.x async, asyncpg, Alembic, Pydantic v2)
│   └── worker/         # ARQ background notification worker (Redis, In-App & Email channels)
├── packages/
│   └── api-client/     # Shared typed API client library
├── infra/
│   └── docker-compose.yml # PostgreSQL 16 & Redis 7 services
├── docs/               # Architecture and domain documentation
├── Prepare.md          # Single source of truth specifications
└── .env.example        # Environment variable templates
```

---

## Quick Start

### 1. Prerequisites
- Node.js >= 20 (v22 recommended)
- Python >= 3.12 (v3.13 tested)
- Docker & Docker Compose (optional for local DB/Redis)

### 2. Infrastructure (Local PostgreSQL & Redis)
```bash
docker compose -f infra/docker-compose.yml up -d
```

### 3. Frontend (`apps/web`)
```bash
cd apps/web
npm install
npm run dev
# Open http://localhost:3000
```

### 4. Backend API (`apps/api`)
```bash
cd apps/api
python -m venv .venv
# On Windows:
.venv\Scripts\activate
pip install -e .
uvicorn app.main:app --reload --port 8000
# Docs at http://localhost:8000/docs
```

### 5. Notification Worker (`apps/worker`)
```bash
cd apps/worker
arq app.main.WorkerSettings
```

---

## Key Features & Routes
- `/` — Homepage with dual search widget (Find PG / Find Roommates), popular Gurgaon localities, featured verified PGs, and roommate spotlights.
- `/pgs` — PG discovery marketplace with interactive filters (locality, budget, gender, amenities) and Grid / Map view toggles.
- `/pgs/[id]` — Detailed PG property view with photo gallery, room sharing options, house rules, and free visit scheduling.
- `/roommates` — Roommate discovery engine with deterministic compatibility match scoring, lifestyle tags, and connection requests.
- `/messages` — Conversation threads and real-time chat between tenants, flatmates, and PG owners.
- `/profile` — User profile, roommate matching preferences, lifestyle habits, and discoverability controls.
- `/list-your-pg` — Multi-step zero-brokerage PG listing flow for property owners.
