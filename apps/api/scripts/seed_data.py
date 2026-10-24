"""
PGConnect — Database Seeding Script.
Populates realistic fictional Gurgaon PG listings, amenities, and roommate profiles.
Areas: Sector 22, Udyog Vihar, DLF Cyber City, Golf Course Road, Sector 14.
"""

import asyncio
import uuid
from datetime import date

from sqlalchemy import select
from app.db.session import AsyncSessionLocal
from app.models.listing import (
    Amenity,
    AvailabilityStatus,
    GenderPreference,
    ListingStatus,
    MediaType,
    PGListing,
    PGListingAmenity,
    PGMedia,
    RoomSharingType,
    RoomType,
)
from app.models.roommate import (
    FoodPreference,
    Occupation,
    ProfileVisibility,
    RoommateProfile,
    SleepSchedule,
    SmokingPreference,
)
from app.models.user import AccountStatus, User, UserRole

SAMPLE_AMENITIES = [
    {"name": "High-Speed WiFi", "slug": "wifi", "icon": "wifi"},
    {"name": "Power Backup (24x7)", "slug": "power-backup", "icon": "bolt"},
    {"name": "Air Conditioning (AC)", "slug": "ac", "icon": "ac_unit"},
    {"name": "Homely Meals (3 Times)", "slug": "meals", "icon": "restaurant"},
    {"name": "Attached Bathroom", "slug": "attached-bath", "icon": "bathtub"},
    {"name": "Daily Housekeeping", "slug": "housekeeping", "icon": "cleaning_services"},
    {"name": "Fully Automatic Washing Machine", "slug": "washing-machine", "icon": "local_laundry_service"},
    {"name": "24/7 Biometric Security & CCTV", "slug": "security", "icon": "security"},
    {"name": "Gym & Fitness Zone", "slug": "gym", "icon": "fitness_center"},
    {"name": "RO Purified Drinking Water", "slug": "ro-water", "icon": "water_drop"},
]

SAMPLE_USERS = [
    {
        "auth_user_id": "auth-owner-gurgaon-1",
        "name": "Rajesh Sharma",
        "email": "rajesh.sharma@pgconnect.local",
        "phone": "+919811223344",
        "role": UserRole.PG_OWNER,
    },
    {
        "auth_user_id": "auth-owner-gurgaon-2",
        "name": "Sunita Verma",
        "email": "sunita.verma@pgconnect.local",
        "phone": "+919877665544",
        "role": UserRole.PG_OWNER,
    },
    {
        "auth_user_id": "auth-roommate-aarav",
        "name": "Aarav Mehta",
        "email": "aarav.mehta@pgconnect.local",
        "phone": "+919822334455",
        "role": UserRole.USER,
        "profile": {
            "occupation": Occupation.WORKING_PROFESSIONAL,
            "company_or_college": "Google Gurgaon",
            "bio": "Software Engineer working at Cyber City. Looking for a neat, chill roommate to split a 2BHK/twin-sharing PG.",
            "budget_min": 12000,
            "budget_max": 20000,
            "preferred_areas": ["Cyber City", "Sector 22", "Udyog Vihar"],
            "move_in_date": date.today(),
            "food_preference": FoodPreference.VEGETARIAN,
            "sleep_schedule": SleepSchedule.EARLY_BIRD,
            "smoking_preference": SmokingPreference.NO_SMOKING,
            "has_pets": False,
            "ok_with_pets": True,
            "is_discoverable": True,
        },
    },
    {
        "auth_user_id": "auth-roommate-priya",
        "name": "Priya Sen",
        "email": "priya.sen@pgconnect.local",
        "phone": "+919833445566",
        "role": UserRole.USER,
        "profile": {
            "occupation": Occupation.WORKING_PROFESSIONAL,
            "company_or_college": "Deloitte",
            "bio": "Risk consultant moving to Gurgaon. Clean habits, enjoys weekend brunch and quiet evenings.",
            "budget_min": 14000,
            "budget_max": 22000,
            "preferred_areas": ["Golf Course Road", "Cyber City", "Sector 22"],
            "move_in_date": date.today(),
            "food_preference": FoodPreference.ANY,
            "sleep_schedule": SleepSchedule.FLEXIBLE,
            "smoking_preference": SmokingPreference.NO_SMOKING,
            "has_pets": False,
            "ok_with_pets": True,
            "is_discoverable": True,
        },
    },
    {
        "auth_user_id": "auth-roommate-kabir",
        "name": "Kabir Malhotra",
        "email": "kabir.malhotra@pgconnect.local",
        "phone": "+919844556677",
        "role": UserRole.USER,
        "profile": {
            "occupation": Occupation.STUDENT,
            "company_or_college": "The NorthCap University (NCU)",
            "bio": "CS undergrad looking for quiet PG close to campus in Sector 22 or 23.",
            "budget_min": 8000,
            "budget_max": 14000,
            "preferred_areas": ["Sector 22", "Sector 23", "Palam Vihar"],
            "move_in_date": date.today(),
            "food_preference": FoodPreference.VEGETARIAN,
            "sleep_schedule": SleepSchedule.NIGHT_OWL,
            "smoking_preference": SmokingPreference.NO_SMOKING,
            "has_pets": False,
            "ok_with_pets": False,
            "is_discoverable": True,
        },
    },
]

