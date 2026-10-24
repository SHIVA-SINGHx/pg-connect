"""
PGConnect API — PG Listings endpoints.
"""

import math
import uuid
from typing import Annotated
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.auth import get_current_user, require_role
from app.db.session import get_db
from app.models.listing import GenderPreference
from app.models.user import User, UserRole
from app.schemas.interaction import InterestCreate, InterestRead
from app.schemas.listing import (
    PGListingCreate,
    PGListingRead,
    PGListingSearchResult,
    PGListingUpdate,
)
from app.services.pg_service import PGService

router = APIRouter()


@router.get("", response_model=PGListingSearchResult)
async def search_pgs(
    db: Annotated[AsyncSession, Depends(get_db)],
    area: str | None = Query(None, description="Gurgaon area name (e.g. Sector 22, Cyber City)"),
    min_price: int | None = Query(None, ge=0),
    max_price: int | None = Query(None, ge=0),
    gender: GenderPreference | None = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
) -> dict:
    """Public search for active PG listings with filtering and pagination."""
    service = PGService(db)
    items, total = await service.search(
        area=area,
        min_price=min_price,
        max_price=max_price,
        gender_preference=gender,
        page=page,
        page_size=page_size,
    )
    pages = math.ceil(total / page_size) if total > 0 else 1
    return {
        "items": items,
        "total": total,
        "page": page,
        "page_size": page_size,
        "pages": pages,
    }


@router.post("", response_model=PGListingRead, status_code=status.HTTP_201_CREATED)
async def create_pg(
    listing_data: PGListingCreate,
    current_user: Annotated[User, Depends(require_role(UserRole.PG_OWNER, UserRole.ADMIN))],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> PGListingRead:
    """Create a new PG listing (Owners and Admins only). Sets status to PENDING for moderation."""
    service = PGService(db)
    return await service.create_listing(current_user, listing_data)


@router.get("/saved", response_model=list[PGListingRead])
async def get_my_saved_pgs(
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> list[PGListingRead]:
    """Retrieve saved PGs for the current user."""
    service = PGService(db)
    return await service.get_saved_pgs(current_user)


@router.get("/{listing_id}", response_model=PGListingRead)
async def get_pg_detail(
    listing_id: uuid.UUID,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> PGListingRead:
    """Retrieve detailed information for a specific PG."""
    service = PGService(db)
    return await service.get_by_id(listing_id)


@router.patch("/{listing_id}", response_model=PGListingRead)
async def update_pg(
    listing_id: uuid.UUID,
    update_data: PGListingUpdate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> PGListingRead:
    """Update a PG listing (Owner or Admin)."""
    service = PGService(db)
    return await service.update_listing(listing_id, current_user, update_data)


@router.post("/{listing_id}/save")
async def toggle_save_pg(
    listing_id: uuid.UUID,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> dict:
    """Toggle bookmark/saved state for a PG."""
    service = PGService(db)
    is_saved = await service.save_pg(current_user, listing_id)
    return {"saved": is_saved, "listing_id": str(listing_id)}


@router.post("/{listing_id}/interest", response_model=InterestRead)
async def express_interest(
    listing_id: uuid.UUID,
    interest_data: InterestCreate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> InterestRead:
    """Express interest or book a visit for a PG."""
    service = PGService(db)
    return await service.express_interest(current_user, listing_id, interest_data.message)
