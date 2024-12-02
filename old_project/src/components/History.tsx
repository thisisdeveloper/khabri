import React, { useState } from 'react';
import { Clock, Bookmark } from 'lucide-react';
import type { HistoryItem } from '../types';
import { Tab } from './Tab';
import { SavedRequests } from './SavedRequests';
import { HistoryItem as HistoryItemComponent } from './HistoryItem';

interface HistoryProps {
  items: HistoryItem[];
  savedRequests: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onSave: (item: HistoryItem) => void;
  onRemoveSaved: (id: string) => void;
  onClear: () => void;
}

type TabType = 'history' | 'saved';

export function History({ items, savedRequests, onSelect, onSave, onRemoveSaved, onClear }: HistoryProps) {
  const [activeTab, setActiveTab] = useState<TabType>('history');

  const renderHistoryContent = () => {
    if (items.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          <Clock size={40} className="mx-auto mb-2 opacity-50" />
          <p>No request history yet</p>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        {items.map((item) => (
          <HistoryItemComponent
            key={item.request.id}
            item={item}
            onSelect={onSelect}
            onSave={onSave}
            isSaved={savedRequests.some(saved => saved.request.id === item.request.id)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4 sticky top-0 bg-white z-10 pb-2">
        <div className="flex gap-2">
          <Tab
            label="History"
            isActive={activeTab === 'history'}
            onClick={() => setActiveTab('history')}
          />
          <Tab
            label="Saved"
            isActive={activeTab === 'saved'}
            onClick={() => setActiveTab('saved')}
          />
        </div>
        {activeTab === 'history' && items.length > 0 && (
          <button
            onClick={onClear}
            className="px-3 py-1 text-sm text-red-600 hover:text-red-800 rounded-md hover:bg-red-50"
          >
            Clear History
          </button>
        )}
      </div>

      <div className="overflow-y-auto flex-1 -mx-6 px-6">
        {activeTab === 'history' ? (
          renderHistoryContent()
        ) : (
          <SavedRequests
            items={savedRequests}
            onSelect={onSelect}
            onRemove={onRemoveSaved}
          />
        )}
      </div>
    </div>
  );
}