SAMPLE_LISTINGS = [
    {
        "name": "Zolo Cyber Hub Luxury Living",
        "slug": "zolo-cyber-hub-luxury-living-gurgaon",
        "area": "Cyber City",
        "address": "DLF Phase 2, Near Sikanderpur Metro, Cyber City, Gurgaon",
        "latitude": 28.4905,
        "longitude": 77.0890,
        "price_from": 16500,
        "price_to": 26000,
        "security_deposit": 20000,
        "gender_preference": GenderPreference.ANY,
        "house_rules": "No smoking inside rooms. Guests allowed in lounge till 9 PM.",
        "description": "Premium co-living space minutes away from Cyber Hub and Rapid Metro. Fully furnished with high-speed fiber, daily meals, laundry, and round-the-clock security.",
        "room_types": [
            {"sharing_type": RoomSharingType.SINGLE, "price_per_month": 26000, "total_beds": 10, "available_beds": 2},
            {"sharing_type": RoomSharingType.DOUBLE, "price_per_month": 16500, "total_beds": 24, "available_beds": 5},
        ],
        "media": [
            "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80",
        ],
    },
    {
        "name": "Stanza Living Udyog Vihar Executive",
        "slug": "stanza-living-udyog-vihar-executive-gurgaon",
        "area": "Udyog Vihar",
        "address": "Plot 124, Phase 4, Udyog Vihar, Gurgaon",
        "latitude": 28.5028,
        "longitude": 77.0818,
        "price_from": 13000,
        "price_to": 21000,
        "security_deposit": 15000,
        "gender_preference": GenderPreference.MALE,
        "house_rules": "No loud music post 11 PM. Strictly non-smoking premises.",
        "description": "Designed for tech professionals working in Udyog Vihar Phase 1-5. Includes chef-prepared meals, ergonomic work desks, high-speed WiFi, and gym access.",
        "room_types": [
            {"sharing_type": RoomSharingType.DOUBLE, "price_per_month": 13000, "total_beds": 30, "available_beds": 8},
            {"sharing_type": RoomSharingType.SINGLE, "price_per_month": 21000, "total_beds": 12, "available_beds": 1},
        ],
        "media": [
            "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
        ],
    },
    {
        "name": "Sector 22 Scholar Residency",
        "slug": "sector-22-scholar-residency-gurgaon",
        "area": "Sector 22",
        "address": "H.No 412, Sector 22A, Near Rotary Public School, Gurgaon",
        "latitude": 28.5065,
        "longitude": 77.0620,
        "price_from": 8500,
        "price_to": 14500,
        "security_deposit": 10000,
        "gender_preference": GenderPreference.ANY,
        "house_rules": "Quiet study hours after 10 PM. Gate closes at 11:30 PM.",
        "description": "Pocket-friendly, peaceful residency ideal for NCU students and interns. Walking distance to local markets, bus stops, and Sector 22 market.",
        "room_types": [
            {"sharing_type": RoomSharingType.TRIPLE, "price_per_month": 8500, "total_beds": 18, "available_beds": 4},
            {"sharing_type": RoomSharingType.DOUBLE, "price_per_month": 11500, "total_beds": 20, "available_beds": 3},
            {"sharing_type": RoomSharingType.SINGLE, "price_per_month": 14500, "total_beds": 6, "available_beds": 2},
        ],
        "media": [
            "https://images.unsplash.com/photo-1540518614846-7ede433c4ef0?auto=format&fit=crop&w=800&q=80",
        ],
    },
]


