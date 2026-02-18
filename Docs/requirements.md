# LLM Bank Customer Service Assistant - Requirements

## Project Overview

Design an LLM-based solution to enhance customer service for a local bank. The system converts anonymized customer interaction documents into a responsive AI-driven assistant capable of:

- Accurately handling customer inquiries
- Generating coherent, context-aware responses
- Maintaining high standards of data privacy and trust

---

## Functional Requirements

### FR-1: Data Ingestion & Preprocessing

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-1.1 | Read documents from the bank dataset (JSON, CSV, plain text) | High |
| FR-1.2 | Sanitize all ingested documents | High |
| FR-1.3 | Implement anonymization for PII if not already performed | High |
| FR-1.4 | Handle tokenization, lowercasing, text-cleaning for LLM workflows | High |
| FR-1.5 | Build reusable, clean data pipeline | Medium |

**Grading (2 marks):**
- Excellent: Full anonymization + clean, reusable pipeline
- Satisfactory: Minor issues with cleaning/anonymization
- Poor: Unsafe/inconsistent handling of PII

---

### FR-2: LLM Selection

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-2.1 | Use open-source model only (Llama, T5, DeepSeek, or similar transformer) | High |
| FR-2.2 | Model must be ≤6 billion parameters | High |
| FR-2.3 | Commercial models (ChatGPT, etc.) are **prohibited** | High |
| FR-2.4 | Model must support fine-tuning or prompt engineering integration | High |
| FR-2.5 | Document justification for model selection | Medium |

---

### FR-3: Embedding & Indexing

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-3.1 | Create embedding-based vector index | High |
| FR-3.2 | Store vector embeddings for each document/chunk | High |
| FR-3.3 | Enable swift retrieval of relevant content | High |
| FR-3.4 | Support diverse query types with high relevance | High |

**Grading (3 marks):**
- Excellent: Highly relevant retrieval across diverse queries; well-tuned search
- Good: Mostly relevant with occasional mismatches
- Satisfactory: Mixed relevance; noisy retrieval
- Poor: Retrieval rarely returns useful information

---

### FR-4: Model Fine-Tuning & Inference

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-4.1 | Fine-tune chosen LLM on bank data for domain-specific understanding | High |
| FR-4.2 | Retrieve relevant document segments via embedding index for queries | High |
| FR-4.3 | Generate/synthesize answers from retrieved context | High |

---

### FR-5: Prompt Engineering

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-5.1 | Simulate helpful, caring customer service interactions | High |
| FR-5.2 | Provide domain-specific answers | High |
| FR-5.3 | Gracefully handle out-of-domain questions | High |
| FR-5.4 | Clear refusals for unsupported queries | Medium |

**Grading (2 marks):**
- Excellent: Stable, safe, domain-correct responses; clear refusals for unsupported queries
- Satisfactory: Reasonable responses with some hallucinations or weak out-of-domain handling
- Poor: Frequent unsafe, irrelevant, or confusing answers

---

### FR-6: Real-Time Updates

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-6.1 | Allow seamless addition of new documents (FAQs, policies) | High |
| FR-6.2 | Index new documents instantly | High |
| FR-6.3 | New information immediately available for queries | High |
| FR-6.4 | Support document upload following dataset format | High |
| FR-6.5 | Optional: UI for adding new data/articles/documents | Medium |

**Grading (2 marks):**
- Excellent: New documents ingested and searchable with minimal manual effort
- Satisfactory: Updates possible but require several manual steps
- Poor: No functioning mechanism for updating knowledge

---

### FR-7: System Interface (UI/UX)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-7.1 | Develop clear, welcoming user interface | High |
| FR-7.2 | Allow customers to submit questions | High |
| FR-7.3 | Display responses clearly | High |
| FR-7.4 | Support document upload functionality | High |
| FR-7.5 | Simple but reassuring design | Medium |

**Grading (1 mark):**
- Excellent: Intuitive, clean UI supporting complete workflow
- Poor: Confusing, incomplete, or missing interface

---

### FR-8: Guard Rails & Safety

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-8.1 | Implement content filtering | High |
| FR-8.2 | Enforce policies preventing sensitive/disallowed information sharing | High |
| FR-8.3 | Manage harmful or off-topic requests (refuse/redirect) | High |
| FR-8.4 | Detect and mitigate jailbreaking attempts | High |
| FR-8.5 | Detect and mitigate prompt injection attacks | High |
| FR-8.6 | Prevent bypass of restrictions | High |
| FR-8.7 | Prevent confidential data exposure | High |

