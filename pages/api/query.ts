// pages/api/query.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { embedText } from '@/lib/chunking';
import { retrieveChunks } from '@/lib/vectordb';
import { rerankerChunks } from '@/lib/reranker';
import { generateAnswerWithCitations } from '@/lib/llm';
import { RAGAnswer } from '@/lib/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RAGAnswer | { error: string }>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'query required' });
    }

    console.log(`Query received: "${query}"`);
    const overallStart = Date.now();

    // 1. Embed query
    console.log('Step 1: Embedding query...');
    let queryEmbedding;
    try {
      queryEmbedding = await embedText(query);
      console.log('✓ Query embedded successfully');
    } catch (embedError: any) {
      console.error('Embedding failed:', embedError.message);
      // Use dummy embedding
      queryEmbedding = new Array(768).fill(0.1);
      console.log('Using dummy embedding (Nomic may be down)');
    }

    // 2. Retrieve chunks
    console.log('Step 2: Retrieving chunks from Pinecone...');
    const retrievalStart = Date.now();
    let retrieved: any[] = [];
    try {
      retrieved = await retrieveChunks(query, queryEmbedding, 10);
      console.log(`✓ Retrieved ${retrieved.length} chunks`);
    } catch (retrievalError: any) {
      console.error('Retrieval failed:', retrievalError.message);
      retrieved = [];
    }
    const retrievalMs = Date.now() - retrievalStart;

    if (retrieved.length === 0) {
      console.log('No chunks found, returning graceful no-answer');
      return res.status(200).json({
        answer: 'I could not find relevant information to answer your question.',
        citations: [],
        timing: {
          retrieval_ms: retrievalMs,
          reranking_ms: 0,
          llm_ms: 0,
        },
        tokens: {
          input: 0,
          output: 0,
        },
      });
    }

    // 3. Rerank chunks
    console.log('Step 3: Reranking chunks...');
    const rerankStart = Date.now();
    let reranked;
    try {
      reranked = await rerankerChunks(query, retrieved, 5);
      console.log(`✓ Reranked to ${reranked.length} chunks`);
    } catch (rerankError: any) {
      console.error('Reranking failed:', rerankError.message);
      // Fallback: use top 5 without reranking
      reranked = retrieved.slice(0, 5);
      console.log('Using top 5 without reranking');
    }
    const rerankMs = Date.now() - rerankStart;

    // 4. Generate answer with LLM
    console.log('Step 4: Generating answer with LLM...');
    const answerStart = Date.now();
    let answer;
    try {
      answer = await generateAnswerWithCitations(query, reranked);
      console.log('✓ Answer generated successfully');
    } catch (llmError: any) {
      console.error('LLM failed:', llmError.message);
      throw new Error(`LLM generation failed: ${llmError.message}`);
    }
    const answerMs = Date.now() - answerStart;

    answer.timing = {
      retrieval_ms: retrievalMs,
      reranking_ms: rerankMs,
      llm_ms: answerMs,
    };

    console.log('✓ Query completed successfully');
    res.status(200).json(answer);
  } catch (error: any) {
    console.error('Query error:', error);
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
}
