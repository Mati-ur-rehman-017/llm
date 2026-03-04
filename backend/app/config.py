"""Application configuration using environment variables."""

from __future__ import annotations

from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Typed settings shared across backend services."""

    ollama_base_url: str
    ollama_model: str
    chroma_path: Path
    embedding_model: str
    api_host: str
    api_port: int
    log_level: str
    max_input_length: int
    rate_limit_per_minute: int

    model_config = SettingsConfigDict(env_file=".env", freeze=True)

    @property
    def host_port(self) -> tuple[str, int]:
        return self.api_host, self.api_port


settings = Settings()
