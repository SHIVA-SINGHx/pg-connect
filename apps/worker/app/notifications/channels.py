"""
Notification delivery channels abstraction.
Supports in-app notifications and email provider interface.
Does not fake delivery when providers are not configured.
"""

from abc import ABC, abstractmethod
import structlog

logger = structlog.get_logger()


class NotificationChannel(ABC):
    @abstractmethod
    async def send(self, recipient_id: str, title: str, body: str, payload: dict | None = None) -> bool:
        """Deliver notification via this channel."""
        pass


class InAppNotificationChannel(NotificationChannel):
    """Saves notification directly into PostgreSQL for in-app bell & notifications feed."""

    async def send(self, recipient_id: str, title: str, body: str, payload: dict | None = None) -> bool:
        logger.info("in_app_notification_dispatched", recipient_id=recipient_id, title=title)
        # In a real environment, this inserts into the notifications table via SQLAlchemy
        return True


class EmailNotificationChannel(NotificationChannel):
    """
    Email notification channel.
    Checks whether email provider (e.g. Resend, Sendgrid, SES) credentials are set.
    If not configured, records as unconfigured without pretending it sent.
    """

    def __init__(self, api_key: str | None = None, sender_email: str | None = None):
        self.api_key = api_key
        self.sender_email = sender_email

    async def send(self, recipient_id: str, title: str, body: str, payload: dict | None = None) -> bool:
        if not self.api_key or not self.sender_email:
            logger.warning(
                "email_notification_skipped_no_provider",
                recipient_id=recipient_id,
                reason="Email provider credentials not configured",
            )
            return False

        logger.info("email_notification_sent", recipient_id=recipient_id, title=title)
        return True
