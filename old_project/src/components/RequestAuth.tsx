import React, { useState } from 'react';
import { AuthType, AuthConfig } from '../types';
import { BasicAuth } from './auth/BasicAuth';
import { BearerAuth } from './auth/BearerAuth';
import { ApiKeyAuth } from './auth/ApiKeyAuth';
import { NoAuth } from './auth/NoAuth';

interface RequestAuthProps {
  auth: AuthConfig;
  onAuthChange: (auth: AuthConfig) => void;
}

export function RequestAuth({ auth, onAuthChange }: RequestAuthProps) {
  const handleAuthTypeChange = (type: AuthType) => {
    onAuthChange({ type, config: {} });
  };

  const handleConfigChange = (config: Record<string, string>) => {
    onAuthChange({ ...auth, config });
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium mb-2">Authorization</h3>
        <select
          value={auth.type}
          onChange={(e) => handleAuthTypeChange(e.target.value as AuthType)}
          className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="none">No Auth</option>
          <option value="basic">Basic Auth</option>
          <option value="bearer">Bearer Token</option>
          <option value="apiKey">API Key</option>
        </select>
      </div>

      <div className="pt-2">
        {auth.type === 'none' && <NoAuth />}
        {auth.type === 'basic' && (
          <BasicAuth
            config={auth.config}
            onChange={handleConfigChange}
          />
        )}
        {auth.type === 'bearer' && (
          <BearerAuth
            config={auth.config}
            onChange={handleConfigChange}
          />
        )}
        {auth.type === 'apiKey' && (
          <ApiKeyAuth
            config={auth.config}
            onChange={handleConfigChange}
          />
        )}
      </div>
    </div>
  );
}