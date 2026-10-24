"""
PGConnect API — Roommate Matches endpoint.
"""

from typing import Annotated
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.auth import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.matching import MatchResponse
from app.services.matching_service import MatchingService

router = APIRouter()


@router.get("", response_model=MatchResponse)
async def get_roommate_matches(
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)],
    min_score: int = Query(30, ge=0, le=100),
    limit: int = Query(50, ge=1, le=100),
) -> MatchResponse:
    """
    Computes deterministic roommate compatibility scores (0-100)
    for the current user against discoverable peers in Gurgaon.
    """
    service = MatchingService(db)
    items = await service.get_matches_for_user(current_user, min_score=min_score, limit=limit)
    return MatchResponse(items=items, total=len(items))
