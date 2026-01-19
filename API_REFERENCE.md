# API Reference

Complete API documentation for the RAG app backend.

## Base URL

- **Development**: `http://localhost:3000`
- **Production**: `https://your-vercel-domain.vercel.app`

---

## Endpoints

### POST /api/upload

Upload a document to be indexed in the vector database.

#### Request

**Headers**:
```
Content-Type: application/json
```

**Body**:
```json
{
  "text": "Document content here...",
  "title": "My Document Title",
  "source": "optional_source_name"
}
```

**Parameters**:
- `text` (string, required): Document content to index
- `title` (string, required): Document title (used for metadata and citations)
- `source` (string, optional): Source name (defaults to title if not provided)

**Constraints**:
- Max text size: 10 MB
- Max text length: 100,000 characters
- Title must be non-empty

#### Response

**Success (200)**:
```json
{
  "success": true,
  "chunks_created": 12,
  "title": "My Document Title"
}
```

**Fields**:
- `success` (boolean): Operation succeeded
- `chunks_created` (number): How many chunks were created and indexed
- `title` (string): Echoed document title

**Error (400)**:
```json
{
  "error": "text and title required"
}
```

**Error (500)**:
```json
{
  "error": "Failed to connect to embedding service"
}
```

#### Example Usage

```bash
curl -X POST http://localhost:3000/api/upload \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Python is a programming language created in 1991.",
    "title": "Python Guide"
  }'
```

#### Process

1. Split text into chunks (1000 tokens, 15% overlap)
2. Embed each chunk using Nomic
3. Store in Pinecone with metadata
4. Return chunk count

---

### POST /api/query

Query the indexed documents and get an AI-generated answer with citations.

#### Request

**Headers**:
```
Content-Type: application/json
```

**Body**:
```json
{
  "query": "What is the capital of France?"
}
```

**Parameters**:
- `query` (string, required): The question to answer

**Constraints**:
- Query must be non-empty
- Query should be a natural language question

#### Response

**Success (200)**:
```json
{
  "answer": "The capital of France is Paris [1]. It has a population of 2.2 million in the city proper [1].",
  "citations": [
    {
      "id": 1,
      "content": "The capital of France is Paris. It has a population of 2.2 million in the city proper.",
      "metadata": {
        "source": "My Document Title",
        "title": "My Document Title",
        "section": "main",
        "position": 0,
        "chunk_index": 0
      },
      "score": 0.8234
    }
  ],
  "timing": {
    "retrieval_ms": 85,
    "reranking_ms": 650,
    "llm_ms": 1200
  },
  "tokens": {
    "input": 256,
    "output": 128
  }
}
```

**Fields**:
- `answer` (string): The generated answer with inline citations [1], [2], etc.
- `citations` (array): List of source chunks used in the answer
  - `id` (number): Citation number (e.g., 1 for [1])
  - `content` (string): Full chunk text
  - `metadata` (object): Source information
    - `source` (string): Document source name
    - `title` (string): Document title
    - `section` (string): Section within document
    - `position` (number): Character position in original text
    - `chunk_index` (number): Chunk sequence number
  - `score` (number): Reranker relevance score (0-1)
- `timing` (object): Latency breakdown
  - `retrieval_ms` (number): Vector DB retrieval time
  - `reranking_ms` (number): Cohere reranker time
  - `llm_ms` (number): LLM generation time
- `tokens` (object): Token usage
  - `input` (number): Tokens in LLM input
  - `output` (number): Tokens in LLM output

**No Results (200)** - Graceful fallback when no relevant chunks found:
```json
{
  "answer": "I could not find relevant information to answer your question.",
  "citations": [],
  "timing": {
    "retrieval_ms": 92,
    "reranking_ms": 0,
    "llm_ms": 0
  },
  "tokens": {
    "input": 0,
    "output": 0
  }
}
```

**Error (400)**:
```json
{
  "error": "query required"
}
```

**Error (500)**:
```json
{
  "error": "Failed to connect to Groq API"
}
```

#### Example Usage

```bash
curl -X POST http://localhost:3000/api/query \
  -H "Content-Type: application/json" \
  -d '{"query": "What is the capital of France?"}'
```

#### Process

1. Embed query using Nomic
2. Retrieve top-10 similar chunks from Pinecone
3. Rerank top-10 to get top-5 using Cohere
4. Generate answer using Groq LLM with context
5. Extract citations from answer
6. Return complete response with timing metrics

---

## Error Codes

| Code | Meaning | Possible Cause |
|------|---------|-----------------|
| 400 | Bad Request | Missing required parameter |
| 405 | Method Not Allowed | Wrong HTTP method (use POST) |
| 429 | Too Many Requests | Rate limit exceeded (try later) |
| 500 | Server Error | API service connection failed |
| 503 | Service Unavailable | External service (Pinecone, Groq, etc.) down |

