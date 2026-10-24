"""
PGConnect API — Admin Moderation and Governance endpoints.
"""

import uuid
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.auth import get_current_user, require_role
from app.db.session import get_db
from app.models.interactions import NotificationType, Report, ReportReason
from app.models.listing import ListingStatus, PGListing
from app.models.user import AccountStatus, User, UserRole
from app.schemas.interaction import ReportCreate, ReportRead
from app.schemas.listing import PGListingRead
from app.services.notification_service import NotificationService

router = APIRouter()


@router.post("/reports", response_model=ReportRead, status_code=status.HTTP_201_CREATED)
async def submit_report(
    report_data: ReportCreate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> Report:
    """Submit a report against a user or suspicious PG listing."""
    report = Report(
        reporter_id=current_user.id,
        reported_user_id=report_data.reported_user_id,
        reported_listing_id=report_data.reported_listing_id,
        reason=report_data.reason,
        details=report_data.details,
    )
    db.add(report)
    await db.commit()
    await db.refresh(report)
    return report


@router.get("/listings/pending", response_model=list[PGListingRead])
async def list_pending_listings(
    current_user: Annotated[User, Depends(require_role(UserRole.ADMIN))],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> list[PGListing]:
    """Admin moderation queue: list all listings awaiting approval."""
    stmt = (
        select(PGListing)
        .where(PGListing.status == ListingStatus.PENDING)
        .options(
            selectinload(PGListing.media),
            selectinload(PGListing.room_types),
            selectinload(PGListing.listing_amenities),
        )
        .order_by(PGListing.created_at.asc())
    )
    return list((await db.execute(stmt)).scalars().all())


@router.post("/listings/{listing_id}/approve", response_model=PGListingRead)
async def approve_listing(
    listing_id: uuid.UUID,
    current_user: Annotated[User, Depends(require_role(UserRole.ADMIN))],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> PGListing:
    """Admin action: approve listing and make it live in public search."""
    stmt = select(PGListing).where(PGListing.id == listing_id)
    listing = (await db.execute(stmt)).scalar_one_or_none()
    if not listing:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Listing not found")

    listing.status = ListingStatus.ACTIVE
    listing.is_verified = True
    await db.commit()
    await db.refresh(listing)

    # Notify owner
    notif_service = NotificationService(db)
    await notif_service.create_notification(
        user_id=listing.owner_id,
        type=NotificationType.LISTING_APPROVED,
        title="Your PG listing has been approved!",
        body=f"Congratulations! '{listing.name}' is now live on PGConnect.",
        resource_type="listing",
        resource_id=str(listing.id),
    )

    return listing


@router.post("/listings/{listing_id}/reject", response_model=PGListingRead)
async def reject_listing(
    listing_id: uuid.UUID,
    reason: str,
    current_user: Annotated[User, Depends(require_role(UserRole.ADMIN))],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> PGListing:
    """Admin action: reject listing with explanation feedback."""
    stmt = select(PGListing).where(PGListing.id == listing_id)
    listing = (await db.execute(stmt)).scalar_one_or_none()
    if not listing:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Listing not found")

    listing.status = ListingStatus.REJECTED
    await db.commit()
    await db.refresh(listing)

    notif_service = NotificationService(db)
    await notif_service.create_notification(
        user_id=listing.owner_id,
        type=NotificationType.LISTING_REJECTED,
        title="Listing moderation update",
        body=f"Your listing '{listing.name}' was not approved: {reason}",
        resource_type="listing",
        resource_id=str(listing.id),
    )

    return listing


@router.get("/reports", response_model=list[ReportRead])
async def list_reports(
    current_user: Annotated[User, Depends(require_role(UserRole.ADMIN))],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> list[Report]:
    """Admin: view all user moderation reports."""
    stmt = select(Report).order_by(Report.created_at.desc())
    return list((await db.execute(stmt)).scalars().all())
