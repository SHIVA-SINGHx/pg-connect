"""
PGConnect API — Users endpoints.
"""

from typing import Annotated
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.auth import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.user import UserRead, UserUpdate
from app.services.user_service import UserService

router = APIRouter()


@router.get("/me", response_model=UserRead)
async def get_my_user(current_user: Annotated[User, Depends(get_current_user)]) -> User:
    """Returns the authenticated user's details."""
    return current_user


@router.patch("/me", response_model=UserRead)
async def update_my_user(
    update_data: UserUpdate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> User:
    """Updates the authenticated user's profile info (name, phone, role, avatar)."""
    service = UserService(db)
    return await service.update_user(current_user, update_data)


@router.post("/sync", response_model=UserRead)
async def sync_user(current_user: Annotated[User, Depends(get_current_user)]) -> User:
    """Idempotently ensures user record is synced with authentication identity."""
    return current_user
