import React from 'react';
import { Plus, Minus } from 'lucide-react';

interface RequestHeadersProps {
  headers: [string, string][];
  onChange: (headers: [string, string][]) => void;
}

export function RequestHeaders({ headers, onChange }: RequestHeadersProps) {
  const addHeader = () => onChange([...headers, ['', '']]);
  
  const removeHeader = (index: number) => {
    const newHeaders = [...headers];
    newHeaders.splice(index, 1);
    onChange(newHeaders);
  };

  const updateHeader = (index: number, key: string, value: string) => {
    const newHeaders = [...headers];
    newHeaders[index] = [key, value];
    onChange(newHeaders);
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Headers</h3>
        <button
          type="button"
          onClick={addHeader}
          className="p-1 text-blue-600 hover:text-blue-800"
        >
          <Plus size={20} />
        </button>
      </div>
      {headers.map(([key, value], index) => (
        <div key={index} className="flex gap-2 items-center">
          <input
            type="text"
            value={key}
            onChange={(e) => updateHeader(index, e.target.value, value)}
            placeholder="Header name"
            className="flex-1 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <input
            type="text"
            value={value}
            onChange={(e) => updateHeader(index, key, e.target.value)}
            placeholder="Value"
            className="flex-1 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            type="button"
            onClick={() => removeHeader(index)}
            className="p-1 text-red-600 hover:text-red-800"
          >
            <Minus size={20} />
          </button>
        </div>
      ))}
    </div>
  );
}