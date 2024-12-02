import React from 'react';
import { Plus, X } from 'lucide-react';
import { useTabs } from '../contexts/TabsContext';

export function TabBar() {
  const { tabs, activeTabId, addTab, closeTab, setActiveTab } = useTabs();

  return (
    <div className="flex items-center gap-1 border-b border-gray-200 bg-white overflow-x-auto">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          className={`group flex items-center gap-2 px-4 py-2 border-b-2 cursor-pointer min-w-[200px] max-w-[300px] ${
            activeTabId === tab.id
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
          onClick={() => setActiveTab(tab.id)}
        >
          <span className="truncate flex-1 text-sm">
            {tab.title || 'New Request'}
          </span>
          {tabs.length > 1 && (
            <button
              className="opacity-0 group-hover:opacity-100 hover:text-red-500"
              onClick={(e) => {
                e.stopPropagation();
                closeTab(tab.id);
              }}
            >
              <X size={14} />
            </button>
          )}
        </div>
      ))}
      <button
        onClick={addTab}
        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-md"
      >
        <Plus size={20} />
      </button>
    </div>
  );
}