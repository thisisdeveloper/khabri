import React from 'react';
import { Play, Plus, Save, FileJson, X } from 'lucide-react';
import { useStore } from '../store';
import { sendRequest } from '../utils/api';
import { Method } from '../types';
import { Editor } from '@monaco-editor/react';
import { formatJSON, isValidJSON } from '../utils/jsonFormatter';
import { Authorization } from './Authorization';

const methods: Method[] = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
const bodyAllowedMethods = ['POST', 'PUT', 'PATCH'];

const editorOptions = {
  minimap: { enabled: false },
  fontSize: 13,
  lineNumbers: 'off',
  folding: false,
  lineDecorationsWidth: 0,
  lineNumbersMinChars: 0,
  automaticLayout: true,
  padding: { top: 8, bottom: 8 },
  scrollBeyondLastLine: false,
  renderLineHighlight: 'none',
  overviewRulerLanes: 0,
  hideCursorInOverviewRuler: true,
  overviewRulerBorder: false,
  scrollbar: {
    vertical: 'hidden',
    horizontal: 'hidden',
  },
};

export function RequestPanel() {
  const {
    tabs,
    activeTab,
    activeSection,
    setActiveTab,
    setActiveSection,
    addTab,
    removeTab,
    updateTab,
    setResponse,
    setIsLoading
  } = useStore();

  const activeRequest = tabs.find(tab => tab.id === activeTab);

  const handleSend = async () => {
    if (!activeRequest) return;
    
    setIsLoading(true);
    setResponse(null);
    
    try {
      const response = await sendRequest(activeRequest);
      setResponse(response);
    } catch (error) {
      console.error('Request failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleParamChange = (index: number, key: string, value: string) => {
    if (!activeRequest) return;
    
    const params = { ...activeRequest.params };
    if (key) {
      params[key] = value;
    }
    
    updateTab(activeRequest.id, { params });
  };

  const handleHeaderChange = (index: number, key: string, value: string) => {
    if (!activeRequest) return;
    
    const headers = { ...activeRequest.headers };
    if (key) {
      headers[key] = value;
    }
    
    updateTab(activeRequest.id, { headers });
  };

  const handleFormatJSON = () => {
    if (!activeRequest || !activeRequest.body) return;
    
    const formatted = formatJSON(activeRequest.body);
    updateTab(activeRequest.id, { body: formatted });
  };

  const handleCloseTab = (e: React.MouseEvent, tabId: string) => {
    e.stopPropagation();
    removeTab(tabId);
  };

  const isBodyEnabled = activeRequest && bodyAllowedMethods.includes(activeRequest.method);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 w-full">
          <select
            value={activeRequest?.method}
            onChange={(e) => {
              if (activeRequest) {
                updateTab(activeRequest.id, { method: e.target.value as Method });
              }
            }}
            className="w-28 px-3 py-1.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400"
          >
            {methods.map(method => (
              <option key={method} value={method}>{method}</option>
            ))}
          </select>
          <div className="flex-1">
            <input
              type="text"
              value={activeRequest?.url || ''}
              onChange={(e) => {
                if (activeRequest) {
                  updateTab(activeRequest.id, { url: e.target.value });
                }
              }}
              placeholder="Enter request URL"
              className="w-full px-3 py-1.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400"
            />
          </div>
          <button 
            onClick={handleSend}
            className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-md text-sm font-medium transition flex items-center gap-2 whitespace-nowrap"
          >
            <Play className="w-4 h-4" />
            Send
          </button>
          <button className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-emerald-500 dark:hover:text-emerald-400">
            <Save className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex items-center px-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex-1 flex">
          {tabs.map(tab => (
            <div
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`group px-4 py-2 text-sm font-medium border-b-2 transition flex items-center gap-2 cursor-pointer ${
                activeTab === tab.id
                  ? 'border-emerald-500 text-emerald-500 dark:text-emerald-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <span>{tab.name}</span>
              {tabs.length > 1 && (
                <div
                  onClick={(e) => handleCloseTab(e, tab.id)}
                  className={`p-0.5 rounded-full opacity-0 group-hover:opacity-100 transition cursor-pointer ${
                    activeTab === tab.id
                      ? 'hover:bg-emerald-100 dark:hover:bg-emerald-900'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <X className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          ))}
        </div>
        <button
          onClick={addTab}
          className="p-2 text-gray-500 dark:text-gray-400 hover:text-emerald-500 dark:hover:text-emerald-400"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4">
        <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveSection('params')}
            className={`px-4 py-2 text-sm font-medium ${
              activeSection === 'params'
                ? 'text-emerald-600 border-b-2 border-emerald-600'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Query Params
          </button>
          <button
            onClick={() => setActiveSection('headers')}
            className={`px-4 py-2 text-sm font-medium ${
              activeSection === 'headers'
                ? 'text-emerald-600 border-b-2 border-emerald-600'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Headers
          </button>
          <button
            onClick={() => setActiveSection('auth')}
            className={`px-4 py-2 text-sm font-medium ${
              activeSection === 'auth'
                ? 'text-emerald-600 border-b-2 border-emerald-600'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Authorization
          </button>
          <button
            onClick={() => setActiveSection('body')}
            className={`px-4 py-2 text-sm font-medium ${
              activeSection === 'body'
                ? 'text-emerald-600 border-b-2 border-emerald-600'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Body
          </button>
        </div>

        <div className="p-4">
          {activeSection === 'params' && (
            <div className="space-y-3">
              {[0, 1].map((i) => (
                <div key={i} className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Key"
                    onChange={(e) => {
                      handleParamChange(i, e.target.value, '');
                    }}
                    className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400"
                  />
                  <input
                    type="text"
                    placeholder="Value"
                    onChange={(e) => {
                      handleParamChange(i, Object.keys(activeRequest?.params || {})[i] || '', e.target.value);
                    }}
                    className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400"
                  />
                </div>
              ))}
              <button className="text-sm text-emerald-500 dark:text-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-300 flex items-center gap-1.5">
                <Plus className="w-4 h-4" />
                Add Row
              </button>
            </div>
          )}

          {activeSection === 'headers' && (
            <div className="space-y-3">
              {[0, 1].map((i) => (
                <div key={i} className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Key"
                    onChange={(e) => {
                      handleHeaderChange(i, e.target.value, '');
                    }}
                    className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400"
                  />
                  <input
                    type="text"
                    placeholder="Value"
                    onChange={(e) => {
                      handleHeaderChange(i, Object.keys(activeRequest?.headers || {})[i] || '', e.target.value);
                    }}
                    className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400"
                  />
                </div>
              ))}
              <button className="text-sm text-emerald-500 dark:text-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-300 flex items-center gap-1.5">
                <Plus className="w-4 h-4" />
                Add Row
              </button>
            </div>
          )}

          {activeSection === 'auth' && (
            <Authorization />
          )}

          {activeSection === 'body' && (
            <div className="space-y-2">
              {isBodyEnabled ? (
                <>
                  <div className="flex justify-end">
                    <button
                      onClick={handleFormatJSON}
                      className="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition flex items-center gap-1.5"
                    >
                      <FileJson className="w-4 h-4" />
                      Format JSON
                    </button>
                  </div>
                  <div className="h-48 border border-gray-200 dark:border-gray-600 rounded-md overflow-hidden">
                    <Editor
                      defaultLanguage="json"
                      value={activeRequest?.body || ''}
                      onChange={(value) => {
                        if (activeRequest) {
                          updateTab(activeRequest.id, { body: value || '' });
                        }
                      }}
                      options={editorOptions}
                      beforeMount={(monaco) => {
                        monaco.editor.defineTheme('khabariLight', {
                          base: 'vs',
                          inherit: true,
                          rules: [],
                          colors: {
                            'editor.background': '#ffffff',
                            'editor.foreground': '#374151',
                          },
                        });
                        monaco.editor.defineTheme('khabariDark', {
                          base: 'vs-dark',
                          inherit: true,
                          rules: [],
                          colors: {
                            'editor.background': '#1f2937',
                            'editor.foreground': '#e5e7eb',
                          },
                        });
                      }}
                      theme={document.documentElement.classList.contains('dark') ? 'khabariDark' : 'khabariLight'}
                    />
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  Body is only available for POST, PUT, and PATCH requests
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}