---

## Rate Limits

**Free Tier Limits**:
- Groq: ~150 requests/min
- Cohere: ~100 requests/min
- Pinecone: 1M vectors free tier
- Nomic: Unlimited

**Behavior**: If limit exceeded, returns HTTP 429

**Recommendation**: Implement client-side queue and retry with exponential backoff

---

## Latency Expectations

**Typical Response Times**:
- Upload (per 10KB): 1-5 seconds
- Query (end-to-end): 1.5-3.5 seconds

**Breakdown**:
- Embedding: 100-300ms
- Retrieval: 50-150ms
- Reranking: 500-1000ms
- LLM: 1000-2000ms

**Cold Starts** (Vercel free tier): +2-5 seconds first request after idle

---

## Authentication

No authentication required for free tier.

For production with user management:
- Add API keys or JWT tokens
- Implement rate limiting per user
- Add authentication middleware

---

## CORS

Handled automatically by Next.js.

For custom domains or specific origins, configure in `next.config.js`:
```javascript
async headers() {
  return [
    {
      source: '/api/:path*',
      headers: [
        { key: 'Access-Control-Allow-Origin', value: '*' },
      ],
    },
  ];
}
```

---

## Request/Response Examples

### Example 1: Upload Document

**Request**:
```bash
curl -X POST http://localhost:3000/api/upload \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Machine learning is a subset of artificial intelligence. Deep learning uses neural networks. Both require large datasets.",
    "title": "AI Basics"
  }'
```

**Response**:
```json
{
  "success": true,
  "chunks_created": 2,
  "title": "AI Basics"
}
```

### Example 2: Query After Upload

**Request**:
```bash
curl -X POST http://localhost:3000/api/query \
  -H "Content-Type: application/json" \
  -d '{
    "query": "What is the relationship between machine learning and deep learning?"
  }'
```

**Response**:
```json
{
  "answer": "Deep learning is a subset of machine learning [1] that uses artificial neural networks [1]. Both machine learning and deep learning require large datasets to function effectively [1].",
  "citations": [
    {
      "id": 1,
      "content": "Machine learning is a subset of artificial intelligence. Deep learning uses neural networks. Both require large datasets.",
      "metadata": {
        "source": "AI Basics",
        "title": "AI Basics",
        "section": "main",
        "position": 0,
        "chunk_index": 0
      },
      "score": 0.9123
    }
  ],
  "timing": {
    "retrieval_ms": 78,
    "reranking_ms": 642,
    "llm_ms": 1456
  },
  "tokens": {
    "input": 198,
    "output": 52
  }
}
```

### Example 3: Out-of-Scope Query

**Request**:
```bash
curl -X POST http://localhost:3000/api/query \
  -H "Content-Type: application/json" \
  -d '{
    "query": "What year was JavaScript created?"
  }'
```

**Response** (if not in any document):
```json
{
  "answer": "I could not find relevant information to answer your question.",
  "citations": [],
  "timing": {
    "retrieval_ms": 89,
    "reranking_ms": 0,
    "llm_ms": 0
  },
  "tokens": {
    "input": 0,
    "output": 0
  }
}
```

---

## Integration Guide

### Python Client

```python
import requests
import json

BASE_URL = "http://localhost:3000"

def upload_document(text: str, title: str):
    response = requests.post(
        f"{BASE_URL}/api/upload",
        json={"text": text, "title": title}
    )
    return response.json()

def query(question: str):
    response = requests.post(
        f"{BASE_URL}/api/query",
        json={"query": question}
    )
    return response.json()

# Usage
upload_document("Python was created in 1991.", "Python Guide")
result = query("When was Python created?")
print(result["answer"])
```

### JavaScript/Node.js Client

```javascript
const BASE_URL = 'http://localhost:3000';

async function uploadDocument(text, title) {
  const response = await fetch(`${BASE_URL}/api/upload`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, title })
  });
  return response.json();
}

async function query(question) {
  const response = await fetch(`${BASE_URL}/api/query`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: question })
  });
  return response.json();
}

// Usage
await uploadDocument('Python was created in 1991.', 'Python Guide');
const result = await query('When was Python created?');
console.log(result.answer);
```

---

## Troubleshooting

### "Connection refused"
- Check backend is running (`npm run dev`)
- Check port 3000 is not in use

### "API key error"
- Verify `.env.local` has correct keys
- Check keys in Vercel environment settings (production)

### "Rate limit exceeded"
- Wait 1 minute before retrying
- Implement exponential backoff
- Consider upgrading service tiers

### "Chunks not found"
- Upload a document first
- Verify upload succeeded (check response)
- Try query after 30 seconds (ensure indexing complete)

---

## Changelog

- **v1.0.0** (Jan 2026): Initial release
  - Upload API
  - Query API with citations
  - Full integration with Pinecone, Cohere, Groq, Nomic
