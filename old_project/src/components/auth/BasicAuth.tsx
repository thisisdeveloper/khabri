import React from 'react';

interface BasicAuthProps {
  config: Record<string, string>;
  onChange: (config: Record<string, string>) => void;
}

export function BasicAuth({ config, onChange }: BasicAuthProps) {
  return (
    <div className="space-y-3">
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
          Username
        </label>
        <input
          type="text"
          id="username"
          value={config.username || ''}
          onChange={(e) => onChange({ ...config, username: e.target.value })}
          className="mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter username"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          type="password"
          id="password"
          value={config.password || ''}
          onChange={(e) => onChange({ ...config, password: e.target.value })}
          className="mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter password"
        />
      </div>
    </div>
  );
}