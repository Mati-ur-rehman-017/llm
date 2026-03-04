"""Health check route definitions."""

from __future__ import annotations

from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/api/health", tags=["health"])


class HealthResponse(BaseModel):
    status: str
    services: dict[str, str]


@router.get("/", response_model=HealthResponse)
async def health() -> HealthResponse:  # pragma: no cover
    return HealthResponse(status="ok", services={})
