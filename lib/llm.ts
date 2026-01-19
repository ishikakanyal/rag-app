// lib/llm.ts
import { RerankedChunk, RAGAnswer, CitationSource } from './types';

export async function generateAnswerWithCitations(
  query: string,
  chunks: RerankedChunk[]
): Promise<RAGAnswer> {
  const startTime = Date.now();

  const context = chunks
    .map(
      (chunk, idx) =>
        `[${idx + 1}] ${chunk.content}\n(Source: ${chunk.metadata.source}, ${chunk.metadata.title})`
    )
    .join('\n\n');

  const systemPrompt = `You are a helpful assistant that answers questions based on provided context. 
Always include citations like [1], [2], etc. that reference the provided sources.
If you cannot answer the question based on the context, say so clearly.
Be concise and accurate.`;

  const userPrompt = `Context:\n${context}\n\nQuestion: ${query}`;

  console.log('Calling Groq API with:');
  console.log('- Model:', 'mixtral-8x7b-32768');
  console.log('- API Key present:', !!process.env.GROQ_API_KEY);
  console.log('- Messages count:', 2);

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 1024,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('Groq API error response:', errorData);
    throw new Error(`Groq API error: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`);
  }

  const data = await response.json();
  const llmMs = Date.now() - startTime;

  const answer = data.choices[0].message.content;

  // Extract citation indices from answer
  const citationMatches = answer.match(/\[\d+\]/g) || [];
  const citations: CitationSource[] = [];
  const usedIndices = new Set<number>();

  citationMatches.forEach((match) => {
    const idx = parseInt(match.slice(1, -1)) - 1;
    if (idx >= 0 && idx < chunks.length && !usedIndices.has(idx)) {
      usedIndices.add(idx);
      citations.push({
        id: idx + 1,
        content: chunks[idx].content,
        metadata: chunks[idx].metadata,
        score: chunks[idx].reranker_score,
      });
    }
  });

  return {
    answer,
    citations,
    timing: {
      retrieval_ms: 0, // Will be set by caller
      reranking_ms: 0, // Will be set by caller
      llm_ms: llmMs,
    },
    tokens: {
      input: data.usage?.prompt_tokens || 0,
      output: data.usage?.completion_tokens || 0,
    },
  };
}
