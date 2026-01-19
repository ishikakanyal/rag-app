# Deployment Guide

## Pre-Deployment Checklist

- [ ] All source code committed to Git
- [ ] `.env.local` NOT committed (in `.gitignore`)
- [ ] `.env.example` exists with placeholder values
- [ ] `npm run build` completes without errors locally
- [ ] All tests pass (if applicable)
- [ ] README.md updated with correct URLs
- [ ] API rate limits understood
- [ ] Cost estimated (all free tiers used)

---

## Deployment to Vercel (Recommended)

Vercel is optimized for Next.js and has one-click GitHub deployment.

### Step 1: Prepare GitHub Repository

```bash
# Initialize Git (if not already)
git init

# Create .gitignore
git add -A
git commit -m "Initial RAG app commit"

# Create a new public GitHub repo
# https://github.com/new
# Then push:
git remote add origin https://github.com/YOUR_USERNAME/rag-app.git
git branch -M main
git push -u origin main
```

### Step 2: Connect to Vercel

1. Go to https://vercel.com
2. Click **"New Project"**
3. Select **"Continue with GitHub"**
4. Authorize Vercel
5. Select your `rag-app` repository
6. Click **"Import"**

### Step 3: Configure Environment Variables

1. In Vercel dashboard, go to **Settings → Environment Variables**
2. Add each key-value pair:

| Key | Value |
|-----|-------|
| `PINECONE_API_KEY` | [Your Pinecone API key] |
| `PINECONE_INDEX_NAME` | `rag-index` |
| `PINECONE_ENVIRONMENT` | `us-east-1` |
| `GROQ_API_KEY` | [Your Groq API key] |
| `COHERE_API_KEY` | [Your Cohere API key] |
| `NOMIC_API_KEY` | [Your Nomic API key] |

**Important**: Do NOT add `NEXT_PUBLIC_API_URL` (will use defaults)

3. Click **"Save"**

### Step 4: Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes for build to complete
3. Once complete, you'll get a production URL: `https://rag-app-xxxxxxx.vercel.app`

### Step 5: Test Production

1. Open your production URL
2. Upload a test document
3. Query and verify citations appear
4. Check browser console (F12) for errors

---

## Deployment to Render.com

Alternative to Vercel with similar features.

### Step 1: Create Render Account

1. Go to https://render.com
2. Sign up with GitHub

### Step 2: Create Web Service

1. Click **"New +"** → **"Web Service"**
2. Select your GitHub repo
3. Fill in form:
   - **Name**: `rag-app`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`
   - **Plan**: Free

### Step 3: Add Environment Variables

1. Click **"Advanced"** (during setup)
2. Add each environment variable:
   ```
   PINECONE_API_KEY=...
   GROQ_API_KEY=...
   COHERE_API_KEY=...
   NOMIC_API_KEY=...
   PINECONE_INDEX_NAME=rag-index
   PINECONE_ENVIRONMENT=us-east-1
   ```

### Step 4: Deploy

1. Click **"Create Web Service"**
2. Wait 3-5 minutes for build
3. Get URL: `https://rag-app-xxxxx.onrender.com`

### Step 5: Test

Same as Vercel

---

## Deployment to Railway.app

Another alternative with GitHub integration.

### Step 1: Create Account

1. Go to https://railway.app
2. Sign up with GitHub

### Step 2: Create Project

1. Click **"New Project"** → **"Deploy from GitHub repo"**
2. Select your `rag-app` repository
3. Grant Railway permission

### Step 3: Configure

1. Railway auto-detects Node.js
2. Go to **"Variables"** tab
3. Add environment variables from table above
4. Click **"Deploy"**

### Step 4: Test

Get URL from Railway dashboard and test

---

## Deployment to Fly.io

Docker-based deployment platform.

### Prerequisites

```bash
npm install -g flyctl
fly auth login
```

### Step 1: Initialize Fly App

```bash
fly launch --name rag-app
```

Follow prompts:
- Choose region nearest to you
- Skip Redis/PostgreSQL

### Step 2: Set Secrets

```bash
fly secrets set PINECONE_API_KEY="your_key"
fly secrets set GROQ_API_KEY="your_key"
fly secrets set COHERE_API_KEY="your_key"
fly secrets set NOMIC_API_KEY="your_key"
fly secrets set PINECONE_INDEX_NAME="rag-index"
fly secrets set PINECONE_ENVIRONMENT="us-east-1"
```

### Step 3: Deploy

```bash
fly deploy
```

Wait for deployment to complete

### Step 4: View URL

```bash
fly info
```

---

## Local Testing Before Deploy

Always test locally first:

```bash
# Test build
npm run build

# Test production locally
npm run start

# Open http://localhost:3000
# Test upload, query, and citations
```

---

## Post-Deployment Monitoring

### Check Logs

**Vercel**:
```
Dashboard → Deployments → Logs
```

**Render**:
```
Dashboard → Logs
```

**Fly**:
```bash
fly logs
```

### Monitor API Usage

1. **Pinecone**: https://console.pinecone.io → Metrics
2. **Groq**: https://console.groq.com → Activity
3. **Cohere**: https://dashboard.cohere.ai → Usage

### Alert on Issues

- Monitor error rates
- Check 4xx/5xx status codes
- Watch API rate limits
- Monitor cold start times (Vercel: ~2s, Render: ~10s)

---

## Scaling & Optimization

### If API Rate Limits Hit

1. **Groq** (150 req/min): Implement request queue
2. **Cohere** (100 req/min): Cache rerank results
3. **Pinecone**: Upgrade to paid tier (free: ~1M vectors)

### If Performance Degrades

1. Add Redis caching for popular queries
2. Implement async job queue for uploads
3. Use CDN for static assets (default with Vercel)
4. Optimize LLM prompts to reduce token usage

### Cost Estimation

- **Vercel**: Free tier sufficient for ~100 queries/day
- **Pinecone**: Free tier for ~1M vectors
- **Groq**: Free tier for ~150 queries/min
- **Cohere**: Free tier for ~100 reranks/min
- **Nomic**: Free tier sufficient
- **Total**: ~$0/month for reasonable usage

---

## Troubleshooting Deployment

### Build Fails

```
Error: Could not find a production build
```

→ Check `npm run build` works locally

### Environment Variables Not Loaded

→ Verify exact key names match `.env.example`

### API Calls Fail in Production

→ Check environment variables are set (not just `.env.local`)

### Timeout Errors

→ Increase timeout in API route (Vercel default: 60s free tier)

### Cold Start Delays

→ Normal for free tiers (2-10s); use paid for <1s

---

## Rollback

If deployment has issues:

**Vercel**: Click previous deployment, then "Promote to Production"

**Render**: Go to Deployments, select previous, click "Deploy"

**Fly**: Use `fly releases` and `fly releases rollback`

---

## Custom Domain

### Vercel

Settings → Domains → Add custom domain

### Render

Settings → Custom Domain → Add domain

### Fly

```bash
fly certs add your-domain.com
```

---

## Next Steps

1. ✅ Verify working URL loads
2. ✅ Test upload → query → citations flow
3. ✅ Monitor API usage for 24 hours
4. ✅ Optimize based on performance metrics
5. ✅ Add analytics tracking
6. ✅ Plan scaling strategy

---

**Questions?** See [README.md](README.md) and [QUICKSTART.md](QUICKSTART.md)
