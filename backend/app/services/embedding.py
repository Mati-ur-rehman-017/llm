"""Embedding service powered by SentenceTransformer."""

from __future__ import annotations

from typing import Iterable

from sentence_transformers import SentenceTransformer


class EmbeddingService:
    def __init__(self, model_name: str = "all-MiniLM-L6-v2") -> None:
        self.model = SentenceTransformer(model_name)
        self.dimension = self.model.get_sentence_embedding_dimension()

    def embed(self, text: str) -> list[float]:
        return self.model.encode(text).tolist()

    def embed_batch(self, texts: Iterable[str]) -> list[list[float]]:
        return self.model.encode(list(texts)).tolist()
