You are a senior full-stack engineer, software architect, product engineer, and UI implementation specialist.

Your task is to build PGConnect, a production-minded, responsive PG discovery and roommate-matching WEBSITE for students and working professionals in India.

The initial launch market is Gurgaon, Delhi NCR, starting with Sector 22, Udyog Vihar, Cyber City, and nearby areas.

The product's central promise is:

Find your space. Find your people.

I have already created the UI/UX designs in Google Stitch and connected Stitch to Antigravity through MCP.

Your first responsibility is to inspect the available Stitch project and retrieve the actual design references through the connected MCP integration. Use those designs as the source of truth for the frontend.

Do not invent a different visual design when the required design already exists.

Do not stop after generating static mockups. Build a working application with real frontend interactions, backend APIs, database persistence, authentication, matching logic, and notification infrastructure.

1. NON-NEGOTIABLE ENGINEERING PRINCIPLES

Build a WEBSITE, not a mobile app.

Follow the existing Google Stitch design as closely as possible.

Use Next.js for the frontend.

Use Python and FastAPI for the backend.

Use Supabase PostgreSQL as the primary database.

Use Redis for caching and background-job infrastructure where appropriate.

Build notifications as a separate, independently runnable worker/service component.

Keep the code modular, typed, testable, and maintainable.

Do not put the entire backend into one file or one giant application module.

Do not use hardcoded mock arrays as the permanent data source.

Do not create dead buttons, fake interactions, or misleading success messages.

Do not replace existing project files or configurations without inspecting them first.

Never expose secrets, service-role keys, database credentials, or private user information.

Implement features incrementally and verify each phase before moving forward.

Use pragmatic architecture. Avoid unnecessary microservices, Kubernetes, complex event brokers, or distributed infrastructure during the MVP.

The frontend, API backend, and notification worker must be independently runnable and maintain clear boundaries.

2. REQUIRED TECHNOLOGY STACK

Frontend

Next.js with App Router

React

TypeScript with strict mode

Tailwind CSS

Reusable UI components

React Hook Form

Zod for frontend form validation

A consistent component and design system

Next.js Server Components by default

Client Components only where interaction requires them

Use the versions compatible with the existing repository and installed dependencies. Do not upgrade dependencies unnecessarily.

Use the Google Stitch design references through MCP. If an existing component library is already configured, inspect it before introducing another one.

Backend

Python 3.12 or a compatible installed Python version

FastAPI

Pydantic v2

SQLAlchemy 2.x async ORM

Alembic database migrations

PostgreSQL async driver, such as asyncpg

pytest

HTTPX for API integration testing

Keep API endpoints thin. Business logic must live in service modules rather than being embedded in route handlers.

Database

Supabase PostgreSQL

SQLAlchemy models

Alembic migrations

Proper foreign keys, indexes, unique constraints and transactions

Use Supabase as a managed PostgreSQL provider.

Use Supabase Auth for user authentication unless the existing project already has a suitable authentication implementation. The Next.js frontend must obtain and maintain sessions securely, and FastAPI must independently validate the access token and authorize every protected operation.

Do not confuse the Supabase client library with the database architecture. FastAPI should own the business logic and database access for application features.

Use Supabase Storage for PG photographs and videos where appropriate.

Cache and background jobs

Redis

An asynchronous Python worker using ARQ or an equivalent lightweight job runner

A cache abstraction with explicit expiration policies

Use Redis for:

Frequently requested PG search results where caching is beneficial

Carefully scoped roommate recommendation results

Rate limiting where appropriate

Background-job queue infrastructure

Do not cache private data across users, and do not treat Redis as the primary database.

Notification delivery

Create a separate notification worker process.

Use PostgreSQL as the durable record of notification events and Redis for asynchronous job delivery.

Initial notification channels:

In-app notifications

Email notification provider abstraction, ready for future configuration

Do not pretend emails or push notifications were delivered if a provider has not been configured.

3. REPOSITORY INSPECTION AND STITCH INTEGRATION

Before writing code:

Inspect the current working directory and existing repository.

Identify existing package managers, frameworks, dependencies, environment files, and Git changes.

Inspect the connected Google Stitch MCP resources and locate the actual PGConnect designs.

Identify the homepage, search results, PG details, roommate discovery, profile, post-login website, messaging, owner listing flow, and any other available screens.

