"""
PGConnect API — Owner Portal endpoints.
"""

import uuid
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.auth import require_role
from app.db.session import get_db
from app.models.interactions import Interest
from app.models.listing import ListingPromotion, ListingStatus, PGListing, PromotionStatus, PromotionType
from app.models.user import User, UserRole
from app.schemas.interaction import InterestRead
from app.schemas.listing import PGListingRead

router = APIRouter()


@router.get("/listings", response_model=list[PGListingRead])
async def get_owner_listings(
    current_user: Annotated[User, Depends(require_role(UserRole.PG_OWNER, UserRole.ADMIN))],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> list[PGListing]:
    """Retrieve all listings owned by current PG owner."""
    stmt = (
        select(PGListing)
        .where(PGListing.owner_id == current_user.id)
        .options(
            selectinload(PGListing.media),
            selectinload(PGListing.room_types),
            selectinload(PGListing.listing_amenities),
        )
        .order_by(PGListing.created_at.desc())
    )
    return list((await db.execute(stmt)).scalars().all())


@router.get("/leads", response_model=list[InterestRead])
async def get_owner_leads(
    current_user: Annotated[User, Depends(require_role(UserRole.PG_OWNER, UserRole.ADMIN))],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> list[Interest]:
    """Retrieve prospective tenant leads & visit requests for owner's properties."""
    stmt = (
        select(Interest)
        .join(PGListing, Interest.listing_id == PGListing.id)
        .where(PGListing.owner_id == current_user.id)
        .order_by(Interest.created_at.desc())
    )
    return list((await db.execute(stmt)).scalars().all())


@router.post("/listings/{listing_id}/promote")
async def request_promotion(
    listing_id: uuid.UUID,
    promotion_type: PromotionType,
    current_user: Annotated[User, Depends(require_role(UserRole.PG_OWNER, UserRole.ADMIN))],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> dict:
    """Request featured / sponsored promotion for an active PG listing."""
    stmt = select(PGListing).where(PGListing.id == listing_id, PGListing.owner_id == current_user.id)
    listing = (await db.execute(stmt)).scalar_one_or_none()
    if not listing:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Listing not found")

    promo = ListingPromotion(
        listing_id=listing_id,
        promotion_type=promotion_type,
        status=PromotionStatus.ACTIVE,
    )
    db.add(promo)
    await db.commit()
    await db.refresh(promo)
    return {"status": "success", "promotion_id": str(promo.id), "type": promo.promotion_type.value}
