import React from 'react';
import { CheckCircle, Clock, Code, Download, FileJson, Image, Table, X, XCircle } from 'lucide-react';
import { useStore } from '../store';

export function ResponsePanel() {
  const { response, isLoading } = useStore();
  const [view, setView] = React.useState<'preview' | 'raw' | 'headers'>('preview');
  const [format, setFormat] = React.useState<'json' | 'table' | 'image'>('json');

  if (!response && !isLoading) return null;

  const isSuccess = response?.status >= 200 && response?.status < 300;

  const renderTableView = (data: any) => {
    if (typeof data !== 'object' || data === null) {
      return (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          Data cannot be displayed as a table. Use JSON view instead.
        </div>
      );
    }

    // If data is an array, use the first item as template
    const isArray = Array.isArray(data);
    const template = isArray ? data[0] : data;
    const items = isArray ? data : [data];

    if (!template || typeof template !== 'object') {
      return (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          Data cannot be displayed as a table. Use JSON view instead.
        </div>
      );
    }

    const columns = Object.keys(template);

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              {columns.map((column) => (
                <th
                  key={column}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {items.map((item, index) => (
              <tr key={index}>
                {columns.map((column) => (
                  <td
                    key={column}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100"
                  >
                    {typeof item[column] === 'object'
                      ? JSON.stringify(item[column])
                      : String(item[column] ?? '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-indigo-500 border-t-transparent" />
              <span className="text-sm font-medium">Sending request...</span>
            </div>
          ) : response && (
            <>
              <div className="flex items-center gap-2">
                {isSuccess ? (
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
                <span className="text-sm font-medium">
                  {response.status} {response.statusText}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <Clock className="w-4 h-4" />
                <span className="text-sm">{response.time}ms</span>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Size: {response.size}
              </div>
            </>
          )}
        </div>
        {!isLoading && response && (
          <div className="flex items-center gap-2">
            <div className="flex overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
              {[
                { icon: Code, value: 'raw' },
                { icon: FileJson, value: 'preview' },
                { icon: Table, value: 'headers' }
              ].map(({ icon: Icon, value }) => (
                <button
                  key={value}
                  onClick={() => setView(value as typeof view)}
                  className={`p-2 transition ${
                    view === value
                      ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500 dark:text-indigo-400'
                      : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
            <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition">
              <Download className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {!isLoading && response && (
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {view === 'preview' && (
            <div className="p-4">
              <div className="flex items-center gap-2 mb-4">
                {[
                  { icon: FileJson, value: 'json' },
                  { icon: Table, value: 'table' },
                  { icon: Image, value: 'image' }
                ].map(({ icon: Icon, value }) => (
                  <button
                    key={value}
                    onClick={() => setFormat(value as typeof format)}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition flex items-center gap-1.5 ${
                      format === value
                        ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500 dark:text-indigo-400'
                        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {value.charAt(0).toUpperCase() + value.slice(1)}
                  </button>
                ))}
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 font-mono text-sm overflow-auto max-h-[400px]">
                {format === 'json' ? (
                  <pre className="text-gray-800 dark:text-gray-200">
                    {JSON.stringify(response.data, null, 2)}
                  </pre>
                ) : format === 'table' ? (
                  renderTableView(response.data)
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    Image preview is not supported for this response
                  </div>
                )}
              </div>
            </div>
          )}

          {view === 'raw' && (
            <div className="p-4">
              <pre className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 font-mono text-sm overflow-auto max-h-[400px] text-gray-800 dark:text-gray-200">
                {JSON.stringify(response, null, 2)}
              </pre>
            </div>
          )}

          {view === 'headers' && (
            <div className="p-4">
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg divide-y divide-gray-200 dark:divide-gray-700 font-mono text-sm overflow-hidden">
                {Object.entries(response.headers).map(([key, value]) => (
                  <div key={key} className="flex">
                    <div className="w-1/3 px-4 py-2 font-medium text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-800">
                      {key}
                    </div>
                    <div className="w-2/3 px-4 py-2 text-gray-800 dark:text-gray-200">
                      {value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}