async def seed():
    print("🌱 Starting database seeding for PGConnect Gurgaon market...")
    async with AsyncSessionLocal() as db:
        # 1. Seed Amenities
        amenity_objs = {}
        for a_data in SAMPLE_AMENITIES:
            stmt = select(Amenity).where(Amenity.slug == a_data["slug"])
            amenity = (await db.execute(stmt)).scalar_one_or_none()
            if not amenity:
                amenity = Amenity(**a_data)
                db.add(amenity)
                await db.flush()
            amenity_objs[a_data["slug"]] = amenity
        print(f"✅ Synced {len(amenity_objs)} amenities")

        # 2. Seed Users & Profiles
        user_objs = {}
        for u_data in SAMPLE_USERS:
            stmt = select(User).where(User.email == u_data["email"])
            user = (await db.execute(stmt)).scalar_one_or_none()
            prof_data = u_data.get("profile")
            if not user:
                user = User(
                    auth_user_id=u_data["auth_user_id"],
                    name=u_data["name"],
                    email=u_data["email"],
                    phone=u_data["phone"],
                    role=u_data["role"],
                    account_status=AccountStatus.ACTIVE,
                    is_email_verified=True,
                )
                db.add(user)
                await db.flush()

            user_objs[u_data["email"]] = user

            if prof_data:
                prof_stmt = select(RoommateProfile).where(RoommateProfile.user_id == user.id)
                prof = (await db.execute(prof_stmt)).scalar_one_or_none()
                if not prof:
                    prof = RoommateProfile(user_id=user.id, **prof_data)
                    db.add(prof)
        print(f"✅ Synced {len(user_objs)} users and roommate profiles")

        # 3. Seed PG Listings
        owner = user_objs.get("rajesh.sharma@pgconnect.local")
        for l_data in SAMPLE_LISTINGS:
            stmt = select(PGListing).where(PGListing.slug == l_data["slug"])
            listing = (await db.execute(stmt)).scalar_one_or_none()
            if not listing:
                listing = PGListing(
                    owner_id=owner.id,
                    name=l_data["name"],
                    slug=l_data["slug"],
                    area=l_data["area"],
                    address=l_data["address"],
                    latitude=l_data["latitude"],
                    longitude=l_data["longitude"],
                    price_from=l_data["price_from"],
                    price_to=l_data["price_to"],
                    security_deposit=l_data["security_deposit"],
                    gender_preference=l_data["gender_preference"],
                    house_rules=l_data["house_rules"],
                    description=l_data["description"],
                    status=ListingStatus.ACTIVE,
                    is_verified=True,
                )
                db.add(listing)
                await db.flush()

                for rt in l_data["room_types"]:
                    room = RoomType(listing_id=listing.id, **rt)
                    db.add(room)

                for idx, path in enumerate(l_data["media"]):
                    media = PGMedia(
                        listing_id=listing.id,
                        media_type=MediaType.IMAGE,
                        storage_path=path,
                        sort_order=idx,
                    )
                    db.add(media)

                for a_obj in list(amenity_objs.values())[:6]:
                    link = PGListingAmenity(listing_id=listing.id, amenity_id=a_obj.id)
                    db.add(link)

        await db.commit()
        print("🎉 Database seeding completed successfully!")


if __name__ == "__main__":
    asyncio.run(seed())