**Grading (3 marks):**
- Excellent: Strong guard rails; effective defense against adversarial prompts; minimal unsafe content
- Good: Mostly effective; a few bypasses
- Satisfactory: Basic checks only; several unsafe cases slip through
- Poor: System easily jailbroken or leaks sensitive information

---

## Non-Functional Requirements

### NFR-1: Performance & Reliability

| ID | Requirement | Priority |
|----|-------------|----------|
| NFR-1.1 | Minimal lag for multi-word/complex queries | High |
| NFR-1.2 | Smooth customer experience | High |
| NFR-1.3 | Scale effectively to large datasets | High |
| NFR-1.4 | Maintain service quality under load | High |

**Grading (2 marks):**
- Excellent: Clear, accurate, context-aware responses with low latency
- Satisfactory: Generally understandable responses; noticeable but acceptable delay
- Poor: Slow and/or frequently incorrect/confusing responses

---

### NFR-2: Code Quality & Documentation

| ID | Requirement | Priority |
|----|-------------|----------|
| NFR-2.1 | Clean, modular code structure | High |
| NFR-2.2 | Readable, well-commented code | High |
| NFR-2.3 | Comprehensive documentation | High |
| NFR-2.4 | Clear README with setup instructions | High |

**Grading (2 marks):**
- Excellent: Clean, modular, well-documented code with clear README/setup instructions
- Satisfactory: Code works but limited structure/documentation
- Poor: Hard-to-follow code with minimal/no documentation

---

### NFR-3: Git Collaboration

| ID | Requirement | Priority |
|----|-------------|----------|
| NFR-3.1 | Regular commits throughout development (not bulk upload) | High |
| NFR-3.2 | All group members must make commits | High |
| NFR-3.3 | Meaningful commit messages | High |
| NFR-3.4 | Use branches and merges appropriately | Medium |
| NFR-3.5 | Private repository on GitHub/Bitbucket | Low |

**Grading (3 marks):**
- Excellent: Regular commits from multiple members, meaningful messages, branches/merges used
- Good: Consistent commits with minor issues in messages/branching
- Satisfactory: Some commits but limited history or weak commit hygiene
- Poor: Single bulk upload or no real collaboration evidence

---

## Constraints

| ID | Constraint |
|----|------------|
| C-1 | Model size ≤6 billion parameters |
| C-2 | No commercial LLMs (ChatGPT, Claude, etc.) |
| C-3 | Must handle JSON, CSV, plain text formats |
| C-4 | Must maintain data privacy and trust |

---

## Dataset

- **Source:** Available on LMS
- **Format:** JSON, CSV, or plain text
- **Content:** Anonymized customer interaction documents from a fictional bank
- **Local files:** `Docs/qa.json`, `Docs/NUST Bank-Product-Knowledge.xlsx`

---

## Grading Summary

| Criterion | Marks | CLO |
|-----------|-------|-----|
| Data Preprocessing | 2 | CLO-5 |
| Vector Embeddings & Retrieval | 3 | CLO-5 |
| Prompt Engineering | 2 | CLO-3 |
| Guard Rails & Safety | 3 | CLO-3 |
| Response Quality & Latency | 2 | CLO-3 |
| Real-Time Updates | 2 | CLO-5 |
| Code Quality & Documentation | 2 | CLO-6 |
| System Interface (UI/UX) | 1 | CLO-6 |
| Use of Git for Collaboration | 3 | CLO-6 |
| **Total** | **20** | |

---

## Recommended Open-Source Models (≤6B parameters)

| Model | Parameters | Notes |
|-------|------------|-------|
| Llama 3.2 | 1B, 3B | Meta's latest efficient models |
| Phi-3 Mini | 3.8B | Microsoft's compact model |
| Mistral 7B | 7B | Near limit, highly capable |
| DeepSeek-LLM | 1.3B, 6.7B | Chinese open-source |
| Qwen 2.5 | 0.5B-7B | Alibaba's multilingual |
| T5-base/large | 220M-770M | Google's encoder-decoder |
| FLAN-T5 | Various | Instruction-tuned T5 |