Map the available designs to application routes and reusable components.

Preserve useful existing work.

Write a short implementation plan and a list of discovered design references.

Begin implementation without waiting for unnecessary confirmation.

If Stitch MCP exposes screenshots, component specifications, or generated code, use the appropriate available resources. Do not assume an MCP tool or design resource exists without inspecting the available tools.

If the design cannot be retrieved, explain the exact limitation and continue using accessible screenshots or assets already present in the workspace.

Do not substitute a generic dashboard design for the existing website design.

4. REPOSITORY ARCHITECTURE

Use a monorepo with clear application boundaries.

Suggested structure:

pgconnect/
├── apps/
│   ├── web/
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── (public)/
│   │   │   │   ├── (auth)/
│   │   │   │   ├── pgs/
│   │   │   │   ├── roommates/
│   │   │   │   ├── profile/
│   │   │   │   ├── connections/
│   │   │   │   ├── messages/
│   │   │   │   ├── saved/
│   │   │   │   ├── notifications/
│   │   │   │   ├── list-your-pg/
│   │   │   │   ├── owner/
│   │   │   │   └── admin/
│   │   │   ├── components/
│   │   │   │   ├── ui/
│   │   │   │   ├── layout/
│   │   │   │   ├── pg/
│   │   │   │   ├── roommate/
│   │   │   │   ├── profile/
│   │   │   │   └── messaging/
│   │   │   ├── lib/
│   │   │   ├── hooks/
│   │   │   └── types/
│   │   ├── public/
│   │   └── package.json
│   │
│   ├── api/
│   │   ├── app/
│   │   │   ├── main.py
│   │   │   ├── core/
│   │   │   ├── db/
│   │   │   ├── models/
│   │   │   ├── schemas/
│   │   │   ├── api/
│   │   │   │   └── v1/
│   │   │   ├── services/
│   │   │   │   ├── users/
│   │   │   │   ├── listings/
│   │   │   │   ├── matching/
│   │   │   │   ├── connections/
│   │   │   │   ├── messaging/
│   │   │   │   ├── notifications/
│   │   │   │   └── promotions/
│   │   │   └── tests/
│   │   ├── alembic/
│   │   ├── pyproject.toml
│   │   └── Dockerfile
│   │
│   └── worker/
│       ├── app/
│       │   ├── main.py
│       │   ├── jobs/
│       │   ├── notifications/
│       │   └── tests/
│       ├── pyproject.toml
│       └── Dockerfile
│
├── packages/
│   └── api-client/
│       └── README.md
│
├── infra/
│   ├── docker-compose.yml
│   └── README.md
│
├── docs/
│   ├── architecture.md
│   ├── database.md
│   ├── api-contracts.md
│   └── development-roadmap.md
│
├── .env.example
├── .gitignore
└── README.md

This is a suggested structure, not a requirement to create every file immediately.

Share only genuinely reusable code and generated API contracts. Do not couple the Python backend to the Next.js frontend's internal implementation.

Keep the notification worker independently runnable, with its own entry point and responsibilities.

5. FRONTEND IMPLEMENTATION

Implement the website using the retrieved Stitch designs.

Public website

Create the following routes where appropriate:

/ — Homepage

/pgs — PG discovery

/pgs/[slug] — PG details

/roommates — Roommate discovery

/roommates/[id] — Roommate profile

/how-it-works — Product explanation

/list-your-pg — Owner onboarding

/login — Login

/signup — Registration

Authenticated website

/profile

/profile/edit

/connections

/messages

/saved

/notifications

/settings

Keep the consumer website's navigation visible after login.

Do not turn the normal user experience into a heavy SaaS dashboard.

PG owner interface

/owner/dashboard

/owner/listings

/owner/listings/new

/owner/listings/[id]/edit

/owner/leads

/owner/analytics

/owner/promotions

Admin interface

/admin

/admin/users

/admin/listings

/admin/reports

/admin/verifications

/admin/promotions

Protect owner and admin routes with server-side authorization.

Reusable components

Create reusable components for:

Navbar and footer

PG cards and image galleries

Search bars and filters

Roommate cards

Compatibility scores and match explanations

Profile summaries

Connection request modals

Message lists and chat windows

Notifications

