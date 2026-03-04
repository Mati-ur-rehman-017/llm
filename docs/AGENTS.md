# AGENTS.md - AI Agent Guidelines for NUST Bank Assistant

## Project Context

This is an LLM-based customer service assistant for NUST Bank. The system uses RAG (Retrieval-Augmented Generation) with Phi-3 Mini 3.8B, zvec vector database, and strict safety guardrails.

**Key Documents:**
- `Docs/requirements.md` - Project requirements and grading criteria
- `Docs/system_design.md` - Architecture, components, and implementation plan

---

## Critical Constraints

### Model Restrictions
- **ONLY open-source models allowed** (no ChatGPT, Claude, etc. in the final product)
- **Model size ≤6B parameters** (Phi-3 Mini 3.8B is selected)
- Commercial API calls are prohibited for inference

### Code Standards
- Files must stay **under 300 lines** - refactor immediately if exceeded
- **No hardcoded values** - use environment variables or config
- **No silent defaults** - fail loudly on missing configuration
- **No backward compatibility shims** - assume clean state

### Safety Requirements
- All user inputs must pass through guard rails before processing
- PII must be anonymized in data pipeline and filtered in outputs
- Jailbreak/prompt injection detection is mandatory
- Out-of-domain queries must be gracefully rejected

---

## Technology Stack (Do Not Change)

| Component | Technology | Notes |
|-----------|------------|-------|
| Backend | Python + FastAPI | Async required |
| Frontend | React + Vite + TypeScript | No other frameworks |
| Vector DB | zvec (Alibaba) | `pip install zvec` |
| LLM | Phi-3 Mini 3.8B | Via Ollama |
| Inference | Ollama | Local deployment |
| Embeddings | all-MiniLM-L6-v2 | 384 dimensions |
| Fine-tuning | LoRA (peft) | Optional enhancement |

---

## Directory Structure Rules

```
llm/
├── backend/app/          # All backend code here
│   ├── api/routes/       # FastAPI route handlers
│   ├── core/             # Guard rails, prompts, exceptions
│   ├── services/         # Business logic (chat, embedding, llm, retrieval)
│   ├── models/           # Pydantic schemas
│   └── data/             # Vector store, preprocessing
├── frontend/src/         # All frontend code here
│   ├── components/       # React components
│   ├── hooks/            # Custom hooks
│   ├── services/         # API client
│   └── types/            # TypeScript types
├── Docs/                 # Documentation only
└── data/                 # Runtime data (zvec store, uploads)
```

**Rules:**
- Do not create files outside this structure
- Do not add new top-level directories without explicit approval
- Keep related code together (no scattered utilities)

---

## Implementation Priority

Work on phases in order. Do not skip ahead.

### Phase 1: Foundation ⬅️ START HERE
1. Create `backend/app/config.py` - environment configuration
2. Create `backend/app/main.py` - FastAPI app entry
3. Create `backend/app/api/routes/health.py` - health endpoint
4. Create `docker-compose.yml` - service orchestration
5. Create `.env.example` - environment template

### Phase 2: Data Pipeline
6. Create `backend/app/data/preprocessing.py` - data ingestion
7. Create `backend/app/data/vectorstore.py` - zvec wrapper
8. Create `backend/app/services/embedding.py` - embedding service
9. Create `backend/scripts/ingest_data.py` - initial data load

### Phase 3: RAG System
10. Create `backend/app/services/llm.py` - Ollama client
11. Create `backend/app/services/retrieval.py` - RAG retrieval
12. Create `backend/app/core/prompts.py` - prompt templates
13. Create `backend/app/services/chat.py` - chat orchestration
14. Create `backend/app/api/routes/chat.py` - chat endpoints

### Phase 4: Guard Rails
15. Create `backend/app/core/guardrails.py` - safety layer
16. Create `backend/app/core/exceptions.py` - custom exceptions
17. Integrate guard rails into chat flow

### Phase 5: Document Management
18. Create `backend/app/services/document.py` - document processing
19. Create `backend/app/api/routes/documents.py` - document endpoints

### Phase 6: Frontend
20. Initialize Vite + React project
21. Create chat components
22. Create document upload components
23. Implement API client

### Phase 7: Fine-Tuning (Optional)
24. Create `backend/scripts/fine_tune.py` - LoRA training

