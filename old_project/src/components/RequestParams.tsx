import React from 'react';
import { Plus, Minus } from 'lucide-react';
import type { QueryParam } from '../types';

interface RequestParamsProps {
  params: QueryParam[];
  onChange: (params: QueryParam[]) => void;
}

export function RequestParams({ params, onChange }: RequestParamsProps) {
  const addParam = () => {
    onChange([...params, { key: '', value: '', enabled: true }]);
  };

  const removeParam = (index: number) => {
    const newParams = [...params];
    newParams.splice(index, 1);
    onChange(newParams);
  };

  const updateParam = (index: number, field: keyof QueryParam, value: string | boolean) => {
    const newParams = [...params];
    newParams[index] = { ...newParams[index], [field]: value };
    onChange(newParams);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Query Parameters</h3>
        <button
          type="button"
          onClick={addParam}
          className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md"
        >
          <Plus size={20} />
        </button>
      </div>

      <div className="space-y-2">
        {params.length === 0 ? (
          <p className="text-gray-500 text-sm">No parameters added yet</p>
        ) : (
          params.map((param, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={param.enabled}
                onChange={(e) => updateParam(index, 'enabled', e.target.checked)}
                className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <input
                type="text"
                value={param.key}
                onChange={(e) => updateParam(index, 'key', e.target.value)}
                placeholder="Parameter name"
                className="flex-1 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="text"
                value={param.value}
                onChange={(e) => updateParam(index, 'value', e.target.value)}
                placeholder="Value"
                className="flex-1 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="button"
                onClick={() => removeParam(index)}
                className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md"
              >
                <Minus size={20} />
              </button>
            </div>
          ))
        )}
      </div>

      <div className="text-sm text-gray-500">
        <p>Parameters will be automatically added to the URL when enabled</p>
      </div>
    </div>
  );
}