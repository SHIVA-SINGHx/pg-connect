"""
Worker background job definitions for notification dispatch.
"""

from typing import Any
import structlog
from app.notifications.channels import InAppNotificationChannel, EmailNotificationChannel

logger = structlog.get_logger()


async def send_notification_job(
    ctx: dict[str, Any],
    recipient_id: str,
    title: str,
    body: str,
    channels: list[str] | None = None,
    payload: dict[str, Any] | None = None,
) -> dict[str, Any]:
    """
    ARQ job to dispatch notifications across requested channels.
    Defaults to in-app notification.
    """
    channels = channels or ["in_app"]
    results = {}

    in_app = InAppNotificationChannel()
    email = EmailNotificationChannel()

    for ch in channels:
        if ch == "in_app":
            results["in_app"] = await in_app.send(recipient_id, title, body, payload)
        elif ch == "email":
            results["email"] = await email.send(recipient_id, title, body, payload)
        else:
            logger.warning("unknown_notification_channel", channel=ch)
            results[ch] = False

    logger.info("notification_job_completed", recipient_id=recipient_id, results=results)
    return results
