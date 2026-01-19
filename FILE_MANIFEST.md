# Project File Manifest

Complete list of all files in the RAG app project with descriptions.

---

## Configuration Files (9 files)

| File | Purpose |
|------|---------|
| `.env.example` | Environment template (copy to `.env.local`) |
| `.gitignore` | Git ignore rules |
| `package.json` | Dependencies and scripts |
| `tsconfig.json` | TypeScript configuration |
| `tsconfig.node.json` | TypeScript Node configuration |
| `next.config.js` | Next.js build configuration |
| `tailwind.config.ts` | Tailwind CSS configuration |
| `postcss.config.js` | PostCSS configuration |
| `vercel.json` | Vercel deployment configuration |

---

## Backend Library Files (6 files in `lib/`)

| File | Purpose | Key Functions |
|------|---------|----------------|
| `types.ts` | TypeScript interfaces | DocumentMetadata, TextChunk, RAGAnswer |
| `config.ts` | Centralized configuration | All system parameters, validation |
| `chunking.ts` | Text chunking + embedding | chunkText(), embedText() |
| `vectordb.ts` | Pinecone integration | getIndex(), upsertChunks(), retrieveChunks() |
| `reranker.ts` | Cohere reranking | rerankerChunks() |
| `llm.ts` | Groq LLM + citations | generateAnswerWithCitations() |

---

## API Routes (2 files in `pages/api/`)

| File | Endpoint | Purpose |
|------|----------|---------|
| `upload.ts` | `POST /api/upload` | Upload and index documents |
| `query.ts` | `POST /api/query` | Query and retrieve answers |

---

## Frontend Components (2 files in `components/`)

| File | Component | Purpose |
|------|-----------|---------|
| `DocumentUpload.tsx` | DocumentUpload | Upload UI (paste/file) |
| `QueryInterface.tsx` | QueryInterface | Query UI + answer display |

---

## Pages (2 files in `pages/`)

| File | Route | Purpose |
|------|-------|---------|
| `_app.tsx` | App wrapper | Global styles and setup |
| `index.tsx` | `/` | Main landing page |

---

## Styling (1 file in `styles/`)

| File | Purpose |
|------|---------|
| `globals.css` | Tailwind CSS + global styles |

---

## Documentation (8 files)

| File | Purpose | Read Time |
|------|---------|-----------|
| `README.md` | Main documentation | 20 min |
| `QUICKSTART.md` | Quick local setup | 10 min |
| `DEPLOYMENT.md` | Production deployment | 15 min |
| `API_REFERENCE.md` | Complete API docs | 15 min |
| `TESTING_CHECKLIST.md` | QA validation checklist | 30 min |
| `IMPLEMENTATION_SUMMARY.md` | Complete project overview | 25 min |
| `DOCS_INDEX.md` | Documentation navigation | 5 min |
| `PROJECT_COMPLETION_SUMMARY.md` | Build completion summary | 10 min |

---

## Evaluation (1 file in `evaluation/`)

| File | Purpose |
|------|---------|
| `evaluation/README.md` | 5 gold standard QA pairs |

---

## Summary

```
Total Files: 29

Structure:
├── Configuration (9 files)
├── Backend Library (6 files)
├── API Routes (2 files)
├── Frontend Components (2 files)
├── Pages (2 files)
├── Styling (1 file)
├── Documentation (8 files)
├── Evaluation (1 file)
└── This manifest (this file)
```

---

## File Sizes (Approximate)

| Category | Total |
|----------|-------|
| Configuration | ~50 KB |
| Backend Code | ~15 KB |
| Frontend Code | ~12 KB |
| Documentation | ~120 KB |
| Total | ~200 KB |

---

## Lines of Code (Approximate)

| Category | Lines |
|----------|-------|
| Backend (lib/) | ~600 |
| API Routes | ~200 |
| Frontend | ~400 |
| Configuration | ~200 |
| **Total** | ~1,400 |

---

## Key Files to Know

### Must Read
- **[README.md](README.md)** - Start here
- **[QUICKSTART.md](QUICKSTART.md)** - Local setup
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Production

### Must Configure
- **[.env.example](.env.example)** - Copy to `.env.local`
- **[lib/config.ts](lib/config.ts)** - All tuneable parameters

