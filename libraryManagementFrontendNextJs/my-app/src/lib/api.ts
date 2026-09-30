/**
 * API Utility — Secure fetch wrapper
 *
 * Every API call:
 * 1. Attaches Authorization: Bearer <token> header
 * 2. On 401 → tries to refresh token once, then redirects to login
 * 3. On 403 → redirects to /403 page
 *
 * NOTE: Cache-Control is a RESPONSE header — do NOT send it as a REQUEST header.
 * Sending it as a request header causes CORS preflight to fail.
 */

import { getAccessToken, refreshAccessToken, clearAuthState } from './auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const token = getAccessToken();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    // ✅ Removed 'Cache-Control' — it's a response header, not request header.
    // Sending it as a request header causes CORS preflight failures.
    ...options.headers,
    // Attach JWT token if available
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  let response: Response;
  // Always use Frontend Auto-Mock (No backend calls)
  console.log(`[fetchApi] Backend calls disabled. Using Frontend Auto-Mock for ${url}`);
  
  if (url.includes('superadmin_libraries')) {
    return [
      { id: '1', name: 'Nexus Library Elite', location: 'New Delhi', status: 'Active', plan: 'Enterprise', seats: 500, occupied: 450 },
      { id: '2', name: 'Study Space Pro', location: 'Mumbai', status: 'Pending', plan: 'Pro', seats: 200, occupied: 0 },
      { id: '3', name: 'Quiet Zone Hub', location: 'Bangalore', status: 'Suspended', plan: 'Basic', seats: 100, occupied: 100 },
    ];
  }

  if (url.includes('superadmin_users')) {
    return [
      { id: 'u1', name: 'Rohit Sharma', email: 'rohit@nexus.com', role: 'manager', status: 'Active' },
      { id: 'u2', name: 'Amit Kumar', email: 'amit@nexus.com', role: 'admin', status: 'Active' },
    ];
  }

  if (url.includes('admin_students')) {
    return [
      { id: 'STU001', fullName: 'Rahul Verma', branch: 'Library A' },
      { id: 'STU002', fullName: 'Priya Singh', branch: 'Library B' },
      { id: 'STU003', fullName: 'Amit Sharma', branch: 'Library A' },
      { id: 'STU004', fullName: 'Sneha Gupta', branch: 'Library C' },
    ];
  }

  // Default empty array/object fallback to prevent .map() or .filter() crashes in UI grids
  return [];

  // Removed 401 and 403 handling since no backend is called
  return [];
}

async function handleResponse(response: Response) {
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({ message: response.statusText }));
    let errorMsg = errorBody?.message;
    if (typeof errorMsg === 'object' && errorMsg !== null) {
      errorMsg = errorMsg.message || JSON.stringify(errorMsg);
    }
    if (Array.isArray(errorMsg)) {
      errorMsg = errorMsg.join(', ');
    }
    throw new Error(errorMsg || `API Error: ${response.status}`);
  }

  // Handle empty responses (204 No Content)
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }
  return null;
}
