"""Async client for the Ollama LLM inference server."""

from __future__ import annotations

import json
import logging
from typing import AsyncGenerator

import httpx

logger = logging.getLogger(__name__)

_GENERATE_TIMEOUT = 60.0
_STREAM_TIMEOUT = 120.0


class LLMService:
    """Thin async wrapper around the Ollama ``/api/generate`` endpoint."""

    def __init__(self, base_url: str, model: str) -> None:
        self.base_url = base_url.rstrip("/")
        self.model = model

    async def generate(self, prompt: str, system: str) -> str:
        """Send a non-streaming generate request and return the full response."""

        payload = {
            "model": self.model,
            "prompt": prompt,
            "system": system,
            "stream": False,
        }

        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/api/generate",
                json=payload,
                timeout=_GENERATE_TIMEOUT,
            )
            response.raise_for_status()
            data = response.json()

        return data.get("response", "")

    async def stream_generate(
        self, prompt: str, system: str
    ) -> AsyncGenerator[str, None]:
        """Stream tokens from Ollama, yielding each piece as it arrives."""

        payload = {
            "model": self.model,
            "prompt": prompt,
            "system": system,
            "stream": True,
        }

        async with httpx.AsyncClient() as client:
            async with client.stream(
                "POST",
                f"{self.base_url}/api/generate",
                json=payload,
                timeout=_STREAM_TIMEOUT,
            ) as response:
                response.raise_for_status()
                async for line in response.aiter_lines():
                    if not line:
                        continue
                    try:
                        data = json.loads(line)
                    except json.JSONDecodeError:
                        logger.warning("Skipping malformed Ollama line: %s", line)
                        continue
                    token = data.get("response", "")
                    if token:
                        yield token
                    if data.get("done", False):
                        return
