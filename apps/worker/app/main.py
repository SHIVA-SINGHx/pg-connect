"""
PGConnect Notification Worker entry point.
Run via: arq app.main.WorkerSettings
"""

import os
import structlog
from arq.connections import RedisSettings
from app.jobs.notification_jobs import send_notification_job

logger = structlog.get_logger()

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")


async def startup(ctx: dict) -> None:
    logger.info("worker_starting_up", redis_url=REDIS_URL)


async def shutdown(ctx: dict) -> None:
    logger.info("worker_shutting_down")


class WorkerSettings:
    functions = [send_notification_job]
    on_startup = startup
    on_shutdown = shutdown
    redis_settings = RedisSettings.from_dsn(REDIS_URL)
    max_jobs = 10
    job_timeout = 60
