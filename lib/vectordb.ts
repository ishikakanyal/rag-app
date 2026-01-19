// lib/vectordb.ts
import { Pinecone } from '@pinecone-database/pinecone';
import { TextChunk, RetrievedChunk } from './types';

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

export async function getIndex() {
  const indexName = process.env.PINECONE_INDEX_NAME || 'rag-index';
  return pinecone.Index(indexName);
}

export async function upsertChunks(chunks: TextChunk[]): Promise<void> {
  const index = await getIndex();

  const vectors = chunks.map((chunk) => ({
    id: chunk.id,
    values: chunk.embedding || new Array(768).fill(0), // 768-dim for Nomic
    metadata: {
      content: chunk.content,
      source: chunk.metadata.source,
      title: chunk.metadata.title,
      section: chunk.metadata.section,
      position: chunk.metadata.position,
      chunk_index: chunk.metadata.chunk_index,
    },
  }));

  // Batch upsert in groups of 100
  for (let i = 0; i < vectors.length; i += 100) {
    const batch = vectors.slice(i, i + 100);
    await index.upsert(batch);
  }
}

export async function retrieveChunks(
  query: string,
  embedding: number[],
  topK: number = 10
): Promise<RetrievedChunk[]> {
  const index = await getIndex();

  const results = await index.query({
    vector: embedding,
    topK,
    includeMetadata: true,
  });

  return results.matches.map((match) => ({
    id: match.id,
    content: (match.metadata?.content as string) || '',
    metadata: {
      source: (match.metadata?.source as string) || 'unknown',
      title: (match.metadata?.title as string) || 'untitled',
      section: (match.metadata?.section as string) || 'main',
      position: (match.metadata?.position as number) || 0,
      chunk_index: (match.metadata?.chunk_index as number) || 0,
    },
    embedding: [],
    score: match.score || 0,
  }));
}
