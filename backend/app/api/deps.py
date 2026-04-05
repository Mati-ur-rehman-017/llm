"""FastAPI dependency injection for service singletons."""

from __future__ import annotations

import logging
from functools import lru_cache

from app.config import settings
from app.data.vectorstore import VectorStore
from app.services.chat import ChatService
from app.services.document import DocumentService
from app.services.embedding import EmbeddingService
from app.services.llm import LLMService
from app.services.retrieval import RetrievalService

logger = logging.getLogger(__name__)


@lru_cache(maxsize=1)
def get_vector_store() -> VectorStore:
    """Return a singleton VectorStore backed by ChromaDB."""

    logger.info("Initializing VectorStore at %s", settings.chroma_path)
    return VectorStore(path=str(settings.chroma_path))


@lru_cache(maxsize=1)
def get_embedding_service() -> EmbeddingService:
    """Return a singleton EmbeddingService."""

    logger.info("Initializing EmbeddingService with %s", settings.embedding_model)
    return EmbeddingService(model_name=settings.embedding_model)


@lru_cache(maxsize=1)
def get_llm_service() -> LLMService:
    """Return a singleton LLMService connected to Ollama."""

    logger.info(
        "Initializing LLMService at %s with model %s",
        settings.ollama_base_url,
        settings.ollama_model,
    )
    return LLMService(
        base_url=settings.ollama_base_url,
        model=settings.ollama_model,
    )


@lru_cache(maxsize=1)
def get_retrieval_service() -> RetrievalService:
    """Return a singleton RetrievalService."""

    return RetrievalService(
        vector_store=get_vector_store(),
        embedding_service=get_embedding_service(),
    )


@lru_cache(maxsize=1)
def get_chat_service() -> ChatService:
    """Return a singleton ChatService wiring retrieval and LLM together."""

    return ChatService(
        retrieval_service=get_retrieval_service(),
        llm_service=get_llm_service(),
    )


@lru_cache(maxsize=1)
def get_document_service() -> DocumentService:
    """Return a singleton DocumentService for document management."""

    return DocumentService(
        vector_store=get_vector_store(),
        embedding_service=get_embedding_service(),
    )
