# Quick Start Guide

## 5-Minute Setup (Local)

### Step 1: Get API Keys (5 min)

1. **Pinecone** (Vector DB)
   - Go to https://pinecone.io
   - Sign up free
   - Create project in `us-east-1`
   - Create index `rag-index` (dimension 768, cosine)
   - Copy API key

2. **Groq** (LLM)
   - Go to https://console.groq.com
   - Sign up
   - Get API key

3. **Cohere** (Reranker)
   - Go to https://cohere.com
   - Sign up
   - Get API key

4. **Nomic** (Embeddings)
   - Go to https://www.nomic.ai
   - Sign up
   - Get API key

### Step 2: Install & Configure (2 min)

```bash
# 1. Copy environment template
cp .env.example .env.local

# 2. Edit .env.local with your API keys
# PINECONE_API_KEY=...
# GROQ_API_KEY=...
# COHERE_API_KEY=...
# NOMIC_API_KEY=...

# 3. Install dependencies
npm install

# 4. Start dev server
npm run dev
```

Open http://localhost:3000

### Step 3: Test Upload & Query (3 min)

1. **Paste Test Text**:
   ```
   Python is a high-level programming language. It was created by Guido van Rossum in 1991. 
   Python emphasizes code readability with significant whitespace. It supports multiple programming 
   paradigms including object-oriented, imperative, and functional programming. Python runs on 
   Windows, macOS, Linux, and other platforms.
   ```

2. **Set Title**: "Python Guide"
3. **Click "Upload & Index"**
4. **Ask Query**: "When was Python created?"
5. **View Answer**: Should cite "1991" with source references

---

## Deployment to Vercel (10 min)

### Option A: Git + Vercel UI (Easiest)

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial RAG app"
   git push -u origin main
   ```

2. **Connect to Vercel**:
   - Go to https://vercel.com
   - Click "New Project"
   - Select your GitHub repo
   - Click "Deploy"

3. **Add Environment Variables**:
   - In Vercel dashboard: Settings → Environment Variables
   - Add all keys from `.env.example`:
     - `PINECONE_API_KEY`
     - `GROQ_API_KEY`
     - `COHERE_API_KEY`
     - `NOMIC_API_KEY`
     - `PINECONE_INDEX_NAME` (set to `rag-index`)
     - `PINECONE_ENVIRONMENT` (set to `us-east-1`)
   - **Skip** `NEXT_PUBLIC_API_URL`

4. **Redeploy**: Vercel will rebuild automatically

5. **Test**:
   - Open your Vercel URL
   - Upload document
   - Query
   - Should work same as local

### Option B: Vercel CLI (Advanced)

```bash
npm i -g vercel

# Login
vercel

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### Option C: Alternative Hosts

**Render.com** (similar to Vercel):
```bash
# 1. Connect GitHub repo to Render
# 2. Select Node environment
# 3. Set build: npm install && npm run build
# 4. Set start: npm run start
# 5. Add env vars in dashboard
```

**Railway.app**:
```bash
# Railway CLI:
npm i -g @railway/cli
railway login
railway init
# Follow prompts
```

---

## Production Checklist

- [ ] All API keys set as environment variables (NOT in code)
- [ ] `NEXT_PUBLIC_API_URL` NOT set in production (uses origin)
- [ ] Pinecone index created with correct dimension (768)
- [ ] Test upload → query flow end-to-end
- [ ] Check browser console for errors (F12)
- [ ] Monitor API rate limits:
  - Groq: 150 req/min
  - Cohere: 100 req/min
  - Pinecone: depends on tier

---

## Troubleshooting

### "Failed to fetch from API"
- Check API keys in `.env` or Vercel settings
- Check CORS (should be handled by Next.js)
- View network tab (F12 → Network)

### "Pinecone connection error"
- Verify API key is correct
- Verify index name matches `PINECONE_INDEX_NAME`
- Check index exists in Pinecone console
- Verify environment (`us-east-1` by default)

### "Rate limit exceeded"
- Wait 1 minute
- Implement queue for bulk uploads
- Upgrade to paid tier if needed

### "Chunks not embedding"
- Check Nomic API key
- Check chunk size < 10k chars
- Monitor Nomic rate limits

### "No citations in answer"
- Check LLM response includes [1], [2]
- Verify retrieved chunks are returned
- Check reranker is working

---

## Next Steps

1. **Custom Branding**: Edit pages/index.tsx, tailwind.config.ts
2. **Add Auth**: Implement next-auth or Clerk
3. **Analytics**: Add PostHog or Mixpanel
4. **Monitoring**: Add Sentry error tracking
5. **Caching**: Add Redis for query caching
6. **Async Jobs**: Use Bull/BullMQ for large uploads

---

Questions? Check [README.md](README.md) for architecture details.
