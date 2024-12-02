import React, { createContext, useContext, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { Tab, TabsContextType, ApiRequest, ApiResponse } from '../types';

const TabsContext = createContext<TabsContextType | undefined>(undefined);

const DEFAULT_TAB: Tab = {
  id: '1',
  title: 'New Request',
  request: {
    id: '1',
    method: 'GET',
    url: '',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: '',
    timestamp: Date.now(),
    params: [],
    auth: {
      type: 'none',
      config: {}
    }
  }
};

export function TabsProvider({ children }: { children: React.ReactNode }) {
  const [tabs, setTabs] = useLocalStorage<Tab[]>('api-client-tabs', [DEFAULT_TAB]);
  const [activeTabId, setActiveTabId] = useLocalStorage<string>('api-client-active-tab', DEFAULT_TAB.id);

  // Ensure there's always at least one tab
  useEffect(() => {
    if (tabs.length === 0) {
      const newTab = { ...DEFAULT_TAB, id: crypto.randomUUID() };
      setTabs([newTab]);
      setActiveTabId(newTab.id);
    }
  }, [tabs, setTabs, setActiveTabId]);

  const addTab = () => {
    const newTab: Tab = {
      id: crypto.randomUUID(),
      title: 'New Request',
      request: {
        ...DEFAULT_TAB.request,
        id: crypto.randomUUID(),
        timestamp: Date.now()
      }
    };
    setTabs(prev => [...prev, newTab]);
    setActiveTabId(newTab.id);
  };

  const closeTab = (id: string) => {
    setTabs(prev => {
      const newTabs = prev.filter(tab => tab.id !== id);
      if (newTabs.length === 0) {
        const newTab = {
          ...DEFAULT_TAB,
          id: crypto.randomUUID(),
          request: { ...DEFAULT_TAB.request, id: crypto.randomUUID() }
        };
        return [newTab];
      }
      return newTabs;
    });

    setActiveTabId(prev => {
      if (prev === id) {
        const index = tabs.findIndex(tab => tab.id === id);
        const newIndex = Math.max(0, index - 1);
        return tabs[newIndex]?.id || tabs[0].id;
      }
      return prev;
    });
  };

  const updateTabRequest = (id: string, request: ApiRequest) => {
    setTabs(prev => prev.map(tab => 
      tab.id === id 
        ? { ...tab, request, title: request.url || 'New Request' }
        : tab
    ));
  };

  const updateTabResponse = (id: string, response: ApiResponse | undefined, error?: string) => {
    setTabs(prev => prev.map(tab => 
      tab.id === id 
        ? { ...tab, response, error }
        : tab
    ));
  };

  return (
    <TabsContext.Provider value={{
      tabs,
      activeTabId,
      addTab,
      closeTab,
      setActiveTab: setActiveTabId,
      updateTabRequest,
      updateTabResponse,
    }}>
      {children}
    </TabsContext.Provider>
  );
}

export function useTabs() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('useTabs must be used within a TabsProvider');
  }
  return context;
}