// lib/reranker.ts
import { RetrievedChunk, RerankedChunk } from './types';

export async function rerankerChunks(
  query: string,
  chunks: RetrievedChunk[],
  topK: number = 5
): Promise<RerankedChunk[]> {
  if (chunks.length === 0) return [];

  const response = await fetch('https://api.cohere.ai/v1/rerank', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.COHERE_API_KEY}`,
    },
    body: JSON.stringify({
      query,
      documents: chunks.map((c) => ({ text: c.content })),
      model: 'rerank-english-v2.0',
      top_k: topK,
    }),
  });

  if (!response.ok) {
    console.error('Cohere reranker error:', await response.text());
    // Fallback: return original chunks sorted by score
    return chunks.slice(0, topK).map((c) => ({
      ...c,
      reranker_score: c.score,
    }));
  }

  const data = await response.json();
  const rerankedIndices = data.results.map((r: any) => r.index);

  return rerankedIndices.map((idx: number, position: number) => ({
    ...chunks[idx],
    reranker_score: data.results[position].relevance_score,
  }));
}
