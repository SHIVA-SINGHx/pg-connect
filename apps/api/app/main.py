"""
PGConnect API — FastAPI application factory.
"""

import time
import uuid

import structlog
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.config import get_settings
from app.api.v1.router import api_router

logger = structlog.get_logger(__name__)


def create_app() -> FastAPI:
    settings = get_settings()

    app = FastAPI(
        title="PGConnect API",
        version="0.1.0",
        description="PG discovery and roommate-matching platform API",
        docs_url="/docs" if settings.environment != "production" else None,
        redoc_url="/redoc" if settings.environment != "production" else None,
    )

    # ---- CORS -----------------------------------------------
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.api_cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # ---- Request ID middleware --------------------------------
    @app.middleware("http")
    async def add_request_id(request: Request, call_next):
        request_id = str(uuid.uuid4())
        structlog.contextvars.clear_contextvars()
        structlog.contextvars.bind_contextvars(request_id=request_id)
        start = time.perf_counter()
        response = await call_next(request)
        elapsed = time.perf_counter() - start
        logger.info(
            "request",
            method=request.method,
            path=request.url.path,
            status=response.status_code,
            elapsed_ms=round(elapsed * 1000, 2),
        )
        response.headers["X-Request-ID"] = request_id
        return response

    # ---- Global error handler --------------------------------
    @app.exception_handler(Exception)
    async def global_error_handler(request: Request, exc: Exception):
        logger.exception("unhandled_error", exc_info=exc)
        return JSONResponse(
            status_code=500,
            content={"detail": "Internal server error"},
        )

    # ---- Routes ----------------------------------------------
    app.include_router(api_router, prefix="/api/v1")

    # ---- Root & Health ---------------------------------------
    @app.get("/", tags=["system"])
    async def root():
        return {"app": "PGConnect API", "version": "0.1.0", "docs": "/docs"}

    @app.get("/health", tags=["system"])
    async def health():
        return {"status": "ok", "service": "pgconnect-api", "version": "0.1.0"}

    @app.get("/ready", tags=["system"])
    async def ready():
        """Readiness: verifies DB connectivity."""
        from app.db.session import get_engine
        try:
            async with get_engine().connect() as conn:
                await conn.execute(__import__("sqlalchemy").text("SELECT 1"))
            return {"status": "ready"}
        except Exception as e:
            logger.error("readiness_check_failed", error=str(e))
            return JSONResponse(status_code=503, content={"status": "not ready"})

    return app


app = create_app()
