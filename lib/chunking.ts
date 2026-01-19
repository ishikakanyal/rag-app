// lib/chunking.ts
import { v4 as uuidv4 } from 'uuid';
import { TextChunk, DocumentMetadata } from './types';

const TOKEN_BUFFER = 1.3; // Approximate token-to-char ratio
const TARGET_CHUNK_TOKENS = 1000;
const OVERLAP_PERCENT = 0.15;

export function estimateTokens(text: string): number {
  // Rough estimate: 1 token ≈ 4 characters
  return Math.ceil(text.length / 4);
}

export function chunkText(
  text: string,
  metadata: Omit<DocumentMetadata, 'position' | 'chunk_index'>
): TextChunk[] {
  const chunkSize = Math.floor(TARGET_CHUNK_TOKENS * TOKEN_BUFFER);
  const overlapSize = Math.floor(chunkSize * OVERLAP_PERCENT);

  const chunks: TextChunk[] = [];
  let position = 0;

  while (position < text.length) {
    const end = Math.min(position + chunkSize, text.length);
    const chunk = text.slice(position, end);

    if (chunk.trim().length > 0) {
      chunks.push({
        id: uuidv4(),
        content: chunk,
        metadata: {
          ...metadata,
          position,
          chunk_index: chunks.length,
        },
      });
    }

    position += chunkSize - overlapSize;
  }

  return chunks;
}

export async function embedText(text: string): Promise<number[]> {
  // Using Nomic Embed via API (will be called from backend)
  const response = await fetch('https://api.nomic.ai/embeddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.NOMIC_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'nomic-embed-text-v1.5',
      input: text,
    }),
  });

  if (!response.ok) {
    throw new Error(`Nomic API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.embeddings[0];
}
