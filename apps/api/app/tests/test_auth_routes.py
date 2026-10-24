"""
PGConnect API — Auth and API route tests.
"""

import pytest
from httpx import ASGITransport, AsyncClient

from app.main import app


@pytest.mark.asyncio
async def test_auth_rejection_without_token():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        res = await client.get("/api/v1/users/me")
        assert res.status_code == 401


@pytest.mark.asyncio
async def test_invalid_bearer_token():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        res = await client.get("/api/v1/users/me", headers={"Authorization": "Bearer invalid.jwt.token"})
        assert res.status_code == 401
