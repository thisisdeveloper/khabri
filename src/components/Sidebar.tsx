import React, { useState, useEffect } from 'react';
import { Archive, Book, Clock, FolderTree, History, Search, Settings } from 'lucide-react';
import { ContextMenu } from './ContextMenu';

interface MenuItem {
  id: string;
  label: string;
  type: 'collection' | 'request' | 'saved' | 'recent';
  parentId?: string;
}

export const Sidebar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; item: MenuItem } | null>(null);
  const [items, setItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    const storedItems = localStorage.getItem('collections');
    if (storedItems) {
      setItems(JSON.parse(storedItems));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('collections', JSON.stringify(items));
  }, [items]);

  const filteredItems = items.filter(item => 
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleContextMenu = (e: React.MouseEvent, item: MenuItem) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      item
    });
  };

  const handleAction = (action: string) => {
    if (!contextMenu) return;

    switch (action) {
      case 'duplicate':
        setItems(prev => [
          ...prev,
          { 
            id: Date.now().toString(),
            label: `${contextMenu.item.label} (Copy)`,
            type: contextMenu.item.type,
            parentId: contextMenu.item.parentId
          }
        ]);
        break;
      case 'delete':
        setItems(prev => prev.filter(item => 
          item.id !== contextMenu.item.id && item.parentId !== contextMenu.item.id
        ));
        break;
      case 'rename':
        const newName = prompt('Enter new name:', contextMenu.item.label);
        if (newName) {
          setItems(prev => prev.map(item => 
            item.id === contextMenu.item.id ? { ...item, label: newName } : item
          ));
        }
        break;
    }
  };

  const renderCollectionItems = () => {
    const collections = filteredItems.filter(item => item.type === 'collection');
    
    return collections.map(collection => (
      <div key={collection.id} className="space-y-1">
        <button
          onContextMenu={(e) => handleContextMenu(e, collection)}
          className="w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition flex items-center gap-2"
        >
          <FolderTree className="w-4 h-4 text-gray-400" />
          {collection.label}
        </button>
        <div className="ml-6 space-y-1">
          {filteredItems
            .filter(item => item.parentId === collection.id)
            .map(child => (
              <button
                key={child.id}
                onContextMenu={(e) => handleContextMenu(e, child)}
                className="w-full text-left px-3 py-1.5 text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition"
              >
                {child.label}
              </button>
            ))}
        </div>
      </div>
    ));
  };

  return (
    <div className="w-64 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col">
      <div className="p-4">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search requests..."
            className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400"
          />
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-6">
        <div className="space-y-2">
          <div className="px-3 mb-2 flex items-center justify-between">
            <div className="flex items-center">
              <Book className="w-4 h-4 mr-2 text-gray-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Collections</span>
            </div>
            <button className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
              <Settings className="w-4 h-4" />
            </button>
          </div>
          {renderCollectionItems()}
        </div>

        <div>
          <div className="px-3 mb-2 flex items-center">
            <Archive className="w-4 h-4 mr-2 text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Saved Requests</span>
          </div>
          {filteredItems
            .filter(item => item.type === 'saved')
            .map((item) => (
              <button
                key={item.id}
                onContextMenu={(e) => handleContextMenu(e, item)}
                className="w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition"
              >
                {item.label}
              </button>
            ))}
        </div>

        <div>
          <div className="px-3 mb-2 flex items-center">
            <History className="w-4 h-4 mr-2 text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Recent</span>
          </div>
          <div className="space-y-1">
            {filteredItems
              .filter(item => item.type === 'recent')
              .map((item) => (
                <button
                  key={item.id}
                  onContextMenu={(e) => handleContextMenu(e, item)}
                  className="w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition flex items-center gap-2"
                >
                  <Clock className="w-3.5 h-3.5" />
                  {item.label}
                </button>
              ))}
          </div>
        </div>
      </nav>

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
          onAction={handleAction}
        />
      )}
    </div>
  );
};