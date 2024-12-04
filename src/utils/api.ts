import { RequestTab, ResponseData } from '../types';
import { generateAuthHeaders } from './requestUtils';
import { buildUrl } from './urlUtils';

export async function sendRequest(request: RequestTab): Promise<ResponseData> {
  const startTime = performance.now();
  
  try {
    // Build the final URL with query parameters
    const url = buildUrl(request.url, request.params);

    // Initialize headers with request headers
    const requestHeaders = new Headers();
    
    // Add default headers
    Object.entries(request.headers).forEach(([key, value]) => {
      requestHeaders.set(key, value);
    });

    // Add auth headers if configured
    const authHeaders = generateAuthHeaders(request.auth);
    Object.entries(authHeaders).forEach(([key, value]) => {
      requestHeaders.set(key, value);
    });

    // Add CORS headers
    requestHeaders.set('Access-Control-Allow-Origin', '*');
    requestHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    requestHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Convert Headers back to plain object for fetch
    const headers: Record<string, string> = {};
    requestHeaders.forEach((value, key) => {
      headers[key] = value;
    });

    // Prepare the request options
    const options: RequestInit = {
      method: request.method,
      headers,
      mode: 'cors',
      credentials: 'omit', // Try with 'omit' first
      cache: 'no-cache',
      redirect: 'follow',
    };

    // Add body for appropriate methods
    if (['POST', 'PUT', 'PATCH'].includes(request.method) && request.body) {
      options.body = request.body;
    }

    // For OPTIONS preflight request
    if (request.method === 'OPTIONS') {
      return {
        status: 200,
        statusText: 'OK',
        data: null,
        headers: headers,
        time: 0,
        size: '0 B',
        timestamp: Date.now()
      };
    }

    // Send the request
    console.log('Sending request with headers:', headers); // Debug log
    const response = await fetch(url, options);
    
    // Handle response based on content type
    let data;
    const contentType = response.headers.get('content-type');
    try {
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }
    } catch (error) {
      console.warn('Failed to parse response:', error);
      data = await response.text();
    }
    
    // Calculate response time and size
    const endTime = performance.now();
    const time = endTime - startTime;
    
    // Get response size
    const size = new Blob([typeof data === 'string' ? data : JSON.stringify(data)]).size;
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
    console.error('Request failed:', error); // Debug log
    throw new Error(error instanceof Error ? error.message : 'Failed to send request');
  }
}