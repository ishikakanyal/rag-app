# 🚀 Get Started in 30 Minutes


Copy-paste quick start guide.

---

## ⏱️ Timeline

- **5 min**: Get API keys
- **5 min**: Local setup
- **5 min**: First test
- **10 min**: Deploy
- **5 min**: Verify production
- **Total**: 30 minutes

---

## STEP 1: GET API KEYS (5 min)

### 1.1 Pinecone (Vector DB)
```
Go to: https://pinecone.io
Click: Sign Up → Create new account
Go to Console → Create Project
Project Settings: us-east-1 (or closest region)
Click: Indexes → Create Index
  Name: rag-index
  Dimension: 768
  Metric: cosine
Click: Create
Copy: API Key (from API Keys section)
Save: PINECONE_API_KEY
```

### 1.2 Groq (LLM)
```
Go to: https://console.groq.com
Click: Sign Up
Create Account
Go to: API Keys
Copy: API Key
Save: GROQ_API_KEY
```

### 1.3 Cohere (Reranker)
```
Go to: https://cohere.com
Click: Sign Up
Create Account
Go to: Dashboard → API Keys
Copy: API Key
Save: COHERE_API_KEY
```

### 1.4 Nomic (Embeddings)
```
Go to: https://www.nomic.ai
Click: Sign Up (or use Google)
Create Account
Go to: Account → API Keys
Copy: API Key
Save: NOMIC_API_KEY
```

---

## STEP 2: LOCAL SETUP (5 min)

⚠️ **Use Command Prompt (cmd), not PowerShell** - PowerShell may block npm scripts on Windows.

### 2.1 Navigate to Project
```cmd
cd d:\predusk\rag-app
```

### 2.2 Install Dependencies
```cmd
npm install
```

### 2.3 Create Environment File
```cmd
copy .env.example .env.local
```

### 2.4 Edit Environment File
Open `.env.local` in VS Code and replace:
```
PINECONE_API_KEY=your_pinecone_key_here
PINECONE_INDEX_NAME=rag-index
PINECONE_ENVIRONMENT=us-east-1
GROQ_API_KEY=your_groq_key_here
COHERE_API_KEY=your_cohere_key_here
NOMIC_API_KEY=your_nomic_key_here
NEXT_PUBLIC_API_URL=http://localhost:3000
```

Save the file (Ctrl+S).

### 2.5 Start Dev Server
```cmd
npm run dev
```

Expected output:
```
> next dev
  ▲ Next.js 14.0.0
  - Local:        http://localhost:3000
  Ready in 2.3s
```

---

## STEP 3: FIRST TEST (5 min)

### 3.1 Open Browser
```
http://localhost:3000
```

You should see:
- Dark background
- "RAG Knowledge Base" title
- "Upload Document" panel on left
- "Ask a Question" panel on right

### 3.2 Upload Test Document

1. In "Upload Document" section:
   - **Title**: `Python Basics`
   - **Text Content**: Paste this:
   ```
   Python is a high-level programming language created by Guido van Rossum in 1991.
   It emphasizes code readability and simplicity. Python supports multiple programming 
   paradigms including object-oriented, imperative, and functional styles. Python runs 
   on Windows, macOS, Linux, and other Unix-like platforms. It has become popular for 
   web development, data science, artificial intelligence, and automation.
   ```

2. Click: **Upload & Index**

3. Wait for: "Successfully processed: 1 chunks created"

### 3.3 Query

1. In "Ask a Question" section:
   - **Query**: `When was Python created?`

2. Click: **Search**

3. Wait ~2 seconds

4. You should see:
   - **Answer**: Text mentioning "1991" with [1] citation
   - **Sources**: Panel showing the source chunk
   - **Metrics**: Retrieval/reranking/LLM times in ms
   - **Tokens**: Input/output token counts

✅ **If this works, your local setup is complete!**

---

## STEP 4: DEPLOY TO VERCEL (10 min)

### 4.1 Initialize Git
```powershell
git init
git add .
git commit -m "Initial RAG app"
```

