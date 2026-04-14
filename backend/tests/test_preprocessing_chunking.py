"""Tests for metadata-aware smart chunking."""

from __future__ import annotations

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.data.preprocessing import Document, chunk_document_smart


def test_qa_document_kept_as_single_chunk_when_short() -> None:
    doc = Document(
        id="qa:1",
        text="Q: What is X?\nA: X is ...",
        metadata={"type": "qa", "source": "qa.json", "category": "General"},
    )
    chunks = chunk_document_smart(doc)
    assert len(chunks) == 1
    assert chunks[0].metadata["is_faq"] == "true"


def test_long_qa_answer_splits_but_keeps_question_context() -> None:
    long_answer = "A: " + ("details " * 1000)
    doc = Document(
        id="qa:2",
        text=f"Q: How does Y work?\n{long_answer}",
        metadata={"type": "qa", "source": "qa.json"},
    )
    chunks = chunk_document_smart(doc, qa_chunk_size=700, qa_overlap=120)
    assert len(chunks) > 1
    assert all("Q: How does Y work?" in c.text for c in chunks)
    assert all(c.metadata["is_faq"] == "true" for c in chunks)


def test_rate_document_not_char_sliced_when_already_semantic() -> None:
    doc = Document(
        id="rate:1",
        text=(
            "Document: Rates\nCategory: Savings Accounts\n"
            "Profit Payment: Semi-Annually\nProfit Rate: 0.19"
        ),
        metadata={"type": "rate", "source": "sheet.xlsx"},
    )
    chunks = chunk_document_smart(doc)
    assert len(chunks) == 1
    assert chunks[0].metadata["doc_kind"] == "rate"
