"""RAG retrieval service — embeds a query and searches the vector store."""

from __future__ import annotations

import logging

from app.data.vectorstore import VectorSearchResult, VectorStore
from app.services.embedding import EmbeddingService

logger = logging.getLogger(__name__)

_DEFAULT_TOP_K = 5
_RELEVANCE_THRESHOLD = 0.3


class RetrievalService:
    """Retrieve the most relevant document chunks for a user query."""

    def __init__(
        self,
        vector_store: VectorStore,
        embedding_service: EmbeddingService,
    ) -> None:
        self.vector_store = vector_store
        self.embedding_service = embedding_service

    async def retrieve(
        self,
        query: str,
        top_k: int = _DEFAULT_TOP_K,
    ) -> list[VectorSearchResult]:
        """Embed *query*, search ChromaDB, and filter by relevance score."""

        query_embedding = self.embedding_service.embed(query)
        results = self.vector_store.search(query_embedding, top_k)

        filtered = [r for r in results if r.score > _RELEVANCE_THRESHOLD]

        logger.info(
            "Retrieved %d/%d chunks above threshold %.2f for query: %s",
            len(filtered),
            len(results),
            _RELEVANCE_THRESHOLD,
            query[:80],
        )

        return filtered
