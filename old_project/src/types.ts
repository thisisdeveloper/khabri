import type { ReactNode } from 'react';

export interface ApiRequest {
  id: string;
  url: string;
  method: string;
  headers: Record<string, string>;
  body: string;
  timestamp: number;
  params?: QueryParam[];
  auth?: AuthConfig;
}

export interface ApiResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  data: any;
  timestamp: number;
}

export interface HistoryItem {
  request: ApiRequest;
  response?: ApiResponse;
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';

export interface QueryParam {
  key: string;
  value: string;
  enabled: boolean;
}

export type AuthType = 'none' | 'basic' | 'bearer' | 'apiKey';

export interface AuthConfig {
  type: AuthType;
  config: Record<string, string>;
}

export interface Tab {
  id: string;
  title: string;
  request?: ApiRequest;
  response?: ApiResponse;
  error?: string;
}

export interface TabsContextType {
  tabs: Tab[];
  activeTabId: string;
  addTab: () => void;
  closeTab: (id: string) => void;
  setActiveTab: (id: string) => void;
  updateTabRequest: (id: string, request: ApiRequest) => void;
  updateTabResponse: (id: string, response: ApiResponse | undefined, error?: string) => void;
}