import React from 'react';
import { Check, X } from 'lucide-react';
import type { ApiResponse } from '../types';

interface ResponseViewProps {
  response: ApiResponse | null;
  error?: string;
}

export function ResponseView({ response, error }: ResponseViewProps) {
  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-center gap-2 text-red-600 mb-2">
          <X size={20} />
          <h3 className="text-lg font-medium">Error</h3>
        </div>
        <pre className="whitespace-pre-wrap text-red-700">{error}</pre>
      </div>
    );
  }

  if (!response) {
    return null;
  }

  const isSuccess = response.status >= 200 && response.status < 300;

  return (
    <div className="space-y-4">
      <div className={`p-4 ${isSuccess ? 'bg-green-50' : 'bg-yellow-50'} rounded-lg border ${isSuccess ? 'border-green-200' : 'border-yellow-200'}`}>
        <div className="flex items-center gap-2 mb-2">
          {isSuccess ? (
            <Check size={20} className="text-green-600" />
          ) : (
            <X size={20} className="text-yellow-600" />
          )}
          <h3 className={`text-lg font-medium ${isSuccess ? 'text-green-600' : 'text-yellow-600'}`}>
            {response.status} {response.statusText}
          </h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Response Headers</h4>
            <div className="bg-white p-3 rounded border">
              {Object.entries(response.headers).map(([key, value]) => (
                <div key={key} className="grid grid-cols-3 gap-2">
                  <span className="font-mono text-gray-600">{key}:</span>
                  <span className="col-span-2 font-mono">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Response Body</h4>
            <pre className="bg-white p-3 rounded border font-mono text-sm overflow-x-auto">
              {typeof response.data === 'string'
                ? response.data
                : JSON.stringify(response.data, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}