// lib/config.ts

/**
 * RAG App Configuration
 * 
 * This file documents all configuration parameters used throughout the app.
 * Environment variables are stored in .env.local (dev) or Vercel settings (prod).
 */

// ============================================================================
// VECTOR DATABASE (Pinecone)
// ============================================================================
export const PINECONE_CONFIG = {
  API_KEY: process.env.PINECONE_API_KEY || '',
  INDEX_NAME: process.env.PINECONE_INDEX_NAME || 'rag-index',
  ENVIRONMENT: process.env.PINECONE_ENVIRONMENT || 'us-east-1',
  DIMENSION: 768, // Nomic Embed Text v1.5 output dimension
  METRIC: 'cosine', // Similarity metric
  BATCH_SIZE: 100, // Documents per batch during upsert
};

// ============================================================================
// EMBEDDINGS (Nomic)
// ============================================================================
export const EMBEDDING_CONFIG = {
  API_KEY: process.env.NOMIC_API_KEY || '',
  MODEL: 'nomic-embed-text-v1.5',
  API_URL: 'https://api.nomic.ai/embeddings',
  DIMENSION: 768,
};

// ============================================================================
// CHUNKING STRATEGY
// ============================================================================
export const CHUNKING_CONFIG = {
  // Target chunk size in tokens (approximation: 1 token ≈ 4 characters)
  TARGET_TOKENS: 1000,
  
  // Overlap as percentage to preserve context
  OVERLAP_PERCENT: 0.15,
  
  // Character buffer (tokens to chars ratio)
  TOKEN_BUFFER: 1.3,
  
  // Calculated values
  CHUNK_SIZE_CHARS: Math.floor(1000 * 1.3), // ≈ 1300 chars
  OVERLAP_SIZE_CHARS: Math.floor((1000 * 1.3) * 0.15), // ≈ 195 chars
};

// ============================================================================
// RETRIEVAL (Pinecone)
// ============================================================================
export const RETRIEVAL_CONFIG = {
  // Initial retrieval top-k before reranking
  INITIAL_TOP_K: 10,
  
  // Similarity threshold (0-1, higher = more similar)
  // Set to 0 to disable threshold
  SIMILARITY_THRESHOLD: 0,
};

// ============================================================================
// RERANKING (Cohere)
// ============================================================================
export const RERANKING_CONFIG = {
  API_KEY: process.env.COHERE_API_KEY || '',
  API_URL: 'https://api.cohere.ai/v1/rerank',
  MODEL: 'rerank-english-v2.0',
  
  // Final top-k after reranking
  FINAL_TOP_K: 5,
  
  // Rate limit: ~100 req/min (free tier)
  RATE_LIMIT_RPM: 100,
};

// ============================================================================
// LLM (Groq)
// ============================================================================
export const LLM_CONFIG = {
  API_KEY: process.env.GROQ_API_KEY || '',
  API_URL: 'https://api.groq.com/openai/v1/chat/completions',
  
  // Model selection
  MODEL: 'mixtral-8x7b-32768',
  
  // Generation parameters
  TEMPERATURE: 0.7, // Balanced: 0=deterministic, 1=creative
  MAX_TOKENS: 1024,
  TOP_P: 0.9,
  
  // System prompt for answer generation
  SYSTEM_PROMPT: `You are a helpful assistant that answers questions based on provided context. 
Always include citations like [1], [2], etc. that reference the provided sources.
If you cannot answer the question based on the context, say so clearly.
Be concise and accurate.`,
  
  // Rate limit: ~150 req/min (free tier)
  RATE_LIMIT_RPM: 150,
};

// ============================================================================
// FRONTEND
// ============================================================================
export const FRONTEND_CONFIG = {
  API_BASE: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  
  // UI configuration
  MAX_FILE_SIZE_MB: 10,
  MAX_TEXT_LENGTH_CHARS: 100000,
  
  // Display options
  SHOW_TIMING: true,
  SHOW_TOKENS: true,
  SHOW_SCORES: true,
};

// ============================================================================
// FEATURE FLAGS
// ============================================================================
export const FEATURE_FLAGS = {
  // Enable/disable features for debugging
  DEBUG_MODE: false,
  LOG_API_CALLS: true,
  MOCK_RESPONSES: false, // For testing without APIs
};

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface ChunkingParams {
  target_tokens: number;
  overlap_percent: number;
  token_buffer: number;
}

export interface RetrievalParams {
  top_k: number;
  similarity_threshold: number;
}

export interface RerankingParams {
  model: string;
  top_k: number;
}

export interface LLMParams {
  model: string;
  temperature: number;
  max_tokens: number;
  top_p: number;
}

// ============================================================================
// VALIDATION FUNCTION
// ============================================================================

export function validateConfig(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check required API keys
  if (!PINECONE_CONFIG.API_KEY) errors.push('Missing PINECONE_API_KEY');
  if (!EMBEDDING_CONFIG.API_KEY) errors.push('Missing NOMIC_API_KEY');
  if (!RERANKING_CONFIG.API_KEY) errors.push('Missing COHERE_API_KEY');
  if (!LLM_CONFIG.API_KEY) errors.push('Missing GROQ_API_KEY');

  // Check configuration values
  if (CHUNKING_CONFIG.TARGET_TOKENS <= 0) errors.push('Invalid CHUNKING_CONFIG.TARGET_TOKENS');
  if (CHUNKING_CONFIG.OVERLAP_PERCENT < 0 || CHUNKING_CONFIG.OVERLAP_PERCENT > 1) {
    errors.push('Invalid CHUNKING_CONFIG.OVERLAP_PERCENT (must be 0-1)');
  }

  if (RETRIEVAL_CONFIG.INITIAL_TOP_K < 1) errors.push('Invalid RETRIEVAL_CONFIG.INITIAL_TOP_K');
  if (RERANKING_CONFIG.FINAL_TOP_K > RETRIEVAL_CONFIG.INITIAL_TOP_K) {
    errors.push('FINAL_TOP_K cannot exceed INITIAL_TOP_K');
  }

  if (LLM_CONFIG.TEMPERATURE < 0 || LLM_CONFIG.TEMPERATURE > 2) {
    errors.push('Invalid LLM_CONFIG.TEMPERATURE (must be 0-2)');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export default {
  PINECONE_CONFIG,
  EMBEDDING_CONFIG,
  CHUNKING_CONFIG,
  RETRIEVAL_CONFIG,
  RERANKING_CONFIG,
  LLM_CONFIG,
  FRONTEND_CONFIG,
  FEATURE_FLAGS,
  validateConfig,
};
