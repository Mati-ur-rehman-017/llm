"""FastAPI application entry point."""

from __future__ import annotations

import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.chat import router as chat_router
from app.api.routes.health import router as health_router
from app.config import settings

LOG_LEVEL = settings.log_level.upper()
logging.basicConfig(level=LOG_LEVEL)
logger = logging.getLogger("uvicorn")


def create_app() -> FastAPI:
    """Construct and configure the FastAPI application."""

    app = FastAPI(
        title="NUST Bank Customer Assistant",
        version="0.1.0",
        description="LLM-powered customer service assistant for NUST Bank",
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(health_router)
    app.include_router(chat_router)

    @app.on_event("startup")
    async def startup() -> None:
        app.state.settings = settings
        logger.info("Starting backend", extra={"settings": settings.model_dump()})

    @app.on_event("shutdown")
    async def shutdown() -> None:
        logger.info("Shutting down backend")

    return app


app = create_app()
