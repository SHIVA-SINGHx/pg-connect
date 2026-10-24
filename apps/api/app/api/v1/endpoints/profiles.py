"""
PGConnect API — Roommate Profile endpoints.
"""

import uuid
from typing import Annotated
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.auth import get_current_user
from app.db.session import get_db
from app.models.roommate import RoommateProfile
from app.models.user import User
from app.schemas.roommate import RoommateProfileRead, RoommateProfileUpdate
from app.services.profile_service import ProfileService

router = APIRouter()


@router.get("/me", response_model=RoommateProfileRead)
async def get_my_profile(
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> RoommateProfile:
    """Returns the authenticated user's roommate lifestyle and discovery profile."""
    service = ProfileService(db)
    return await service.get_or_create_profile(current_user)


@router.put("/me", response_model=RoommateProfileRead)
async def update_my_profile(
    update_data: RoommateProfileUpdate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> RoommateProfile:
    """Updates the authenticated user's roommate preferences and lifestyle profile."""
    service = ProfileService(db)
    return await service.update_profile(current_user, update_data)


@router.get("/{profile_id}", response_model=RoommateProfileRead)
async def get_public_profile(
    profile_id: uuid.UUID,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> RoommateProfile:
    """Retrieves a public roommate profile by id."""
    service = ProfileService(db)
    return await service.get_public_profile(profile_id, viewer=current_user)
