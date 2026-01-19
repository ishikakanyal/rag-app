// pages/index.tsx
import { useState } from 'react';
import DocumentUpload from '@/components/DocumentUpload';
import QueryInterface from '@/components/QueryInterface';

export default function Home() {
  const [documentsUploaded, setDocumentsUploaded] = useState<string[]>([]);

  const handleUploadSuccess = (title: string) => {
    setDocumentsUploaded([...documentsUploaded, title]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            RAG Knowledge Base
          </h1>
          <p className="text-gray-300 text-lg">
            Upload documents, ask questions, get answers with citations
          </p>
        </div>

        {/* Status */}
        {documentsUploaded.length > 0 && (
          <div className="mb-6 p-4 bg-green-900 border border-green-700 rounded-lg">
            <p className="text-green-200">
              ✓ {documentsUploaded.length} document(s) indexed:{' '}
              <span className="font-mono">{documentsUploaded.join(', ')}</span>
            </p>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Upload Panel */}
          <div>
            <DocumentUpload onUploadSuccess={handleUploadSuccess} />
          </div>

          {/* Query Panel */}
          <div>
            <QueryInterface />
          </div>
        </div>

        {/* Info */}
        <div className="bg-gray-800 text-gray-200 p-6 rounded-lg border border-gray-700 text-sm">
          <h3 className="font-bold mb-3">How it works:</h3>
          <ol className="space-y-2 list-decimal list-inside">
            <li>Upload a document or paste text</li>
            <li>Text is split into chunks with overlap for context preservation</li>
            <li>Each chunk is embedded using Nomic embeddings</li>
            <li>Chunks are stored in Pinecone vector database</li>
            <li>Your query is embedded and top-10 chunks are retrieved</li>
            <li>Cohere reranker selects top-5 most relevant chunks</li>
            <li>Groq LLM generates an answer with citations</li>
            <li>Source chunks are displayed below the answer</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
