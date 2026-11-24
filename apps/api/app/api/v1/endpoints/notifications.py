"""
PGConnect API — In-app Notifications endpoints.
"""

import uuid
from typing import Annotated
from fastapi import APIRouter, Depends, Query, HTTPException, status
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


@router.patch("/{notification_id}/read")
@router.post("/{notification_id}/read")
async def mark_notification_read(
    notification_id: uuid.UUID,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> dict[str, str]:
    """Marks a single notification as read."""
    service = NotificationService(db)
    success = await service.mark_single_as_read(notification_id, current_user.id)
    if not success:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notification not found")
    return {"message": "Notification marked as read", "status": "ok"}


@router.post("/mark-all-read")
@router.post("/read-all")
async def mark_all_read(
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> dict[str, str]:
    """Marks all user notifications as read."""
    service = NotificationService(db)
    await service.mark_all_as_read(current_user.id)
    return {"message": "All notifications marked as read", "status": "ok"}
