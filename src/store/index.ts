import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { RequestTab, ResponseData, Method, QueryParam, AuthConfig } from '../types';
import { generateAuthHeaders } from '../utils/requestUtils';
import { buildUrl } from '../utils/urlUtils';

interface AppState {
  tabs: RequestTab[];
  activeTab: string;
  activeSection: 'params' | 'headers' | 'body' | 'auth';
  response: ResponseData | null;
  isLoading: boolean;
  history: RequestTab[];
  addTab: () => void;
  removeTab: (id: string) => void;
  updateTab: (id: string, updates: Partial<RequestTab>) => void;
  setActiveTab: (id: string) => void;
  setActiveSection: (section: 'params' | 'headers' | 'body' | 'auth') => void;
  setResponse: (response: ResponseData | null) => void;
  setIsLoading: (loading: boolean) => void;
  addToHistory: (request: RequestTab) => void;
}

const DEFAULT_REQUEST: Partial<RequestTab> = {
  method: 'GET',
  url: '',
  params: [],
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  body: '',
  auth: {
    type: 'none',
    config: {}
  }
};

const DEFAULT_STATE = {
  tabs: [{
    id: '1',
    name: 'New Request',
    ...DEFAULT_REQUEST,
    timestamp: Date.now()
  } as RequestTab],
  activeTab: '1',
  activeSection: 'params' as const,
  response: null,
  isLoading: false,
  history: []
};

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      ...DEFAULT_STATE,

      addTab: () => set((state) => {
        const newTab: RequestTab = {
          id: (state.tabs.length + 1).toString(),
          name: `New Request ${state.tabs.length + 1}`,
          ...DEFAULT_REQUEST,
          timestamp: Date.now()
        } as RequestTab;
        return {
          tabs: [...state.tabs, newTab],
          activeTab: newTab.id
        };
      }),

      removeTab: (id) => set((state) => {
        if (state.tabs.length === 1) return state;
        const newTabs = state.tabs.filter(tab => tab.id !== id);
        return {
          tabs: newTabs,
          activeTab: state.activeTab === id ? newTabs[0].id : state.activeTab
        };
      }),

      updateTab: (id, updates) => set((state) => ({
        tabs: state.tabs.map(tab =>
          tab.id === id ? { ...tab, ...updates } : tab
        )
      })),

      setActiveTab: (id) => set({ activeTab: id }),
      setActiveSection: (section) => set({ activeSection: section }),
      setResponse: (response) => set({ response }),
      setIsLoading: (loading) => set({ isLoading: loading }),
      
      addToHistory: (request) => set((state) => ({
        history: [request, ...state.history].slice(0, 50) // Keep last 50 requests
      }))
    }),
    {
      name: 'khabari-storage',
      partialize: (state) => ({
        tabs: state.tabs,
        history: state.history
      })
    }
  )
);