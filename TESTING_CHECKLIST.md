# Pre-Deployment Testing Checklist

Use this checklist to validate the RAG app before production deployment.

---

## Local Setup Tests

- [ ] `npm install` completes without errors
- [ ] `npm run build` completes without errors
- [ ] `npm run dev` starts successfully
- [ ] Browser opens http://localhost:3000 without 404
- [ ] No console errors in browser (F12)
- [ ] `.env.local` has all required API keys

---

## API Keys Tests

- [ ] Pinecone API key is valid (test connection)
- [ ] Pinecone index `rag-index` exists with dimension 768
- [ ] Groq API key is valid
- [ ] Cohere API key is valid
- [ ] Nomic API key is valid

To test Pinecone:
```bash
curl -H "Api-Key: YOUR_KEY" -H "Content-Type: application/json" \
  https://api.pinecone.io/lists/indexes
```

---

## Frontend UI Tests

### Document Upload Component

- [ ] Text input field works (type text)
- [ ] File upload input works (select .txt file)
- [ ] Title input field works
- [ ] "Upload & Index" button is clickable
- [ ] Upload loading state shows "Processing..."
- [ ] Success message appears after upload
- [ ] Error message shows if upload fails

### Query Component

- [ ] Query textarea input works
- [ ] "Search" button is clickable
- [ ] Loading state shows "Searching..."
- [ ] Answer displays below button
- [ ] Citations [1], [2] appear in answer
- [ ] Source list shows below answer
- [ ] Timing metrics display (retrieval, reranking, LLM)
- [ ] Token count shows

### Main Page

- [ ] Dark theme loads correctly
- [ ] Layout is responsive (resize window)
- [ ] No layout shifts or jumps
- [ ] Colors are readable
- [ ] All text is properly formatted

---

## API Endpoint Tests

### /api/upload Endpoint

Test with curl:
```bash
curl -X POST http://localhost:3000/api/upload \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Python is a programming language created in 1991.",
    "title": "Python 101"
  }'
```

Expected response:
```json
{
  "success": true,
  "chunks_created": 1,
  "title": "Python 101"
}
```

Tests to run:
- [ ] Valid upload returns 200
- [ ] chunks_created is > 0
- [ ] Missing "text" returns 400
- [ ] Missing "title" returns 400
- [ ] Large text processes without timeout

### /api/query Endpoint

Test with curl:
```bash
curl -X POST http://localhost:3000/api/query \
  -H "Content-Type: application/json" \
  -d '{"query": "When was Python created?"}'
```

Expected response:
```json
{
  "answer": "Python was created in 1991 [1].",
  "citations": [...],
  "timing": {...},
  "tokens": {...}
}
```

Tests to run:
- [ ] Valid query returns 200
- [ ] Answer field is non-empty
- [ ] Citations array exists (may be empty)
- [ ] Timing object has all fields
- [ ] Missing "query" returns 400
- [ ] Query without uploaded docs returns graceful message

---

## Integration Tests

### End-to-End Flow

1. [ ] Upload test document
2. [ ] Verify "chunks_created" > 0
3. [ ] Query about document content
4. [ ] Verify answer references document
5. [ ] Verify citations [1], [2] present
6. [ ] Click on source to verify metadata

### Multiple Documents

1. [ ] Upload document A
2. [ ] Upload document B
3. [ ] Query that requires both documents
4. [ ] Verify citations from both sources appear

### Edge Cases

1. [ ] Query with very short question (1-2 words)
   - [ ] Returns valid answer or "not found"
2. [ ] Query about topic not in documents
   - [ ] Returns "could not find" gracefully
3. [ ] Very long query (100+ words)
   - [ ] Processes without error
4. [ ] Special characters in text (é, ñ, etc.)
   - [ ] Encodes/displays correctly

---

## Performance Tests

### Latency Baseline

Using browser DevTools Network tab:

- [ ] Upload API < 5 seconds (for ~5KB text)
- [ ] Query API < 4 seconds total
  - [ ] Retrieval < 200ms
  - [ ] Reranking < 1500ms
  - [ ] LLM < 2500ms

### Load Testing (Browser)

- [ ] Can submit 2-3 queries in succession
- [ ] No memory leaks (DevTools → Memory)
- [ ] Network tab shows reasonable request sizes

---

## Error Handling Tests

### Network Errors

- [ ] Disconnect internet
  - [ ] Shows error message (not silent fail)
  - [ ] User can retry

- [ ] Reconnect internet
  - [ ] Retry works

### API Key Errors

- [ ] Invalid PINECONE_API_KEY
  - [ ] Shows "Could not connect to Pinecone"
  
- [ ] Invalid GROQ_API_KEY
  - [ ] Shows "Could not connect to LLM"

### Rate Limit Simulation (Advanced)

- [ ] Rapid-fire 20 requests
  - [ ] Gets rate limited response (429)
  - [ ] Shows user-friendly message
  - [ ] Suggests retry later

