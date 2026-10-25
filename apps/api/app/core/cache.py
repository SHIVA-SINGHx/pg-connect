"""
PGConnect API — Redis Cache Utility.
Provides resilient get, set, and pattern invalidation with fallback when Redis is offline.
"""

import json
from typing import Any
import redis.asyncio as aioredis
import structlog

from app.core.config import get_settings

logger = structlog.get_logger(__name__)

_redis_client: aioredis.Redis | None = None


def get_redis_client() -> aioredis.Redis:
    global _redis_client
    if _redis_client is None:
        settings = get_settings()
        _redis_client = aioredis.from_url(
            settings.redis_url,
            encoding="utf-8",
            decode_responses=True,
            socket_connect_timeout=2,
        )
    return _redis_client


async def cache_get(key: str) -> Any | None:
    """Retrieve and deserialize JSON value from Redis."""
    try:
        r = get_redis_client()
        data = await r.get(key)
        if data:
            return json.loads(data)
    except Exception as e:
        logger.debug("redis_cache_get_fallback", key=key, error=str(e))
    return None


async def cache_set(key: str, value: Any, ttl_seconds: int = 300) -> None:
    """Serialize and store JSON value into Redis with TTL."""
    try:
        r = get_redis_client()
        serialized = json.dumps(value, default=str)
        await r.setex(key, ttl_seconds, serialized)
    except Exception as e:
        logger.debug("redis_cache_set_fallback", key=key, error=str(e))


async def cache_invalidate(pattern: str) -> None:
    """Delete keys matching pattern."""
    try:
        r = get_redis_client()
        keys = await r.keys(pattern)
        if keys:
            await r.delete(*keys)
    except Exception as e:
        logger.debug("redis_cache_invalidate_fallback", pattern=pattern, error=str(e))
