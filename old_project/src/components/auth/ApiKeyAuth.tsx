import React from 'react';

interface ApiKeyAuthProps {
  config: Record<string, string>;
  onChange: (config: Record<string, string>) => void;
}

export function ApiKeyAuth({ config, onChange }: ApiKeyAuthProps) {
  return (
    <div className="space-y-3">
      <div>
        <label htmlFor="key" className="block text-sm font-medium text-gray-700">
          Key
        </label>
        <input
          type="text"
          id="key"
          value={config.key || ''}
          onChange={(e) => onChange({ ...config, key: e.target.value })}
          className="mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="API key name"
        />
      </div>
      <div>
        <label htmlFor="value" className="block text-sm font-medium text-gray-700">
          Value
        </label>
        <input
          type="text"
          id="value"
          value={config.value || ''}
          onChange={(e) => onChange({ ...config, value: e.target.value })}
          className="mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="API key value"
        />
      </div>
      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700">
          Add to
        </label>
        <select
          id="location"
          value={config.location || 'header'}
          onChange={(e) => onChange({ ...config, location: e.target.value })}
          className="mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="header">Header</option>
          <option value="query">Query Params</option>
        </select>
      </div>
    </div>
  );
}