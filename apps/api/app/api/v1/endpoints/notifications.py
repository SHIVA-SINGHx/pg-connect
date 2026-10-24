"""
PGConnect API — In-app Notifications endpoints.
"""

from typing import Annotated
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.auth import get_current_user
from app.db.session import get_db
from app.models.interactions import Notification
from app.models.user import User
from app.schemas.interaction import NotificationRead
from app.services.notification_service import NotificationService

router = APIRouter()


@router.get("", response_model=list[NotificationRead])
async def get_my_notifications(
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)],
    limit: int = Query(50, ge=1, le=100),
) -> list[Notification]:
    """Retrieve in-app notifications feed for current user."""
    service = NotificationService(db)
    return await service.get_user_notifications(current_user.id, limit=limit)


@router.get("/unread-count")
async def get_unread_count(
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> dict[str, int]:
    """Returns count of unread notifications for navbar bell icon."""
    service = NotificationService(db)
    count = await service.get_unread_count(current_user.id)
    return {"unread_count": count}


@router.post("/mark-all-read")
async def mark_all_read(
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> dict[str, str]:
    """Marks all user notifications as read."""
    service = NotificationService(db)
    await service.mark_all_as_read(current_user.id)
    return {"status": "ok"}
