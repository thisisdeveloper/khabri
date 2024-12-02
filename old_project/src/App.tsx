import React from 'react';
import { Code2 } from 'lucide-react';
import { RequestForm } from './components/RequestForm';
import { ResponseView } from './components/ResponseView';
import { History } from './components/History';
import { TabBar } from './components/TabBar';
import { useLocalStorage } from './hooks/useLocalStorage';
import { isDuplicateRequest } from './utils/requestUtils';
import { TabsProvider, useTabs } from './contexts/TabsContext';
import type { ApiRequest, ApiResponse, HistoryItem } from './types';

function MainContent() {
  const { activeTabId, tabs, updateTabRequest, updateTabResponse } = useTabs();
  const [history, setHistory] = useLocalStorage<HistoryItem[]>('api-client-history', []);
  const [savedRequests, setSavedRequests] = useLocalStorage<HistoryItem[]>('saved-requests', []);

  const activeTab = tabs.find(tab => tab.id === activeTabId);

  const handleRequest = async (request: ApiRequest) => {
    updateTabResponse(activeTabId, undefined);

    try {
      const response = await fetch(request.url, {
        method: request.method,
        headers: {
          ...request.headers,
          ...(request.auth?.type === 'bearer' && request.auth.config.token
            ? { Authorization: `Bearer ${request.auth.config.token}` }
            : {}),
          ...(request.auth?.type === 'basic' && request.auth.config.username
            ? { Authorization: `Basic ${btoa(`${request.auth.config.username}:${request.auth.config.password}`)}` }
            : {}),
          ...(request.auth?.type === 'apiKey' && request.auth.config.key && request.auth.config.value && request.auth.config.location === 'header'
            ? { [request.auth.config.key]: request.auth.config.value }
            : {})
        },
        body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : undefined,
      });

      const responseHeaders: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });

      let data;
      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      const apiResponse: ApiResponse = {
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders,
        data,
        timestamp: Date.now(),
      };

      updateTabResponse(activeTabId, apiResponse);
      
      if (!isDuplicateRequest(request, history)) {
        setHistory((prev) => [{
          request,
          response: apiResponse,
        }, ...prev]);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      updateTabResponse(activeTabId, undefined, errorMessage);
      
      if (!isDuplicateRequest(request, history)) {
        setHistory((prev) => [{
          request,
        }, ...prev]);
      }
    }
  };

  const handleHistorySelect = (item: HistoryItem) => {
    updateTabRequest(activeTabId, item.request);
    if (item.response) {
      updateTabResponse(activeTabId, item.response);
    }
  };

  const handleSaveRequest = (item: HistoryItem) => {
    if (!isDuplicateRequest(item.request, savedRequests)) {
      setSavedRequests((prev) => [item, ...prev]);
    }
  };

  const handleRemoveSaved = (id: string) => {
    setSavedRequests((prev) => prev.filter(item => item.request.id !== id));
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Code2 size={24} className="text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">API Client</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <TabBar />
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white shadow rounded-lg p-6">
              <RequestForm
                onSubmit={handleRequest}
                initialRequest={activeTab?.request}
              />
            </div>

            {(activeTab?.response || activeTab?.error) && (
              <div className="bg-white shadow rounded-lg p-6">
                <ResponseView
                  response={activeTab.response}
                  error={activeTab.error}
                />
              </div>
            )}
          </div>

          <div className="bg-white shadow rounded-lg p-6 h-[calc(100vh-8rem)] flex flex-col">
            <History
              items={history}
              savedRequests={savedRequests}
              onSelect={handleHistorySelect}
              onSave={handleSaveRequest}
              onRemoveSaved={handleRemoveSaved}
              onClear={handleClearHistory}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <TabsProvider>
      <MainContent />
    </TabsProvider>
  );
}

export default App;