Sponsored and verified badges

Pagination

Loading skeletons

Empty and error states

Form fields and validation messages

Use the existing design system and assets instead of generating inconsistent alternatives.

Responsive behavior

Support desktop, laptop, tablet, and mobile.

Use the Stitch desktop and mobile designs as references.

Implement:

Responsive navigation

Accessible mobile menus

Adaptive search and filter layouts

Responsive PG and roommate cards

Proper loading and error states

Keyboard accessibility and visible focus states

Website functionality

Every visible action must work.

Examples:

Search filters must affect actual results.

Favourite buttons must persist saved PGs.

Profile forms must save data.

Connect must send a real connection request.

Messages must be persisted.

Notifications must open relevant resources.

Owner listing forms must save drafts and submit listings.

Sponsored badges must be backed by valid promotion data.

Use server-rendered pages and metadata for public PG discovery pages wherever appropriate. Never expose private roommate information in public metadata or search engine indexes.

6. DATABASE AND DOMAIN MODEL

Design the database around separate product domains.

At minimum, implement these entities:

Identity

users

id

auth_user_id

name

email

phone, nullable

avatar_url, nullable

role

account_status

created_at

updated_at

Use the Supabase Auth user ID as the trusted identity reference. Never store plaintext passwords in the application database.

Roommate profiles

roommate_profiles

id

user_id

bio

budget_min

budget_max

preferred_areas

move_in_date

occupation

lifestyle preferences

is_discoverable

profile_visibility

created_at

updated_at

Use appropriate PostgreSQL types and constraints for structured fields. Consider normalized tables if they materially improve querying or data integrity.

PG listings

pg_listings

id

owner_id

name

slug

description

area

address

latitude, nullable

longitude, nullable

price_from

price_to

security_deposit

availability_status

available_from

gender_preference

status

created_at

updated_at

Listing media and amenities

pg_media

id

listing_id

media_type

storage_path

sort_order

amenities

id

name

slug

pg_listing_amenities

listing_id

amenity_id

Room and availability details

Add appropriate models for room types, sharing options, occupancy, available beds, and pricing. Do not force multiple room options into a single ambiguous field.

Interactions

interests

id

user_id

listing_id

status

created_at

saved_pgs

user_id

listing_id

created_at

connections

id

sender_id

receiver_id

status

created_at

updated_at

conversations
conversation_participants
messages

Support unread status, timestamps, and proper access checks.

Notifications

notifications

id

user_id

type

title

body

resource_type, nullable

resource_id, nullable

read_at, nullable

created_at

notification_deliveries

id

notification_id

channel

status

attempt_count

last_error, nullable

delivered_at, nullable

created_at

Moderation and monetization

Add suitable models for:

Verification requests

User and listing reports

Listing approvals

Sponsored listing promotions

Promotion duration and status

Define explicit relationships, indexes, deletion behavior, unique constraints, and validation rules.

Do not build all models in one oversized file. Organize SQLAlchemy models by domain.

Generate Alembic migrations and document the database setup process.

7. AUTHENTICATION AND AUTHORIZATION

Use Supabase Auth for sign-up, login, logout, session management, and supported password recovery.

Requirements:

Verify Supabase access tokens server-side in FastAPI.

Validate the token signature and required claims using a trusted mechanism.

Derive the user identity from the verified token, never from a client-supplied user ID.

Create or retrieve the application's user record after authentication.

Implement role-based permissions for USER, PG_OWNER, and ADMIN.

Verify resource ownership before modifying a listing or profile.

Never trust role information supplied by the browser.

Keep secrets on the server.

Use secure session handling and appropriate CSRF protections for the chosen authentication flow.

Configure logout and expired-session behavior correctly.

A user may manage only their own profile, saved PGs, interests, and messages.

A PG owner may manage only their own listings and associated leads.

Only authorized admins may approve listings, process reports, and manage promotions.

Implement privacy restrictions for discoverable roommate profiles.

8. FASTAPI BACKEND ARCHITECTURE

Use a versioned REST API:

/api/v1/...

Organize endpoints by domain.

Example:

/api/v1/users
/api/v1/profiles
/api/v1/pgs
/api/v1/amenities
/api/v1/matches
/api/v1/connections
/api/v1/interests
/api/v1/messages
/api/v1/conversations
/api/v1/notifications
/api/v1/owner/listings
/api/v1/owner/leads
/api/v1/admin