### Phase 8: Testing
25. Add unit tests for services
26. Add integration tests for API
27. Add guard rails test suite

---

## Code Patterns

### Configuration Pattern
```python
# backend/app/config.py
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    ollama_base_url: str
    ollama_model: str
    zvec_path: str
    embedding_model: str
    
    class Config:
        env_file = ".env"

settings = Settings()  # Fails if env vars missing
```

### Service Pattern
```python
# All services follow this pattern
class SomeService:
    def __init__(self, dependency: OtherService):
        self.dependency = dependency  # Inject dependencies
    
    async def do_something(self, input: Input) -> Output:
        # Validate input
        # Process
        # Return typed output
        pass
```

### API Route Pattern
```python
# backend/app/api/routes/example.py
from fastapi import APIRouter, Depends, HTTPException
from app.models.schemas import RequestModel, ResponseModel
from app.services.example import ExampleService
from app.api.deps import get_example_service

router = APIRouter(prefix="/example", tags=["example"])

@router.post("/", response_model=ResponseModel)
async def endpoint(
    request: RequestModel,
    service: ExampleService = Depends(get_example_service)
) -> ResponseModel:
    result = await service.process(request)
    return ResponseModel(data=result)
```

### Guard Rails Integration
```python
# Always validate before processing
from app.core.guardrails import GuardRails

guard = GuardRails()

async def chat(message: str) -> str:
    validation = guard.validate_input(message)
    if not validation.is_valid:
        raise HTTPException(400, validation.reason)
    
    # ... process ...
    
    response = await generate_response(message)
    return guard.filter_pii(response)
```

---

## zvec Usage

```python
import zvec

# Schema definition
schema = zvec.CollectionSchema(
    name="bank_documents",
    vectors=zvec.VectorSchema("embedding", zvec.DataType.VECTOR_FP32, 384),
)

# Create/open collection
collection = zvec.create_and_open(path="./data/zvec_store", schema=schema)

# Insert
collection.insert([
    zvec.Doc(id="doc_1", vectors={"embedding": [0.1, ...]}),
])

# Query
results = collection.query(
    zvec.VectorQuery("embedding", vector=[0.1, ...]),
    topk=5
)
```

---

## Environment Variables

Required variables (must be set, no defaults):

```bash
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=phi3:mini
ZVEC_PATH=./data/zvec_store
EMBEDDING_MODEL=all-MiniLM-L6-v2
API_HOST=0.0.0.0
API_PORT=8000
```

---

## Testing Commands

```bash
# Backend
cd backend && pytest tests/ -v

# Frontend
cd frontend && npm test

# Type checking
cd backend && mypy app/
cd frontend && npm run lint

# Run locally
docker-compose up --build
```

---

## Common Mistakes to Avoid

1. **Using hardcoded URLs/paths** - Always use `settings.some_value`
2. **Skipping input validation** - Every user input goes through `GuardRails`
3. **Creating files >300 lines** - Split into modules
4. **Adding print statements** - Use proper logging
5. **Catching generic exceptions** - Be specific, fail loudly
6. **Skipping type hints** - All functions must be typed
7. **Using sync in async context** - Use `async/await` properly
8. **Committing .env files** - Only `.env.example` goes in git
9. **Using commercial LLM APIs** - Prohibited by requirements
10. **Ignoring the implementation order** - Follow phases sequentially

---

## Git Workflow

- Commit frequently with meaningful messages
- Use branches for features: `feature/phase-1-foundation`
- All team members must have commits
- Never bulk upload - incremental commits required
- Format: `type(scope): description`
  - `feat(backend): add health check endpoint`
  - `fix(guardrails): improve jailbreak detection`
  - `docs(readme): add setup instructions`

---

## When Stuck

1. Check `Docs/system_design.md` for architecture details
2. Check `Docs/requirements.md` for project requirements
3. Review the component specifications in system_design.md
4. Look at the code patterns section above
5. Ask for clarification rather than guessing

---

## Verification Checklist

Before marking any phase complete:

- [ ] All files under 300 lines
- [ ] No hardcoded values
- [ ] Type hints on all functions
- [ ] Guard rails integrated where needed
- [ ] Tests passing
- [ ] No linter errors
- [ ] Code committed with meaningful message
