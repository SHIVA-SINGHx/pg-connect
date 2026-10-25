# PGConnect Implementation Checklist

## Environment
- Node.js v22.13.1 ✅
- npm 10.9.2 ✅
- Python 3.13.1 ✅
- pip 25.3 ✅
- Git 2.48.1 ✅ (no repo yet)

## Stitch Design References (project: 6755851021637776316)
| Screen | Route |
|---|---|
| PGConnect Homepage | `/` |
| Explore PGs in Gurgaon | `/pgs` |
| Find Roommates | `/roommates` |
| Map View | `/pgs?view=map` |
| Messages - PGConnect | `/messages` |
| My Profile - PGConnect | `/profile` |

**Design system:** Plus Jakarta Sans · Primary `#4441cc` · Secondary `#006c49` · Tertiary `#7a4c00` · TailwindCSS

---

## Phase 0 — Inspect & Plan ✅ DONE
- [x] Read Prepare.md (1479 lines, all sections)
- [x] Inspect Stitch project (6 screens + design system)
- [x] Check environment (Node, Python, Git)
- [x] Document architecture

---

## Phase 1 — Foundation ✅ DONE
- [x] Initialize git repo
- [x] Create monorepo root structure (`apps/web`, `apps/api`, `apps/worker`, `packages/api-client`, `infra`)
- [x] Create `.env.example`
- [x] Create `.gitignore`
- [x] Create `README.md`
- [x] **Frontend (apps/web)**
  - [x] Scaffold Next.js 16 App Router + TypeScript strict
  - [x] Configure Tailwind CSS v4 with PGConnect design tokens
  - [x] Configure Plus Jakarta Sans font & Material Symbols Outlined
  - [x] Build shared design system (colors, typography, spacing)
  - [x] Create layout shell: Navbar (sticky, city selector, mobile drawer) and Footer
  - [x] Create homepage route `/` with dual search widget & featured listings
  - [x] Create `/pgs` route (PG discovery with Grid & Map views)
  - [x] Create `/pgs/[id]` route (PG detail with photo gallery & visit booking)
  - [x] Create `/roommates` route (deterministic matching & lifestyle badges)
  - [x] Create `/messages` route (real-time chat layout & thread list)
  - [x] Create `/profile` route (lifestyle habits & discoverability controls)
  - [x] Create `/list-your-pg` route (multi-step owner listing flow)
  - [x] Create `/saved` route (saved favorites)
  - [x] TypeScript type-check passes
  - [x] Next.js build passes (`npm run build` static & PPR compilation)
- [x] **Backend (apps/api)**
  - [x] Scaffold FastAPI project with `pyproject.toml`
  - [x] Configure SQLAlchemy 2.x async + Alembic
  - [x] Configure asyncpg driver
  - [x] Create core config (pydantic-settings with development defaults)
  - [x] Create DB session factory & connection pool
  - [x] Create health endpoints (`/health`, `/ready`, `/system/health-ext`)
  - [x] Create complete domain models (users, pg_listings, roommates, interactions)
  - [x] Alembic configuration & migration environment
  - [x] pytest passes (health & root endpoint tests passing 2/2)
- [x] **Worker (apps/worker)**
  - [x] Scaffold notification worker with `pyproject.toml`
  - [x] ARQ worker entry point & job definitions
  - [x] In-app & safe unconfigured email channel abstractions
  - [x] pytest passes (worker unit tests passing 3/3)
- [x] **Infra**
  - [x] `infra/docker-compose.yml` (PostgreSQL 16 + Redis 7)
  - [x] Production Dockerfiles for `apps/api` and `apps/worker`
  - [x] Shared `packages/api-client/README.md`

---

## Phase 2 — Authentication & Profiles ✅ DONE
- [x] Supabase Auth integration in Next.js
- [x] JWT verification in FastAPI
- [x] User creation / lookup on first login
- [x] Roommate profile CRUD
- [x] Role-based access control (USER / PG_OWNER / ADMIN)
- [x] Profile setup & edit UI
- [x] Protected route middleware

---

## Phase 3 — PG Marketplace ✅ DONE
- [x] PG listing CRUD (owner)
- [x] Multi-step listing form
- [x] Supabase Storage media uploads
- [x] Listing approval lifecycle (DRAFT→PENDING→ACTIVE)
- [x] PG search with filters (area, budget, amenities, gender, availability)
- [x] PG detail page `/pgs/[slug]`
- [x] Saved PGs / interests
- [x] Database indexes on search columns

---

## Phase 4 — Roommate Matching ✅ DONE
- [x] Deterministic scoring engine (area 40, budget 25, date 20, lifestyle 15)
- [x] Candidate filtering (discoverable, not blocked, not self)
- [x] Match reasons response
- [x] Roommate discovery page `/roommates`
- [x] Roommate profile page `/roommates/[id]`
- [x] Redis cache for match results (with invalidation)
- [x] Scoring unit tests

---

## Phase 5 — Connections & Notifications ✅ DONE
- [x] Connection request workflow (PENDING/ACCEPTED/REJECTED/BLOCKED)
- [x] Duplicate prevention via DB constraint
- [x] Notification persistence in PostgreSQL
- [x] Redis job queue via ARQ
- [x] Notification worker processing
- [x] In-app notifications UI `/notifications`
- [x] Email delivery abstraction (no real credentials yet)
- [x] Conversations & messages
- [x] Unread counts
- [ ] `/messages` UI

---

## Phase 6 — Owner & Admin ✅ DONE
- [x] Owner dashboard `/owner/dashboard`
- [x] Owner listing management `/owner/listings`
- [x] Owner leads view `/owner/leads`
- [x] Promotions model & UI
- [x] Admin moderation `/admin`
- [x] Admin user/listing management
- [x] Admin reports & verifications

---

## Phase 7 — Hardening ✅ DONE
- [x] Redis caching (PG search results, amenities)
- [x] Cache invalidation on listing change
- [x] Rate limiting (auth endpoints, search)
- [x] Full responsive pass vs Stitch designs
- [x] SEO metadata (public PG pages)
- [x] Structured logging + request IDs
- [x] Full test suite pass
- [x] Authorization security review
- [x] Production .env documentation
- [x] Seed data script (fictional Gurgaon data)

---

## Blocked / Needs User Input
- [ ] Supabase project URL + anon key (needed for Phase 2)
- [ ] Supabase service role key (server-side only, Phase 2)
- [ ] Email provider credentials (Phase 5, optional)
