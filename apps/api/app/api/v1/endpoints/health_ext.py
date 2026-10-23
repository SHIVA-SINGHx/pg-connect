"""Extended health endpoint — checks DB + Redis."""

from fastapi import APIRouter
from fastapi.responses import JSONResponse

router = APIRouter()


@router.get("/health-ext")
async def extended_health():
    """Extended health: verifies DB and Redis are reachable."""
    results: dict = {"db": "unknown", "redis": "unknown"}

    # DB check
    try:
        from app.db.session import get_engine
        import sqlalchemy
        async with get_engine().connect() as conn:
            await conn.execute(sqlalchemy.text("SELECT 1"))
        results["db"] = "ok"
    except Exception as e:
        results["db"] = f"error: {e}"

    # Redis check
    try:
        import redis.asyncio as aioredis
        from app.core.config import get_settings
        r = aioredis.from_url(get_settings().redis_url, socket_connect_timeout=2)
        await r.ping()
        await r.aclose()
        results["redis"] = "ok"
    except Exception as e:
        results["redis"] = f"error: {e}"

    all_ok = all(v == "ok" for v in results.values())
    return JSONResponse(
        status_code=200 if all_ok else 503,
        content={"status": "ok" if all_ok else "degraded", **results},
    )
