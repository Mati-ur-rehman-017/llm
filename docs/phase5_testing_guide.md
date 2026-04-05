# Phase 5 - Document Upload API Testing Guide

## Overview

Phase 5 implementation adds real-time document upload capabilities to the NUST Bank Assistant. Documents can be uploaded via API, processed, anonymized, chunked, embedded, and immediately available for queries.

## Implementation Summary

### Files Created
1. **backend/app/services/document.py** (269 lines)
   - DocumentService class for document management
   - upload_document() - Process and index uploaded files
   - list_documents() - List all indexed documents
   - delete_document() - Remove documents and chunks

2. **backend/app/api/routes/documents.py** (108 lines)
   - GET /api/documents - List endpoint
   - POST /api/documents - Upload endpoint
   - DELETE /api/documents/{doc_id} - Delete endpoint

### Files Modified
3. **backend/app/models/schemas.py** (+35 lines, total 71)
   - Added DocumentResponse
   - Added DocumentUploadResponse
   - Added DocumentListResponse
   - Added DocumentDeleteResponse

4. **backend/app/api/deps.py** (+11 lines, total 77)
   - Added get_document_service() dependency

5. **backend/app/main.py** (+2 lines, total 53)
   - Registered documents router

6. **.env.example** (+4 lines, total 22)
   - Added UPLOAD_DIR configuration
   - Added MAX_FILE_SIZE_MB configuration

## API Endpoints

### 1. List Documents
```bash
GET /api/documents
```

**Response:**
```json
{
  "documents": [
    {
      "id": "qa:accounts:0",
      "filename": "qa.json",
      "status": "indexed",
      "indexed_at": "2026-04-05T18:00:00",
      "chunk_count": 15,
      "metadata": {
        "source": "qa.json",
        "category": "accounts"
      }
    }
  ],
  "total": 1
}
```

### 2. Upload Document
```bash
POST /api/documents
Content-Type: multipart/form-data
```

**Request:**
- file: (binary file data)

**Supported Formats:**
- JSON (.json)
- CSV (.csv)
- Excel (.xlsx, .xls)
- Plain Text (.txt)

**Response:**
```json
{
  "id": "uploaded_doc:0",
  "status": "success",
  "message": "Successfully indexed 10 documents",
  "chunks_created": 45
}
```

**Error Response:**
```json
{
  "id": "",
  "status": "error",
  "message": "File too large. Maximum size: 10MB"
}
```

### 3. Delete Document
```bash
DELETE /api/documents/{doc_id}
```

**Response:**
```json
{
  "status": "success",
  "message": "Successfully deleted document and 15 chunks"
}
```

## Document Processing Pipeline

```
User uploads file
    ↓
Validate format & size
    ↓
Save to ./data/uploads/
    ↓
Load documents (preprocessing.py)
    ↓
Anonymize PII (mask account numbers, phones, emails, etc.)
    ↓
Chunk documents (800 words with 200 overlap)
    ↓
Generate embeddings (all-MiniLM-L6-v2)
    ↓
Store in ChromaDB with metadata
    ↓
Return success response
```

## Testing Instructions

### Prerequisites
1. Backend server running on port 8000
2. ChromaDB accessible
3. Ollama running (for full integration)

### Test 1: Upload a Document

```bash
# Upload the existing QA file
curl -X POST http://localhost:8000/api/documents \
  -F "file=@docs/qa.json" \
  -H "accept: application/json"
```

Expected: Success response with document ID and chunk count

### Test 2: List All Documents

```bash
curl -X GET http://localhost:8000/api/documents \
  -H "accept: application/json"
```

Expected: JSON array of all indexed documents

### Test 3: Query Uploaded Content

```bash
# After upload, test that the chat can find it
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What are the account types?"}'
```

Expected: Response using the newly uploaded document

### Test 4: Delete a Document

```bash
# Get doc_id from list response, then delete
curl -X DELETE http://localhost:8000/api/documents/qa:accounts:0 \
  -H "accept: application/json"
```

Expected: Success message with deletion confirmation

### Test 5: Upload Different Formats

```bash
# Test CSV upload
curl -X POST http://localhost:8000/api/documents \
  -F "file=@test_data.csv"

# Test Excel upload
curl -X POST http://localhost:8000/api/documents \
  -F "file=@docs/NUST Bank-Product-Knowledge.xlsx"
```

## Error Handling

The API handles various error cases:

1. **Unsupported file type**
   ```json
   {"status": "error", "message": "Unsupported file type. Allowed: .json, .csv, .xlsx, .xls, .txt"}
   ```

2. **File too large**
   ```json
   {"status": "error", "message": "File too large. Maximum size: 10MB"}
   ```

3. **Invalid document content**
   ```json
   {"status": "error", "message": "No valid documents found in uploaded file"}
   ```

4. **Document not found** (DELETE)
   ```json
   {"status": "error", "message": "Document qa:invalid:0 not found"}
   ```

## Security Features

1. **File Type Validation**: Only allowed extensions accepted
2. **Size Limits**: Maximum 10MB per file
3. **PII Anonymization**: Automatic masking of:
   - Account numbers
   - Phone numbers
   - Email addresses
   - CNIC/SSN numbers

## Integration with Existing System

The Document Upload API integrates seamlessly with:

- **VectorStore**: Reuses existing ChromaDB infrastructure
- **EmbeddingService**: Uses same embedding model for consistency
- **Preprocessing**: Leverages existing anonymization and chunking
- **Chat Service**: Uploaded documents immediately searchable via RAG

## Configuration

Environment variables in `.env`:

```bash
# Document Upload Configuration (optional - has defaults)
UPLOAD_DIR=./data/uploads        # Where uploaded files are stored
MAX_FILE_SIZE_MB=10              # Maximum file size limit
```

## Code Quality Metrics

✓ All files under 300 lines (largest: 269 lines)
✓ Full type hints on all functions
✓ Proper error handling with meaningful messages
✓ Follows existing code patterns
✓ No hardcoded values (uses configuration)
✓ Comprehensive docstrings
✓ Async where appropriate

## Next Steps

After Phase 5, the system supports:
1. ✅ Real-time document uploads
2. ✅ Instant indexing and availability
3. ✅ Document management (list, delete)
4. ✅ Multiple file format support
5. ✅ Automatic PII anonymization

Ready for Phase 6: Frontend development to provide UI for document uploads.
