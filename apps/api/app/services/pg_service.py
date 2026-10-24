"""
PGConnect API — PG Listing business logic service.
"""

import re
import uuid
from sqlalchemy import delete, func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from fastapi import HTTPException, status

from app.models.listing import (
    AvailabilityStatus,
    GenderPreference,
    ListingStatus,
    PGListing,
    PGListingAmenity,
    PGMedia,
    RoomType,
)
from app.models.interactions import Interest, InterestStatus, SavedPG
from app.models.user import User, UserRole
from app.schemas.listing import PGListingCreate, PGListingUpdate


def slugify(text: str) -> str:
    text = re.sub(r"[^\w\s-]", "", text.lower()).strip()
    return re.sub(r"[-\s]+", "-", text)


class PGService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_listing(self, owner: User, data: PGListingCreate) -> PGListing:
        base_slug = slugify(f"{data.name}-{data.area}")
        slug = f"{base_slug}-{uuid.uuid4().hex[:6]}"

        listing = PGListing(
            owner_id=owner.id,
            name=data.name,
            slug=slug,
            description=data.description,
            area=data.area,
            address=data.address,
            latitude=data.latitude,
            longitude=data.longitude,
            price_from=data.price_from,
            price_to=data.price_to,
            security_deposit=data.security_deposit,
            gender_preference=data.gender_preference,
            house_rules=data.house_rules,
            available_from=data.available_from,
            status=ListingStatus.PENDING,
        )
        self.db.add(listing)
        await self.db.flush()

        for rt in data.room_types:
            room_type = RoomType(
                listing_id=listing.id,
                sharing_type=rt.sharing_type,
                price_per_month=rt.price_per_month,
                total_beds=rt.total_beds,
                available_beds=rt.available_beds,
            )
            self.db.add(room_type)

        for m in data.media:
            media = PGMedia(
                listing_id=listing.id,
                media_type=m.media_type,
                storage_path=m.storage_path,
                sort_order=m.sort_order,
            )
            self.db.add(media)

        for amenity_id in data.amenity_ids:
            amenity_link = PGListingAmenity(listing_id=listing.id, amenity_id=amenity_id)
            self.db.add(amenity_link)

        await self.db.commit()
        return await self.get_by_id(listing.id)

    async def get_by_id(self, listing_id: uuid.UUID) -> PGListing:
        stmt = (
            select(PGListing)
            .options(
                selectinload(PGListing.media),
                selectinload(PGListing.room_types),
                selectinload(PGListing.listing_amenities),
            )
            .where(PGListing.id == listing_id)
        )
        result = await self.db.execute(stmt)
        listing = result.scalar_one_or_none()
        if not listing:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="PG listing not found")
        return listing

    async def get_by_slug(self, slug: str) -> PGListing:
        stmt = (
            select(PGListing)
            .options(
                selectinload(PGListing.media),
                selectinload(PGListing.room_types),
                selectinload(PGListing.listing_amenities),
            )
            .where(PGListing.slug == slug)
        )
        result = await self.db.execute(stmt)
        listing = result.scalar_one_or_none()
        if not listing:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="PG listing not found")
        return listing

    async def search(
        self,
        area: str | None = None,
        min_price: int | None = None,
        max_price: int | None = None,
        gender_preference: GenderPreference | None = None,
        page: int = 1,
        page_size: int = 20,
    ) -> tuple[list[PGListing], int]:
        query = select(PGListing).where(PGListing.status == ListingStatus.ACTIVE)

        if area:
            query = query.where(PGListing.area.ilike(f"%{area}%"))
        if min_price is not None:
            query = query.where(PGListing.price_from >= min_price)
        if max_price is not None:
            query = query.where(PGListing.price_from <= max_price)
        if gender_preference and gender_preference != GenderPreference.ANY:
            query = query.where(
                (PGListing.gender_preference == gender_preference)
                | (PGListing.gender_preference == GenderPreference.ANY)
            )

        count_stmt = select(func.count()).select_from(query.subquery())
        total = (await self.db.execute(count_stmt)).scalar() or 0

        paginated_stmt = (
            query.options(
                selectinload(PGListing.media),
                selectinload(PGListing.room_types),
            )
            .order_by(PGListing.created_at.desc())
            .offset((page - 1) * page_size)
            .limit(page_size)
        )
        items = (await self.db.execute(paginated_stmt)).scalars().all()
        return list(items), total

    async def update_listing(
        self, listing_id: uuid.UUID, owner: User, update_data: PGListingUpdate
    ) -> PGListing:
        listing = await self.get_by_id(listing_id)
        if listing.owner_id != owner.id and owner.role != UserRole.ADMIN:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to edit listing")

        data = update_data.model_dump(exclude_unset=True)
        if "status" in data and owner.role != UserRole.ADMIN:
            if data["status"] == ListingStatus.ACTIVE:
                data["status"] = ListingStatus.PENDING

        for key, value in data.items():
            setattr(listing, key, value)

        await self.db.commit()
        await self.db.refresh(listing)
        return listing

    async def save_pg(self, user: User, listing_id: uuid.UUID) -> bool:
        stmt = select(SavedPG).where(SavedPG.user_id == user.id, SavedPG.listing_id == listing_id)
        existing = (await self.db.execute(stmt)).scalar_one_or_none()
        if existing:
            await self.db.delete(existing)
            await self.db.commit()
            return False
        else:
            saved = SavedPG(user_id=user.id, listing_id=listing_id)
            self.db.add(saved)
            await self.db.commit()
            return True

    async def get_saved_pgs(self, user: User) -> list[PGListing]:
        stmt = (
            select(PGListing)
            .join(SavedPG, PGListing.id == SavedPG.listing_id)
            .where(SavedPG.user_id == user.id)
            .options(
                selectinload(PGListing.media),
                selectinload(PGListing.room_types),
            )
        )
        return list((await self.db.execute(stmt)).scalars().all())

    async def express_interest(self, user: User, listing_id: uuid.UUID, message: str | None = None) -> Interest:
        stmt = select(Interest).where(Interest.user_id == user.id, Interest.listing_id == listing_id)
        existing = (await self.db.execute(stmt)).scalar_one_or_none()
        if existing:
            return existing

        interest = Interest(
            user_id=user.id,
            listing_id=listing_id,
            message=message,
            status=InterestStatus.PENDING,
        )
        self.db.add(interest)
        await self.db.commit()
        await self.db.refresh(interest)
        return interest
