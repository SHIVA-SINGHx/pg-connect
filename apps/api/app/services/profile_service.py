"""
PGConnect API — Roommate profile service.
"""

import uuid
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status

from app.models.roommate import ProfileVisibility, RoommateProfile
from app.models.user import User
from app.schemas.roommate import RoommateProfileCreate, RoommateProfileUpdate


class ProfileService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_or_create_profile(self, user: User) -> RoommateProfile:
        stmt = select(RoommateProfile).where(RoommateProfile.user_id == user.id)
        result = await self.db.execute(stmt)
        profile = result.scalar_one_or_none()
        if not profile:
            profile = RoommateProfile(user_id=user.id)
            self.db.add(profile)
            await self.db.commit()
            await self.db.refresh(profile)
        return profile

    async def update_profile(self, user: User, update_data: RoommateProfileUpdate) -> RoommateProfile:
        profile = await self.get_or_create_profile(user)
        data = update_data.model_dump(exclude_unset=True)
        for key, value in data.items():
            setattr(profile, key, value)
        await self.db.commit()
        await self.db.refresh(profile)
        return profile

    async def get_public_profile(self, profile_id: uuid.UUID, viewer: User | None = None) -> RoommateProfile:
        stmt = select(RoommateProfile).where(RoommateProfile.id == profile_id)
        result = await self.db.execute(stmt)
        profile = result.scalar_one_or_none()
        if not profile:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Profile not found")

        # Visibility check
        if profile.profile_visibility == ProfileVisibility.HIDDEN:
            if not viewer or viewer.id != profile.user_id:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Profile not found")

        return profile
