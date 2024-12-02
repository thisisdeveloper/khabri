import React, { useState, useEffect } from 'react';
import { Send } from 'lucide-react';
import { Tab } from './Tab';
import { RequestHeaders } from './RequestHeaders';
import { RequestBody } from './RequestBody';
import { RequestParams } from './RequestParams';
import { RequestAuth } from './RequestAuth';
import { RequestScripts } from './RequestScripts';
import { RequestTests } from './RequestTests';
import { RequestSettings } from './RequestSettings';
import { isValidJson } from '../utils/jsonFormatter';
import { parseQueryString, buildUrl, getBaseUrl } from '../utils/urlParser';
import type { ApiRequest, HttpMethod, QueryParam, AuthConfig } from '../types';

interface RequestFormProps {
  onSubmit: (request: ApiRequest) => void;
  initialRequest?: ApiRequest;
}

type TabType = 'params' | 'auth' | 'headers' | 'body' | 'pre-request' | 'tests' | 'settings';

const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'User-Agent': 'API-Client',
  'Cache-Control': 'no-cache',
};

const DEFAULT_AUTH: AuthConfig = {
  type: 'none',
  config: {},
};

export function RequestForm({ onSubmit, initialRequest }: RequestFormProps) {
  const [method, setMethod] = useState<HttpMethod>(initialRequest?.method || 'GET');
  const [url, setUrl] = useState(initialRequest?.url || '');
  const [activeTab, setActiveTab] = useState<TabType>('params');
  const [headers, setHeaders] = useState<[string, string][]>(
    Object.entries(initialRequest?.headers || DEFAULT_HEADERS)
  );
  const [body, setBody] = useState(initialRequest?.body || '');
  const [params, setParams] = useState<QueryParam[]>(initialRequest?.params || []);
  const [auth, setAuth] = useState<AuthConfig>(initialRequest?.auth || DEFAULT_AUTH);
  const [error, setError] = useState<string>();

  // Update form when initialRequest changes
  useEffect(() => {
    if (initialRequest) {
      setMethod(initialRequest.method as HttpMethod);
      setUrl(initialRequest.url);
      setHeaders(Object.entries(initialRequest.headers));
      setBody(initialRequest.body);
      setParams(initialRequest.params || []);
      setAuth(initialRequest.auth || DEFAULT_AUTH);
    }
  }, [initialRequest]);

  // Update params when URL changes
  useEffect(() => {
    if (url) {
      const newParams = parseQueryString(url);
      if (newParams.length > 0) {
        setParams(newParams);
      }
    }
  }, [url]);

  // Update URL when params change
  useEffect(() => {
    if (url) {
      const baseUrl = getBaseUrl(url);
      const newUrl = buildUrl(baseUrl, params);
      if (newUrl !== url) {
        setUrl(newUrl);
      }
    }
  }, [params]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (body && !isValidJson(body)) {
      setError('Invalid JSON in request body');
      setActiveTab('body');
      return;
    }

    const headersObject = Object.fromEntries(headers.filter(([key]) => key));
    onSubmit({
      id: initialRequest?.id || crypto.randomUUID(),
      method,
      url,
      headers: headersObject,
      body,
      params,
      auth,
      timestamp: Date.now(),
    });
  };

  const handleUrlChange = (newUrl: string) => {
    setUrl(newUrl);
    const newParams = parseQueryString(newUrl);
    if (newParams.length > 0) {
      setParams(newParams);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-2 items-center">
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value as HttpMethod)}
          className="px-3 py-2 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'].map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
        <input
          type="url"
          value={url}
          onChange={(e) => handleUrlChange(e.target.value)}
          placeholder="Enter request URL"
          className="flex-1 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center gap-2"
        >
          <Send size={16} />
          Send
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
          {error}
        </div>
      )}

      <div className="border-b">
        <div className="flex gap-2 -mb-px overflow-x-auto">
          <Tab
            label="Params"
            isActive={activeTab === 'params'}
            onClick={() => setActiveTab('params')}
          />
          <Tab
            label="Authorization"
            isActive={activeTab === 'auth'}
            onClick={() => setActiveTab('auth')}
          />
          <Tab
            label={`Headers (${headers.length})`}
            isActive={activeTab === 'headers'}
            onClick={() => setActiveTab('headers')}
          />
          <Tab
            label="Body"
            isActive={activeTab === 'body'}
            onClick={() => setActiveTab('body')}
          />
          <Tab
            label="Pre-request Script"
            isActive={activeTab === 'pre-request'}
            onClick={() => setActiveTab('pre-request')}
          />
          <Tab
            label="Tests"
            isActive={activeTab === 'tests'}
            onClick={() => setActiveTab('tests')}
          />
          <Tab
            label="Settings"
            isActive={activeTab === 'settings'}
            onClick={() => setActiveTab('settings')}
          />
        </div>
      </div>

      <div className="pt-4">
        {activeTab === 'params' && (
          <RequestParams
            params={params}
            onChange={setParams}
          />
        )}
        {activeTab === 'auth' && (
          <RequestAuth
            auth={auth}
            onAuthChange={setAuth}
          />
        )}
        {activeTab === 'headers' && (
          <RequestHeaders headers={headers} onChange={setHeaders} />
        )}
        {activeTab === 'body' && (
          <RequestBody
            method={method}
            body={body}
            onChange={setBody}
          />
        )}
        {activeTab === 'pre-request' && <RequestScripts />}
        {activeTab === 'tests' && <RequestTests />}
        {activeTab === 'settings' && <RequestSettings />}
      </div>
    </form>
  );
}