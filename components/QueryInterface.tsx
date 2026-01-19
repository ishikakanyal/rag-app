// components/QueryInterface.tsx
'use client';
import { useState } from 'react';
import { RAGAnswer } from '@/lib/types';

interface QueryInterfaceProps {
  onResultsChange?: (results: RAGAnswer | null) => void;
}

export default function QueryInterface({ onResultsChange }: QueryInterfaceProps) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState<RAGAnswer | null>(null);

  const handleQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!query.trim()) {
      setError('Please enter a query');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Query failed');
      }

      const data = await response.json();
      setResults(data);
      onResultsChange?.(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-2xl font-bold mb-4">Ask a Question</h2>

        <form onSubmit={handleQuery} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Query
            </label>
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask anything about your uploaded documents..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {error && <div className="p-3 bg-red-100 text-red-700 rounded">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>
      </div>

      {results && (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg shadow-md border border-blue-200">
          <h3 className="text-xl font-bold mb-3 text-gray-800">Answer</h3>
          <p className="text-gray-700 whitespace-pre-wrap leading-relaxed mb-6">
            {results.answer}
          </p>

          <div className="grid grid-cols-3 gap-4 mb-6 text-sm">
            <div className="bg-white p-3 rounded border border-gray-200">
              <p className="text-gray-600">Retrieval Time</p>
              <p className="font-mono font-bold text-blue-600">
                {results.timing.retrieval_ms}ms
              </p>
            </div>
            <div className="bg-white p-3 rounded border border-gray-200">
              <p className="text-gray-600">Reranking Time</p>
              <p className="font-mono font-bold text-blue-600">
                {results.timing.reranking_ms}ms
              </p>
            </div>
            <div className="bg-white p-3 rounded border border-gray-200">
              <p className="text-gray-600">LLM Time</p>
              <p className="font-mono font-bold text-blue-600">{results.timing.llm_ms}ms</p>
            </div>
          </div>

          <div className="mb-6 text-sm">
            <p className="text-gray-600 mb-2">
              Tokens: {results.tokens.input} input + {results.tokens.output} output
            </p>
          </div>

          {results.citations.length > 0 && (
            <div>
              <h4 className="font-bold text-gray-800 mb-3">Sources</h4>
              <div className="space-y-3">
                {results.citations.map((citation) => (
                  <div
                    key={citation.id}
                    className="bg-white p-3 rounded border-l-4 border-blue-500"
                  >
                    <p className="font-bold text-sm text-blue-600 mb-1">
                      [{citation.id}] {citation.metadata.title}
                    </p>
                    <p className="text-gray-600 text-sm">{citation.metadata.section}</p>
                    <p className="text-gray-700 text-sm mt-2 line-clamp-3">
                      {citation.content}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      Score: {citation.score.toFixed(3)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
