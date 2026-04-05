"""Pydantic request/response schemas for the API."""

from __future__ import annotations

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field


class MessageItem(BaseModel):
    """A single message in the conversation history."""

    role: Literal["user", "assistant"]
    content: str


class ChatRequest(BaseModel):
    """Incoming chat message from the user."""

    message: str = Field(..., min_length=1, max_length=4000)
    history: list[MessageItem] = Field(default_factory=list)


class Source(BaseModel):
    """A single retrieved source document reference."""

    doc_id: str
    score: float
    text: str


class ChatResponse(BaseModel):
    """Response returned by the chat endpoint."""

    response: str
    sources: list[Source] = Field(default_factory=list)


class DocumentResponse(BaseModel):
    """Metadata for a single document in the vector store."""

    id: str
    filename: str
    status: Literal["indexed", "processing", "failed"]
    indexed_at: datetime
    chunk_count: int
    metadata: dict[str, str] = Field(default_factory=dict)


class DocumentUploadResponse(BaseModel):
    """Response after uploading a document."""

    id: str
    status: Literal["success", "error"]
    message: str
    chunks_created: int = 0


class DocumentListResponse(BaseModel):
    """List of all documents in the system."""

    documents: list[DocumentResponse]
    total: int


class DocumentDeleteResponse(BaseModel):
    """Response after deleting a document."""

    status: Literal["success", "error"]
    message: str
