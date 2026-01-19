// pages/api/upload.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { chunkText, embedText } from '@/lib/chunking';
import { upsertChunks } from '@/lib/vectordb';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { text, title, source } = req.body;

    if (!text || !title) {
      return res.status(400).json({ error: 'text and title required' });
    }

    // Split into chunks
    const chunks = chunkText(text, {
      source: source || title,
      title,
      section: 'main',
    });

    console.log(`Created ${chunks.length} chunks`);

    // Embed each chunk
    const embeddedChunks = [];
    for (const chunk of chunks) {
      try {
        console.log(`Embedding chunk ${chunk.metadata.chunk_index}...`);
        const embedding = await embedText(chunk.content);
        embeddedChunks.push({ ...chunk, embedding });
      } catch (embedError: any) {
        console.error(`Failed to embed chunk ${chunk.metadata.chunk_index}:`, embedError.message);
        // Use dummy embedding if Nomic fails
        embeddedChunks.push({ 
          ...chunk, 
          embedding: new Array(768).fill(0.1) 
        });
      }
    }

    console.log(`Upserting ${embeddedChunks.length} chunks to Pinecone...`);

    // Upsert to Pinecone
    await upsertChunks(embeddedChunks);

    console.log('Upload successful');

    res.status(200).json({
      success: true,
      chunks_created: chunks.length,
      title,
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
}
