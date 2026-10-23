"""Worker unit tests."""

import pytest
from app.notifications.channels import InAppNotificationChannel, EmailNotificationChannel
from app.jobs.notification_jobs import send_notification_job


@pytest.mark.asyncio
async def test_in_app_notification():
    channel = InAppNotificationChannel()
    success = await channel.send(
        recipient_id="user-123",
        title="Test Notification",
        body="This is a test notification message",
    )
    assert success is True


@pytest.mark.asyncio
async def test_unconfigured_email_channel():
    channel = EmailNotificationChannel()
    success = await channel.send(
        recipient_id="user-123",
        title="Test Email",
        body="This should not be delivered without credentials",
    )
    assert success is False


@pytest.mark.asyncio
async def test_send_notification_job():
    res = await send_notification_job(
        ctx={},
        recipient_id="user-456",
        title="Connection Accepted",
        body="Your roommate connection request was accepted!",
        channels=["in_app", "email"],
    )
    assert res["in_app"] is True
    assert res["email"] is False