Use the following responsibility boundaries:

API routes

HTTP request and response handling

Authentication dependencies

Authorization dependencies

Input and output schemas

Services

Business logic

Matching calculations

Connection workflows

Listing publication

Notification event creation

Repositories or data-access modules

Database queries

Reusable persistence operations

Query composition where useful

Models

SQLAlchemy persistence models

Schemas

Pydantic request and response models

Do not introduce repository abstractions that add complexity without a clear benefit.

Implement:

Consistent error responses

Pagination

Input validation

Database transactions

Structured logging

Request IDs

API documentation

Health and readiness endpoints

Keep the OpenAPI specification current.

9. ROOMMATE MATCHING ENGINE

Implement a deterministic V1 matching algorithm in:

apps/api/app/services/matching/

Do not use AI or machine learning for the first version.

Use a transparent weighted score:

Preferred area compatibility: 40 points

Budget compatibility: 25 points

Move-in date compatibility: 20 points

Lifestyle compatibility: 15 points

Maximum score: 100.

Define the scoring rules carefully.

For example:

Shared preferred area: up to 40 points.

Small budget difference: up to 25 points.

Move-in dates within seven days: up to 20 points.

Lifestyle similarities: up to 15 points.

Use normalized overlap for budget ranges where appropriate. Handle missing dates, empty preferences, and incomplete profiles explicitly.

Return a score and human-readable explanations:

{
  "score": 92,
  "reasons": [
    "Same preferred area",
    "Similar budget",
    "Move-in dates are close"
  ]
}

This is an illustrative response shape, not a hardcoded result.

The matching endpoint must:

Require authentication.

Fetch the current user's profile.

Retrieve only discoverable eligible candidates.

Exclude the current user and blocked users.

Apply database-level filtering before scoring.

Calculate compatibility scores.

Sort by score.

Paginate results.

Return matching reasons.

Respect profile visibility and privacy rules.

Use Redis caching only when appropriate, with a clear invalidation strategy when profile preferences change.

Do not save a permanent Match row for every possible user pair unless a specific feature requires persisted recommendations. Calculate recommendations on demand initially, then optimize based on measured usage.

Write unit tests for the scoring rules and edge cases.

10. PG SEARCH AND LISTING WORKFLOW

Implement real server-side PG search with:

Area

Minimum and maximum budget

Room type

Sharing

Amenities

Availability

Gender preference

Sorting

Pagination

Use database indexes for frequently queried columns.

New listings must begin in a pending state.

Listing lifecycle:

DRAFT → PENDING → ACTIVE

Support rejection and suspension states.

Only active, approved listings should appear in public search results.

Build the owner listing form as a multi-step flow:

Basic information

Location

Pricing

Room types and availability

Amenities

Rules

Photos and videos

Preview

Submit for approval

Allow owners to save drafts and edit their own listings.

Use signed upload flows or secure server-authorized uploads for Supabase Storage. Validate file type, file size, and allowed media formats.

Do not store large media files directly in PostgreSQL.

11. CONNECTIONS AND MESSAGING

Implement a proper connection workflow.

Connection states:

PENDING

ACCEPTED

REJECTED

BLOCKED

Prevent duplicate connection requests using database constraints and service-level checks.

A connection request must create a notification for the recipient.

Only accepted connections should be allowed to start roommate-to-roommate conversations.

Define a separate, explicit conversation flow for PG owners and prospective tenants.

Messages must be persisted in PostgreSQL.

Implement:

Conversation listing

Sending messages

Message history

Read status

Unread counts

Blocking

Reporting

Authorization for conversation participants

For the MVP, use HTTP APIs with polling or refresh where appropriate. Keep real-time transport behind a replaceable interface so WebSockets or Supabase Realtime can be introduced later.

Do not claim real-time delivery if it has not been implemented.

12. SEPARATE NOTIFICATION SERVICE

Create a separately runnable notification worker under:

apps/worker/

The notification service must be independently maintainable and must not depend on importing FastAPI route handlers.

Architecture

User Action
    |
    v