---

## Browser Compatibility

Test on multiple browsers:

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

Checks:
- [ ] No console errors
- [ ] Styling renders correctly
- [ ] All buttons clickable
- [ ] No layout breaks

---

## Mobile/Responsive Tests

- [ ] On mobile (375px width)
  - [ ] Layout stacks vertically
  - [ ] Text readable
  - [ ] Buttons clickable
  - [ ] No horizontal scroll

- [ ] On tablet (768px width)
  - [ ] Side-by-side layout still works
  - [ ] Readable font sizes

---

## Accessibility Tests

- [ ] Tab through all form fields
  - [ ] Tab order is logical
  - [ ] Focus indicators visible

- [ ] Screen reader test (NVDA/JAWS)
  - [ ] Form labels announced
  - [ ] Buttons described
  - [ ] Answer content readable

---

## Security Tests

- [ ] API keys NOT visible in network requests (sent server-side)
  - [ ] Open DevTools → Network
  - [ ] Check /api/* requests
  - [ ] No API keys in request body
  - [ ] No API keys in response headers

- [ ] `.env.local` NOT committed to Git
  - [ ] Run `git log --all --source --full-history -- .env.local`
  - [ ] Should return nothing

---

## Deployment-Specific Tests

### Before Deploying to Vercel

- [ ] Environment variables added to Vercel dashboard
- [ ] `.env.local` NOT in Git
- [ ] Build succeeds: `vercel build`
- [ ] Preview deploy works
- [ ] Production environment variables are different from dev

### After Deploying to Vercel

- [ ] Production URL loads without 404
- [ ] No console errors in production
- [ ] Upload API works on production URL
- [ ] Query API works on production URL
- [ ] Timing metrics show (not just 0)
- [ ] Can perform full end-to-end flow

---

## Documentation Tests

- [ ] [README.md](README.md) is up-to-date
- [ ] [QUICKSTART.md](QUICKSTART.md) steps work without modification
- [ ] [DEPLOYMENT.md](DEPLOYMENT.md) instructions are accurate
- [ ] [API_REFERENCE.md](API_REFERENCE.md) examples work with curl
- [ ] [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) reflects current code

---

## Evaluation Tests

Run through 5 QA pairs from [evaluation/README.md](evaluation/README.md):

### QA 1: Factual Recall
- [ ] Upload Paris document
- [ ] Query: "What is the population of Paris?"
- [ ] Answer contains "2.2 million"
- [ ] Citation [1] present
- **Result**: ✓ PASS / ✗ FAIL

### QA 2: Multi-Chunk
- [ ] Upload ML/DL document
- [ ] Query: "How does deep learning relate to machine learning?"
- [ ] Answer mentions both concepts
- [ ] Multiple citations present
- **Result**: ✓ PASS / ✗ FAIL

### QA 3: No Answer
- [ ] Upload Python document
- [ ] Query: "When was JavaScript created?"
- [ ] Answer says "could not find"
- [ ] No hallucination of dates
- **Result**: ✓ PASS / ✗ FAIL

### QA 4: Citation Accuracy
- [ ] Upload climate document (3 chunks)
- [ ] Query: "What is the primary cause?"
- [ ] Answer cites correct chunk (Chunk A)
- [ ] Does NOT cite Chunk C (effects, not cause)
- **Result**: ✓ PASS / ✗ FAIL

### QA 5: Complex Reasoning
- [ ] Upload pricing document
- [ ] Query: "Total cost of A+B+shipping?"
- [ ] Answer: 50+100+10 = 160
- [ ] Citations from multiple chunks
- **Result**: ✓ PASS / ✗ FAIL

**Overall**: ___ / 5 PASS

---

## Final Sign-Off

- [ ] All above tests completed
- [ ] No critical bugs found
- [ ] Performance acceptable
- [ ] Documentation complete
- [ ] Ready for production

**Tester Name**: ________________________

**Date**: ________________________

**Notes**: 
```


```

---

## Common Failure Points

| Issue | Solution |
|-------|----------|
| Upload returns 0 chunks | Check text length > 10 chars |
| Query returns no citations | Verify document uploaded successfully |
| Answer is hallucinated | Check Pinecone has documents |
| Latency > 5s | Check API key rate limits |
| 404 on production | Verify environment variables set |
| No styling on production | Check Tailwind CSS build |

---

## Performance Optimization Tips

If tests show poor performance:

1. **Upload slow**: 
   - Check Pinecone API key valid
   - Reduce chunk size if needed

2. **Query slow**:
   - Check Groq rate limits not hit
   - Verify network connection
   - Profile with DevTools

3. **Memory leak**:
   - Check for large arrays not cleared
   - Monitor with Chrome DevTools Memory tab

---

**Final Checkpoint**: All tests passed? ✓ Ready for deployment!
