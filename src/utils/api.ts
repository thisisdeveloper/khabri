import { RequestTab, ResponseData } from '../types';
import { generateAuthHeaders } from './requestUtils';
import { buildUrl } from './urlUtils';

export async function sendRequest(request: RequestTab): Promise<ResponseData> {
  const startTime = performance.now();
  
  try {
    // Build the final URL with query parameters
    const url = buildUrl(request.url, request.params);

    // Merge authentication headers with request headers
    const authHeaders = generateAuthHeaders(request.auth);
    const headers = { ...request.headers, ...authHeaders };

    // Prepare the request options
    const options: RequestInit = {
      method: request.method,
      headers,
    };

    // Add body for appropriate methods
    if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
      options.body = request.body;
    }

    // Send the request
    const response = await fetch(url, options);
    const data = await response.json();
    
    // Calculate response time and size
    const endTime = performance.now();
    const time = endTime - startTime;
    
    // Get response size
    const size = new Blob([JSON.stringify(data)]).size;
    const sizeStr = size > 1024 ? `${(size / 1024).toFixed(2)} KB` : `${size} B`;

    // Get response headers
    const responseHeaders: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });

    return {
      status: response.status,
      statusText: response.statusText,
      data,
      headers: responseHeaders,
      time,
      size: sizeStr,
      timestamp: Date.now()
    };
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to send request');
  }
}