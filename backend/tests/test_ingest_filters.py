"""Tests for ingestion file filtering rules."""

from __future__ import annotations

import os
import sys
from pathlib import Path
from types import SimpleNamespace

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

os.environ.setdefault("ollama_base_url", "http://localhost:11434")
os.environ.setdefault("ollama_model", "dummy-model")
os.environ.setdefault("chroma_path", "./chroma_db")
os.environ.setdefault("embedding_model", "dummy-embedding")
os.environ.setdefault("api_host", "127.0.0.1")
os.environ.setdefault("api_port", "8000")
os.environ.setdefault("log_level", "INFO")
os.environ.setdefault("max_input_length", "1024")
os.environ.setdefault("rate_limit_per_minute", "60")

from scripts.ingest_data import should_ingest_file
from app.data.preprocessing import Document, DocumentChunk


def test_should_skip_libreoffice_lock_file() -> None:
    assert should_ingest_file(Path(".~lock.NUST Bank-Product-Knowledge.xlsx#")) is False


def test_should_skip_hidden_files() -> None:
    assert should_ingest_file(Path(".DS_Store")) is False


def test_should_allow_supported_extensions() -> None:
    assert should_ingest_file(Path("qa.json")) is True
    assert should_ingest_file(Path("NUST Bank-Product-Knowledge.xlsx")) is True
    assert should_ingest_file(Path("notes.txt")) is True


def test_indexing_uses_smart_chunker_for_qa(monkeypatch) -> None:
    from scripts import ingest_data

    docs = [
        Document(
            id="qa:doc:1",
            text="Q: How to reset MPIN?\nA: Use profile settings.",
            metadata={"type": "qa", "source": "qa.json"},
        )
    ]

    captured_texts: list[str] = []

    def fake_chunker(doc: Document):
        assert doc.metadata.get("type") == "qa"
        return [
            DocumentChunk(
                id=f"{doc.id}:qa:0",
                text=doc.text,
                metadata={"type": "qa", "is_faq": "true", "doc_kind": "qa"},
            )
        ]

    class FakeEmbeddingService:
        def embed_batch(self, texts):
            captured_texts.extend(texts)
            return [[0.1, 0.2, 0.3] for _ in texts]

    stored_metadatas: list[dict[str, str | int]] = []

    class FakeVectorStore:
        def add_document(self, doc_id, text, embedding, metadata):
            stored_metadatas.append(metadata)

    monkeypatch.setattr(ingest_data, "chunk_document_smart", fake_chunker)

    counts = ingest_data._index_documents(
        docs,
        embedding_service=FakeEmbeddingService(),
        vector_store=FakeVectorStore(),
    )

    assert captured_texts
    assert counts["faq_chunks"] == 1
    assert stored_metadatas[0]["is_faq"] == "true"