### Must Test
- **[evaluation/README.md](evaluation/README.md)** - Test cases
- **[TESTING_CHECKLIST.md](TESTING_CHECKLIST.md)** - QA validation

### Useful References
- **[API_REFERENCE.md](API_REFERENCE.md)** - API integration
- **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)** - Architecture
- **[DOCS_INDEX.md](DOCS_INDEX.md)** - Docs navigation

---

## What Each File Does

### Entry Points
- `pages/index.tsx` - Main React page
- `pages/_app.tsx` - App wrapper
- `pages/api/upload.ts` - Upload API
- `pages/api/query.ts` - Query API

### Core Business Logic
- `lib/chunking.ts` - Text → chunks
- `lib/vectordb.ts` - Chunks → vectors → DB
- `lib/reranker.ts` - Rank chunks
- `lib/llm.ts` - Generate answer + citations

### Frontend UI
- `components/DocumentUpload.tsx` - Upload form
- `components/QueryInterface.tsx` - Query + results

### Configuration
- `lib/config.ts` - All parameters
- `lib/types.ts` - TypeScript types

---

## Dependencies

All in `package.json`:

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "next": "^14.0.0",
    "@pinecone-database/pinecone": "^3.0.0",
    "axios": "^1.6.0",
    "uuid": "^9.0.1"
  },
  "devDependencies": {
    "typescript": "^5.3.3",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@types/node": "^20.10.0",
    "@types/uuid": "^9.0.7",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.32",
    "autoprefixer": "^10.4.16"
  }
}
```

---

## Environment Variables

Required (in `.env.local` for dev, Vercel settings for prod):

```
PINECONE_API_KEY=...
PINECONE_INDEX_NAME=rag-index
PINECONE_ENVIRONMENT=us-east-1
GROQ_API_KEY=...
COHERE_API_KEY=...
NOMIC_API_KEY=...
NEXT_PUBLIC_API_URL=http://localhost:3000  # (dev only)
```

---

## Development Workflow

1. Edit files in VS Code
2. Changes auto-reload (dev server)
3. Check browser console (F12)
4. View network requests (F12 → Network)
5. Test API directly (curl or Postman)

---

## Deployment Workflow

1. Edit files locally
2. Test with `npm run build` locally
3. Push to GitHub
4. Vercel auto-deploys
5. Add env vars in Vercel dashboard
6. Verify production URL works

---

## File Organization Philosophy

```
Configuration → Dependencies & Settings
                ↓
Library Code → Reusable business logic
                ↓
API Routes → HTTP endpoints
                ↓
Frontend Components → React UI
                ↓
Pages → Entry points
                ↓
Styles → Global CSS
                ↓
Documentation → Human-readable guides
```

---

## Backup & Version Control

Always:
```bash
git add .
git commit -m "Description"
git push origin main
```

Never commit:
- `.env.local` ✗
- `node_modules/` ✗
- `.next/` ✗
- `out/` ✗

---

## Quick File Reference

| I need to... | Edit file |
|-------------|-----------|
| Change UI styling | `styles/globals.css` |
| Add new API route | `pages/api/new-route.ts` |
| Add new React component | `components/NewComponent.tsx` |
| Tune retrieval params | `lib/config.ts` |
| Change chunking size | `lib/config.ts` |
| Update embedding model | `lib/chunking.ts` + `lib/config.ts` |
| Change LLM model | `lib/llm.ts` + `lib/config.ts` |
| Modify Pinecone settings | `lib/vectordb.ts` + `lib/config.ts` |
| Deploy to Vercel | [DEPLOYMENT.md](DEPLOYMENT.md) |
| Set up locally | [QUICKSTART.md](QUICKSTART.md) |
| Test system | [TESTING_CHECKLIST.md](TESTING_CHECKLIST.md) |

---

## File Naming Conventions

- **Components**: PascalCase (e.g., `DocumentUpload.tsx`)
- **Pages**: lowercase (e.g., `index.tsx`, `api.tsx`)
- **Utils**: camelCase (e.g., `chunking.ts`)
- **Types**: `types.ts` centralized
- **Config**: `config.ts` centralized
- **Docs**: UPPERCASE (e.g., `README.md`, `QUICKSTART.md`)

---

**Total**: 29 files = Full production-ready RAG application

**Status**: ✅ Complete and ready to deploy

**Last Updated**: January 19, 2026
