import React, { useState } from 'react';
import type { HttpMethod } from '../types';
import { formatJson } from '../utils/jsonFormatter';

interface RequestBodyProps {
  method: HttpMethod;
  body: string;
  onChange: (body: string) => void;
}

export function RequestBody({ method, body, onChange }: RequestBodyProps) {
  const [error, setError] = useState<string>();

  if (method === 'GET' || method === 'HEAD') {
    return (
      <div className="text-sm text-gray-500">
        <p>This request method doesn't support a request body</p>
      </div>
    );
  }

  const handleFormat = () => {
    try {
      const formatted = formatJson(body);
      onChange(formatted);
      setError(undefined);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid JSON');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Request Body</h3>
        <button
          type="button"
          onClick={handleFormat}
          className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 rounded-md hover:bg-blue-50"
        >
          Format JSON
        </button>
      </div>

      <div className="space-y-2">
        <textarea
          value={body}
          onChange={(e) => {
            onChange(e.target.value);
            setError(undefined);
          }}
          placeholder="Enter request body (JSON)"
          rows={12}
          className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
        />
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
      </div>

      <div className="flex gap-4 text-sm text-gray-500">
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-blue-500"></span>
          <span>Format JSON to make it readable</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-red-500"></span>
          <span>Invalid JSON will show an error</span>
        </div>
      </div>
    </div>
  );
}