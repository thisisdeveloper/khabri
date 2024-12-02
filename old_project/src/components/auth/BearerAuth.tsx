import React from 'react';

interface BearerAuthProps {
  config: Record<string, string>;
  onChange: (config: Record<string, string>) => void;
}

export function BearerAuth({ config, onChange }: BearerAuthProps) {
  return (
    <div>
      <label htmlFor="token" className="block text-sm font-medium text-gray-700">
        Token
      </label>
      <input
        type="text"
        id="token"
        value={config.token || ''}
        onChange={(e) => onChange({ ...config, token: e.target.value })}
        className="mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        placeholder="Enter token"
      />
    </div>
  );
}