FastAPI Service
    |
    +----> PostgreSQL
    |       |
    |       +----> Durable Notification Record
    |
    +----> Redis Job Queue
                 |
                 v
         Notification Worker
                 |
          +------+------+
          |             |
          v             v
     In-app State    Email Provider
     in PostgreSQL   (when configured)

Create notification events for:

Connection request received

Connection accepted

New message received

PG owner receives a new lead

Listing approved or rejected

Listing availability changes where relevant

Promotion status changes

Requirements:

Persist the notification record in PostgreSQL.

Enqueue delivery jobs through Redis.

Process jobs asynchronously.

Implement retries with bounded exponential backoff.

Track delivery status and failures.

Avoid duplicate notifications when jobs are retried.

Use idempotency keys or stable event identifiers where appropriate.

Log failures without exposing sensitive message contents or credentials.

Support graceful shutdown.

Provide worker health monitoring.

Keep email delivery behind a provider interface.

If Redis is unavailable, preserve durable notification records and provide a recoverable enqueue/reconciliation strategy.

Do not lose notification records merely because a worker is unavailable.

For critical database changes, use a transactional outbox pattern if needed to reliably publish notification jobs. At minimum, document the failure window and implement a recovery mechanism.

In-app notifications must work even if email delivery is not configured.

Do not use Redis Pub/Sub alone as the durable notification queue.

13. REDIS CACHING STRATEGY

Create a dedicated cache module.

Cache only data where it improves performance.

Good initial candidates:

Public PG search results

Public amenity lists

Public location metadata

Use:

Explicit TTLs

Stable cache keys

Query-parameter normalization

Cache invalidation on listing changes

Cache versioning or namespaces where useful

Avoid caching:

Authentication tokens

Private user data across users

Messages as the authoritative record

Sensitive roommate profiles without appropriate user-scoped keys and invalidation

When Redis is unavailable, the application should fall back to PostgreSQL for cacheable reads where practical.

Caching must never cause unauthorized information to be returned.

Add basic metrics or logs to observe cache hits and misses.

Do not add Redis solely to make the architecture appear faster. Measure the benefit and keep caching removable.

14. SPONSORED LISTINGS AND REVENUE

Implement sponsored listings as a controlled marketplace feature.

A promotion should include:

Listing ID

Promotion type

Start time

End time

Status

Payment status when payment integration is introduced

Only approved, active listings with currently valid promotions may appear in sponsored placements.

Display a clear Sponsored label.

Sponsored placement must not bypass listing moderation or safety checks.

Do not integrate real payments unless credentials, a provider, and an explicit implementation requirement are available. For now, build the promotion model and owner-facing UI, with an honest pending-payment or demo state where necessary.

15. SECURITY, PRIVACY, AND SAFETY

Implement:

Server-side authentication

Resource-level authorization

Pydantic validation

Rate limiting for sensitive endpoints

Safe upload validation

Secure environment configuration

Parameterized database operations through SQLAlchemy

Appropriate CORS restrictions

Safe error messages

Database constraints

Audit logs for important admin actions

User reporting and blocking

Never expose:

Private phone numbers by default

Email addresses of other users without consent

Exact private addresses unnecessarily

Identity documents through public URLs

Hidden roommate profiles

Secrets in browser bundles or logs

Restrict access to verification documents using private storage and signed URLs where appropriate.

Use appropriate row-level security policies for Supabase-facing access. If the application uses a privileged server-side database connection, keep that connection server-only and enforce authorization in FastAPI. Do not assume RLS protects requests that bypass it.

Do not build fake verification badges. Distinguish verified, unverified, and pending statuses honestly.

16. TESTING REQUIREMENTS

Implement meaningful tests instead of only checking whether the server starts.

Frontend

Forms and validation

Search filters

Connection button states

Protected route behavior

Empty and error states

Backend

Authentication failures

Authorization and ownership checks

PG search filters

Listing approval lifecycle

Matching score calculation

Connection state transitions

Message access controls

Notification persistence

Cache invalidation

Pagination and invalid inputs

Worker

Successful notification processing

Retry behavior

Duplicate-job handling

Failed email delivery

Graceful handling of Redis outages

Use isolated test data and a dedicated test database. Never run destructive test operations against production data.

17. DEVELOPMENT ENVIRONMENT AND DEPLOYMENT

Create:

.env.example

Dockerfiles for independently runnable backend and worker

