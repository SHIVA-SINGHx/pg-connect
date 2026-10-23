"""
PGConnect API — Top-level v1 router.
Domain routers are mounted here. Add new domain routers below.
"""

from fastapi import APIRouter

from app.api.v1.endpoints import health_ext

api_router = APIRouter()

# Domain routers (added per phase)
api_router.include_router(health_ext.router, prefix="/system", tags=["system"])

# Phase 2+
# api_router.include_router(users.router, prefix="/users", tags=["users"])
# api_router.include_router(profiles.router, prefix="/profiles", tags=["profiles"])
# api_router.include_router(pgs.router, prefix="/pgs", tags=["pgs"])
# api_router.include_router(matches.router, prefix="/matches", tags=["matches"])
# api_router.include_router(connections.router, prefix="/connections", tags=["connections"])
# api_router.include_router(messages.router, prefix="/messages", tags=["messages"])
# api_router.include_router(notifications.router, prefix="/notifications", tags=["notifications"])