### 4.2 Create GitHub Repository
1. Go to: https://github.com/new
2. Create new **public** repo: `rag-app`
3. Copy commands (don't initialize with README)

### 4.3 Push to GitHub
```powershell
git remote add origin https://github.com/YOUR_USERNAME/rag-app.git
git branch -M main
git push -u origin main
```

### 4.4 Deploy on Vercel
1. Go to: https://vercel.com
2. Click: **New Project**
3. Click: **Continue with GitHub**
4. Authorize Vercel
5. Find and select: `rag-app`
6. Click: **Import**
7. Wait: 2-3 minutes for build

### 4.5 Add Environment Variables
1. In Vercel dashboard (after build completes)
2. Go to: **Settings** → **Environment Variables**
3. Add these variables:

| Key | Value |
|-----|-------|
| `PINECONE_API_KEY` | [Your key] |
| `PINECONE_INDEX_NAME` | `rag-index` |
| `PINECONE_ENVIRONMENT` | `us-east-1` |
| `GROQ_API_KEY` | [Your key] |
| `COHERE_API_KEY` | [Your key] |
| `NOMIC_API_KEY` | [Your key] |

4. Click: **Save**
5. Go to **Deployments** → Find latest → **Redeploy**

### 4.6 Get Production URL
1. Wait for redeploy to complete (2-3 min)
2. Copy: Production URL (looks like `https://rag-app-xxxxx.vercel.app`)

---

## STEP 5: VERIFY PRODUCTION (5 min)

### 5.1 Open Production URL
```
https://your-vercel-url-here.vercel.app
```

### 5.2 Test Upload
1. Upload same test document as before
2. Verify: "Successfully processed" message

### 5.3 Test Query
1. Ask: "When was Python created?"
2. Verify: Answer shows "1991" with [1] citation

### 5.4 Check for Errors
1. Press F12 (DevTools)
2. Click: **Console** tab
3. Look for: Any red errors
4. Should see: Nothing or only info messages

✅ **If no errors, you're live!**

---

## SUCCESS! 🎉

You now have:
- ✅ Working local development environment
- ✅ Production deployment on Vercel
- ✅ Full RAG system (chunking → embedding → retrieval → reranking → LLM → citations)
- ✅ Zero cost ($0/month)

---

## NEXT (OPTIONAL)

### Run Evaluation
See [evaluation/README.md](evaluation/README.md) for 5 test cases.

### Customize
- Edit colors in `pages/index.tsx`
- Change chunking size in `lib/config.ts`
- Try different LLM in `lib/llm.ts`

### Monitor
- Pinecone: https://console.pinecone.io → Metrics
- Groq: https://console.groq.com → Activity
- Vercel: https://vercel.com → Deployments

---

## TROUBLESHOOTING

| Issue | Solution |
|-------|----------|
| `npm install` fails | Update Node.js to v18+ |
| Port 3000 in use | Kill process or use `npm run dev -- -p 3001` |
| "API key error" | Check `.env.local` keys are correct and exact |
| Upload returns 0 chunks | Text too short; try longer document |
| Query returns no citations | Wait 30s after upload; Pinecone needs indexing time |
| Vercel deploy fails | Check `npm run build` works locally first |
| Production URL 404 | Wait for build to complete; check Deployments tab |

---

## DOCUMENTATION

Stuck? Check these in order:
1. [QUICKSTART.md](QUICKSTART.md) - Setup help
2. [README.md](README.md) - Architecture details
3. [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment help
4. [API_REFERENCE.md](API_REFERENCE.md) - API docs
5. [TESTING_CHECKLIST.md](TESTING_CHECKLIST.md) - Testing guide

---

## COPY-PASTE COMMANDS

Quick reference to paste in terminal:

```powershell
# Setup
cd d:\predusk\rag-app
npm install
Copy-Item .env.example .env.local
# Edit .env.local with API keys

# Dev
npm run dev
# http://localhost:3000

# Deploy
git init
git add .
git commit -m "Initial RAG app"
git remote add origin https://github.com/YOUR_USERNAME/rag-app.git
git branch -M main
git push -u origin main
# Go to vercel.com, import repo, add env vars, redeploy
```

---

## EXPECTED TIMELINE

- **05:00** - Get 4 API keys (Pinecone, Groq, Cohere, Nomic)
- **10:00** - Local setup complete (`npm install`, `.env.local`)
- **15:00** - First test successful (upload + query working)
- **25:00** - Deployed to Vercel
- **30:00** - Production verified and working

---

## WHAT YOU'RE BUILDING

```
User uploads text
    ↓
System chunks it (1000 tokens, 15% overlap)
    ↓
System embeds chunks (Nomic 768-dim)
    ↓
System stores in Pinecone
    ↓
User asks question
    ↓
System embeds question
    ↓
System retrieves top-10 from Pinecone
    ↓
System reranks to top-5 (Cohere)
    ↓
System generates answer with Groq LLM
    ↓
System shows citations [1], [2]
    ↓
User sees answer + sources + metrics
```

---

## ✨ YOU'RE ALL SET!

All files are ready. Just:
1. Get API keys (5 min)
2. Run locally (5 min)
3. Deploy to Vercel (15 min)

**30 minutes from start to live production app.**

Good luck! 🚀

---

**Questions?** See [DOCS_INDEX.md](DOCS_INDEX.md) for documentation navigation.
