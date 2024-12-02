import React from 'react';
import { ArrowRight, Save } from 'lucide-react';
import type { HistoryItem as HistoryItemType } from '../types';

interface HistoryItemProps {
  item: HistoryItemType;
  onSelect: (item: HistoryItemType) => void;
  onSave: (item: HistoryItemType) => void;
  isSaved: boolean;
}

export function HistoryItem({ item, onSelect, onSave, isSaved }: HistoryItemProps) {
  const date = new Date(item.request.timestamp);
  const isSuccess = item.response && item.response.status >= 200 && item.response.status < 300;

  return (
    <div className="group relative p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className={`shrink-0 px-2 py-0.5 text-xs rounded ${
            item.response
              ? isSuccess
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
              : 'bg-gray-100 text-gray-800'
          }`}>
            {item.request.method}
          </span>
          <span className="text-sm font-mono truncate flex-1">
            {item.request.url}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onSave(item)}
              disabled={isSaved}
              className={`p-1 rounded-md ${
                isSaved
                  ? 'text-blue-400 cursor-not-allowed'
                  : 'text-blue-600 hover:text-blue-800 hover:bg-blue-100'
              }`}
            >
              <Save size={16} />
            </button>
            <button
              type="button"
              onClick={() => onSelect(item)}
              className="text-gray-400 hover:text-gray-600"
            >
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
        <div className="text-xs text-gray-500">
          {date.toLocaleString()}
        </div>
      </div>
    </div>
  );
}