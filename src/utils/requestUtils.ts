import { RequestTab, AuthConfig, HistoryItem } from '../types';

export function areRequestsEqual(req1: RequestTab, req2: RequestTab): boolean {
  // Compare URLs (ignoring trailing slashes)
  const normalizeUrl = (url: string) => url.replace(/\/$/, '');
  const urlsMatch = normalizeUrl(req1.url) === normalizeUrl(req2.url);
  
  // Compare methods
  const methodsMatch = req1.method === req2.method;
  
  // Compare bodies (accounting for empty or whitespace-only bodies)
  const normalizeBody = (body: string) => body?.trim() || '';
  const bodiesMatch = normalizeBody(req1.body) === normalizeBody(req2.body);
  
  // Compare headers
  const headersMatch = JSON.stringify(req1.headers) === JSON.stringify(req2.headers);
  
  // Compare auth configurations
  const authMatch = JSON.stringify(req1.auth) === JSON.stringify(req2.auth);
  
  return urlsMatch && methodsMatch && bodiesMatch && headersMatch && authMatch;
}

export function isDuplicateRequest(request: RequestTab, items: HistoryItem[]): boolean {
  return items.some(item => areRequestsEqual(item.request, request));
}

export function generateAuthHeaders(auth: AuthConfig): Record<string, string> {
  const headers: Record<string, string> = {};

  switch (auth.type) {
    case 'basic':
      if (auth.config.username && auth.config.password) {
        const credentials = btoa(`${auth.config.username}:${auth.config.password}`);
        headers['Authorization'] = `Basic ${credentials}`;
      }
      break;

    case 'bearer':
      if (auth.config.token) {
        headers['Authorization'] = `Bearer ${auth.config.token}`;
      }
      break;

    case 'apiKey':
      if (auth.config.key && auth.config.value) {
        headers[auth.config.key] = auth.config.value;
      }
      break;
  }

  return headers;
}
