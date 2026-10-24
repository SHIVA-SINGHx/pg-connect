"""
PGConnect API — Top-level v1 router.
All domain sub-routers are mounted here with their prefixes and tags.
"""

from fastapi import APIRouter

from app.api.v1.endpoints import (
    admin,
    connections,
    health_ext,
    matches,
    messages,
    notifications,
    owner,
    pgs,
    profiles,
    users,
)

api_router = APIRouter()

api_router.include_router(health_ext.router, prefix="/system", tags=["system"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(profiles.router, prefix="/profiles", tags=["profiles"])
api_router.include_router(pgs.router, prefix="/pgs", tags=["pgs"])
api_router.include_router(matches.router, prefix="/matches", tags=["matches"])
api_router.include_router(connections.router, prefix="/connections", tags=["connections"])
api_router.include_router(messages.router, prefix="/messages", tags=["messages"])
api_router.include_router(notifications.router, prefix="/notifications", tags=["notifications"])
api_router.include_router(owner.router, prefix="/owner", tags=["owner"])
api_router.include_router(admin.router, prefix="/admin", tags=["admin"])
