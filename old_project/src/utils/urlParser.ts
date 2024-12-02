import type { QueryParam } from '../types';

export function parseQueryString(url: string): QueryParam[] {
  try {
    const urlObj = new URL(url);
    const params: QueryParam[] = [];
    
    urlObj.searchParams.forEach((value, key) => {
      params.push({
        key,
        value,
        enabled: true
      });
    });
    
    return params;
  } catch {
    return [];
  }
}

export function buildQueryString(params: QueryParam[]): string {
  const enabledParams = params.filter(param => param.enabled && param.key);
  if (enabledParams.length === 0) return '';
  
  const searchParams = new URLSearchParams();
  enabledParams.forEach(param => {
    searchParams.append(param.key, param.value);
  });
  return searchParams.toString();
}

export function buildUrl(baseUrl: string, params: QueryParam[]): string {
  try {
    const url = new URL(baseUrl);
    const queryString = buildQueryString(params);
    return `${url.origin}${url.pathname}${queryString ? `?${queryString}` : ''}`;
  } catch {
    return baseUrl;
  }
}

export function getBaseUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    return `${urlObj.origin}${urlObj.pathname}`;
  } catch {
    return url;
  }
}