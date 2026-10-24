"""
PGConnect API — Roommate Matching Schemas.
"""

from pydantic import BaseModel
from app.schemas.roommate import RoommateProfileRead


class MatchResult(BaseModel):
    candidate: RoommateProfileRead
    score: int
    reasons: list[str]


class MatchResponse(BaseModel):
    items: list[MatchResult]
    total: int
