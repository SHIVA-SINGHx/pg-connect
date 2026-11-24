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


class RequestIdMiddleware:
    """Pure ASGI middleware for request-id tracking and latency logging without BaseHTTPMiddleware hanging."""
    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        if scope["type"] != "http":
            await self.app(scope, receive, send)
            return

        request_id = str(uuid.uuid4())
        structlog.contextvars.clear_contextvars()
        structlog.contextvars.bind_contextvars(request_id=request_id)
        start = time.perf_counter()

        status_code = 200

        async def send_wrapper(message):
            nonlocal status_code
            if message["type"] == "http.response.start":
                status_code = message.get("status", 200)
                headers = list(message.get("headers", []))
                headers.append((b"x-request-id", request_id.encode("latin-1")))
                message["headers"] = headers
            await send(message)

        try:
            await self.app(scope, receive, send_wrapper)
        finally:
            elapsed = time.perf_counter() - start
            logger.info(
                "request",
                method=scope.get("method"),
                path=scope.get("path"),
                status=status_code,
                elapsed_ms=round(elapsed * 1000, 2),
            )


def create_app() -> FastAPI:
    settings = get_settings()

    app = FastAPI(
        title="PGConnect API",
        version="0.1.0",
        description="PG discovery and roommate-matching platform API",
        docs_url="/docs" if settings.environment != "production" else None,
        redoc_url="/redoc" if settings.environment != "production" else None,
    )

    # ---- Request ID middleware --------------------------------
    app.add_middleware(RequestIdMiddleware)

    # ---- CORS -----------------------------------------------
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.api_cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

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
