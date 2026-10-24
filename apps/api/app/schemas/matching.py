"""
PGConnect API — Roommate Matching Schemas.
"""

import uuid
from pydantic import BaseModel, ConfigDict
from app.schemas.roommate import RoommateProfileRead


class MatchResult(BaseModel):
    candidate: RoommateProfileRead
    score: int
    reasons: list[str]


class MatchResponse(BaseModel):
    items: list[MatchResult]
    total: int
