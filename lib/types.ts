// lib/types.ts
export interface DocumentMetadata {
  source: string;
  title: string;
  section: string;
  position: number;
  chunk_index: number;
}

export interface TextChunk {
  id: string;
  content: string;
  metadata: DocumentMetadata;
  embedding?: number[];
}

export interface RetrievedChunk extends TextChunk {
  score: number;
}

export interface RerankedChunk extends RetrievedChunk {
  reranker_score: number;
}

export interface CitationSource {
  id: number;
  content: string;
  metadata: DocumentMetadata;
  score: number;
}

export interface RAGAnswer {
  answer: string;
  citations: CitationSource[];
  timing: {
    retrieval_ms: number;
    reranking_ms: number;
    llm_ms: number;
  };
  tokens: {
    input: number;
    output: number;
  };
}
