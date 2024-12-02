import React from 'react';
import { AuthType } from '../types';
import { useStore } from '../store';

export function Authorization() {
  const { tabs, activeTab, updateTab } = useStore();
  const activeRequest = tabs.find(tab => tab.id === activeTab);

  if (!activeRequest) return null;

  const handleAuthTypeChange = (type: AuthType) => {
    updateTab(activeRequest.id, {
      auth: {
        type,
        config: {}
      }
    });
  };

  const handleConfigChange = (key: string, value: string) => {
    updateTab(activeRequest.id, {
      auth: {
        ...activeRequest.auth,
        config: {
          ...activeRequest.auth.config,
          [key]: value
        }
      }
    });
  };

  const renderAuthFields = () => {
    switch (activeRequest.auth.type) {
      case 'basic':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Username
              </label>
              <input
                type="text"
                value={activeRequest.auth.config.username || ''}
                onChange={(e) => handleConfigChange('username', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-800 dark:text-gray-100"
                placeholder="Enter username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <input
                type="password"
                value={activeRequest.auth.config.password || ''}
                onChange={(e) => handleConfigChange('password', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-800 dark:text-gray-100"
                placeholder="Enter password"
              />
            </div>
          </div>
        );

      case 'bearer':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Token
            </label>
            <input
              type="text"
              value={activeRequest.auth.config.token || ''}
              onChange={(e) => handleConfigChange('token', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-800 dark:text-gray-100"
              placeholder="Enter token"
            />
          </div>
        );

      case 'apiKey':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Key
              </label>
              <input
                type="text"
                value={activeRequest.auth.config.key || ''}
                onChange={(e) => handleConfigChange('key', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-800 dark:text-gray-100"
                placeholder="Enter key name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Value
              </label>
              <input
                type="text"
                value={activeRequest.auth.config.value || ''}
                onChange={(e) => handleConfigChange('value', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-800 dark:text-gray-100"
                placeholder="Enter key value"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Type
        </label>
        <select
          value={activeRequest.auth.type}
          onChange={(e) => handleAuthTypeChange(e.target.value as AuthType)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-800 dark:text-gray-100"
        >
          <option value="none">No Auth</option>
          <option value="basic">Basic Auth</option>
          <option value="bearer">Bearer Token</option>
          <option value="apiKey">API Key</option>
        </select>
      </div>
      {renderAuthFields()}
    </div>
  );
}
