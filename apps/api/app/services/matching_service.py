"""
PGConnect API — Roommate Deterministic Scoring & Matching Engine.
Calculates compatibility across:
- Preferred Area (up to 40 pts)
- Budget Range (up to 25 pts)
- Move-in Date Proximity (up to 20 pts)
- Lifestyle Compatibility (up to 15 pts)
Total: 100 points
"""

from datetime import date
from typing import Sequence
from sqlalchemy import not_, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.interactions import Connection, ConnectionStatus
from app.models.roommate import FoodPreference, ProfileVisibility, RoommateProfile, SleepSchedule, SmokingPreference
from app.models.user import User
from app.schemas.matching import MatchResult
from app.schemas.roommate import RoommateProfileRead
from app.schemas.user import UserRead


def calculate_match_score(
    profile_a: RoommateProfile,
    profile_b: RoommateProfile,
) -> tuple[int, list[str]]:
    """
    Computes deterministic match score (0-100) and human-readable explanations.
    """
    score = 0
    reasons: list[str] = []

    # 1. Location / Area overlap (up to 40 points)
    areas_a = set(a.lower().strip() for a in (profile_a.preferred_areas or []))
    areas_b = set(b.lower().strip() for b in (profile_b.preferred_areas or []))
    shared_areas = areas_a.intersection(areas_b)

    if shared_areas:
        score += 40
        reasons.append(f"Shared preferred area: {', '.join(sorted(shared_areas)).title()}")
    elif not areas_a or not areas_b:
        score += 20
        reasons.append("Open to exploring various Gurgaon areas")

    # 2. Budget proximity (up to 25 points)
    b_min_a, b_max_a = profile_a.budget_min or 5000, profile_a.budget_max or 25000
    b_min_b, b_max_b = profile_b.budget_min or 5000, profile_b.budget_max or 25000

    overlap_start = max(b_min_a, b_min_b)
    overlap_end = min(b_max_a, b_max_b)

    if overlap_start <= overlap_end:
        score += 25
        reasons.append("Overlapping budget ranges")
    else:
        gap = overlap_start - overlap_end
        if gap <= 3000:
            score += 15
            reasons.append("Close budget range (within ₹3,000)")
        elif gap <= 6000:
            score += 5
            reasons.append("Manageable budget difference")

    # 3. Move-in date proximity (up to 20 points)
    date_a = profile_a.move_in_date or date.today()
    date_b = profile_b.move_in_date or date.today()
    diff_days = abs((date_a - date_b).days)

    if profile_a.move_in_flexible or profile_b.move_in_flexible:
        score += 18
        reasons.append("Flexible move-in timeline")
    elif diff_days <= 7:
        score += 20
        reasons.append("Move-in dates within a week")
    elif diff_days <= 14:
        score += 14
        reasons.append("Move-in dates within two weeks")
    elif diff_days <= 30:
        score += 8
        reasons.append("Move-in dates within the month")

    # 4. Lifestyle compatibility (up to 15 points)
    lifestyle_pts = 0

    if (
        profile_a.food_preference == FoodPreference.ANY
        or profile_b.food_preference == FoodPreference.ANY
        or profile_a.food_preference == profile_b.food_preference
    ):
        lifestyle_pts += 5
        reasons.append("Compatible food preferences")

    if (
        profile_a.sleep_schedule == SleepSchedule.FLEXIBLE
        or profile_b.sleep_schedule == SleepSchedule.FLEXIBLE
        or profile_a.sleep_schedule == profile_b.sleep_schedule
    ):
        lifestyle_pts += 4
        reasons.append("Aligned sleep routine")

    if profile_a.smoking_preference == profile_b.smoking_preference:
        lifestyle_pts += 3
        if profile_a.smoking_preference == SmokingPreference.NO_SMOKING:
            reasons.append("Both prefer smoke-free space")
    elif (
        profile_a.smoking_preference != SmokingPreference.NO_SMOKING
        and profile_b.smoking_preference == SmokingPreference.OK_WITH_SMOKING
    ):
        lifestyle_pts += 3

    pets_ok = True
    if profile_a.has_pets and not profile_b.ok_with_pets:
        pets_ok = False
    if profile_b.has_pets and not profile_a.ok_with_pets:
        pets_ok = False
    if pets_ok:
        lifestyle_pts += 3

    score += lifestyle_pts
    final_score = min(score, 100)
    return final_score, reasons


class MatchingService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_matches_for_user(
        self,
        current_user: User,
        min_score: int = 40,
        limit: int = 50,
    ) -> list[MatchResult]:
        profile_stmt = select(RoommateProfile).where(RoommateProfile.user_id == current_user.id)
        user_profile = (await self.db.execute(profile_stmt)).scalar_one_or_none()

        if not user_profile:
            user_profile = RoommateProfile(user_id=current_user.id)
            self.db.add(user_profile)
            await self.db.commit()
            await self.db.refresh(user_profile)

        blocked_stmt = select(Connection.receiver_id).where(
            Connection.sender_id == current_user.id, Connection.status == ConnectionStatus.BLOCKED
        )
        blocked_ids = (await self.db.execute(blocked_stmt)).scalars().all()

        candidates_stmt = (
            select(RoommateProfile)
            .join(User, RoommateProfile.user_id == User.id)
            .where(
                RoommateProfile.user_id != current_user.id,
                RoommateProfile.is_discoverable == True,
                RoommateProfile.profile_visibility != ProfileVisibility.HIDDEN,
                not_(RoommateProfile.user_id.in_(blocked_ids)) if blocked_ids else True,
            )
            .options(selectinload(RoommateProfile.user))
            .limit(limit * 2)
        )
        candidates = (await self.db.execute(candidates_stmt)).scalars().all()

        results: list[MatchResult] = []
        for cand in candidates:
            score, reasons = calculate_match_score(user_profile, cand)
            if score >= min_score:
                cand_read = RoommateProfileRead.model_validate(cand)
                if cand.user:
                    cand_read.user = UserRead.model_validate(cand.user)
                results.append(MatchResult(candidate=cand_read, score=score, reasons=reasons))

        results.sort(key=lambda x: x.score, reverse=True)
        return results[:limit]
