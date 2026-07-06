/**
 * API Utility — Secure fetch wrapper
 *
 * Every API call:
 * 1. Attaches Authorization: Bearer <token> header
 * 2. On 401 → tries to refresh token once, then redirects to login
 * 3. On 403 → redirects to /403 page
 * 4. Sets Cache-Control: no-store to prevent caching of API responses
 */

import { getAccessToken, refreshAccessToken, clearAuthState } from './auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const token = getAccessToken();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store',
    ...options.headers,
    // Attach JWT token if available
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });

  // ── Handle 401 — Token expired → try refresh ─────────────────────────────
  if (response.status === 401) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      // Retry original request with new token
      const retryHeaders = {
        ...headers,
        Authorization: `Bearer ${newToken}`,
      };
      const retryResponse = await fetch(url, {
        ...options,
        headers: retryHeaders,
        credentials: 'include',
      });
      if (retryResponse.status === 401) {
        // Refresh also failed — force logout
        clearAuthState();
        return;
      }
      return handleResponse(retryResponse);
    } else {
      // No refresh token — force logout
      clearAuthState();
      return;
    }
  }

  // ── Handle 403 — Access denied ────────────────────────────────────────────
  if (response.status === 403) {
    if (typeof window !== 'undefined') {
      window.location.href = '/403';
    }
    throw new Error('Access denied: You do not have permission to perform this action.');
  }

  return handleResponse(response);
}

async function handleResponse(response: Response) {
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorBody?.message || `API Error: ${response.status}`);
  }

  // Handle empty responses (204 No Content)
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }
  return null;
}