Docker Compose for local Redis and other required local services

Database migration instructions

Development scripts

A comprehensive README

Use environment variables for:

Supabase project URL and publishable key where required

Server-side Supabase credentials only where necessary

PostgreSQL connection string

Redis URL

Authentication configuration

Storage configuration

Email provider configuration

Frontend API base URL

Use separate environment variables for browser-safe and server-only values.

Do not commit .env files containing real credentials.

Support two database workflows:

Local PostgreSQL for isolated development and testing, when desired.

Supabase PostgreSQL for the actual hosted development environment.

Document connection-pooler requirements and SSL configuration for Supabase connections.

Create scripts or instructions for:

Installing dependencies

Starting the Next.js website

Starting FastAPI

Starting the notification worker

Running Alembic migrations

Running tests

Loading seed data

Building production assets

Use realistic, clearly fictional seed data for Gurgaon locations. Seed data must not be mixed with production records.

18. OBSERVABILITY AND MAINTAINABILITY

Implement:

Structured application logs

Request IDs

Worker job IDs

Health checks

Readiness checks

Consistent API errors

Database connection error handling

Basic performance measurements

Notification failure monitoring

Create documentation describing:

Architecture boundaries

How to add a new API domain

How to add a new notification type

How to add a new database model and migration

How to add a new frontend route

How to run each application independently

Avoid premature distributed tracing, complex monitoring stacks, or infrastructure that is not needed for the MVP.

19. EXECUTION PLAN

Implement in the following phases.

Phase 0 — Inspect and plan

Inspect the repository.

Retrieve Google Stitch designs through MCP.

Identify existing code and dependencies.

Document the intended architecture.

Identify risks and missing configuration.

Phase 1 — Foundation

Set up the monorepo structure.

Configure Next.js and TypeScript.

Configure FastAPI and Python dependencies.

Configure SQLAlchemy and Alembic.

Configure Supabase PostgreSQL.

Configure Redis.

Create environment templates and local development instructions.

Build the shared website design system.

Phase 2 — Authentication and profiles

Implement Supabase Auth integration.

Implement verified-token handling in FastAPI.

Create user records and roommate profiles.

Implement profile setup and editing.

Implement role-based access control.

Phase 3 — PG marketplace

Implement listing creation and editing.

Implement media uploads.

Implement listing approval.

Implement PG search and filters.

Implement PG detail pages.

Implement saved PGs and interests.

Phase 4 — Roommate matching

Implement the deterministic scoring service.

Implement candidate filtering and pagination.

Implement match explanations.

Build roommate discovery and profile pages.

Add scoring and privacy tests.

Phase 5 — Connections and notifications

Implement connection requests.

Implement PostgreSQL notification persistence.

Implement Redis-backed worker jobs.

Implement in-app notifications.

Add email delivery abstraction and retries.

Implement conversations and messages.

Phase 6 — Owner and admin

Implement owner dashboard and leads.

Implement listing management.

Implement promotion management.

Implement admin moderation and reports.

Phase 7 — Hardening

Add caching and invalidation.

Run tests.

Fix authorization issues.

Check responsive design against Stitch.

Verify SEO metadata.

Test failure and empty states.

Document deployment and production configuration.

20. DEFINITION OF DONE

A phase is complete only when:

Its functionality is implemented.

Its API or UI has been verified.

Data persists correctly where applicable.

Authorization is tested.

Loading, error, and empty states work.

Tests pass for the implemented functionality.

No real secrets are committed.

Documentation reflects the actual implementation.

The existing Stitch design has been respected.

No visible control falsely claims an action succeeded.

At the end of each phase, report:

Files created or changed

Features completed

Commands executed

Tests and builds run

Results of those tests

Remaining issues

Next implementation step

Do not mark a test as passing unless you actually ran it and observed the result.

If a credential or external integration is missing, implement the safe configuration boundary and document the exact setup required. Do not fabricate credentials or claim that an external service works without testing it.

Do not stop at a plan or architecture document. Continue implementing and validating the application phase by phase.

The final objective is a working, maintainable PGConnect website built around the existing Stitch design, with Next.js, FastAPI, Supabase PostgreSQL, Redis, and a separate notification worker.

Prioritize correctness, security, design fidelity, and a working end-to-end user journey over generating a large volume of code quickly.