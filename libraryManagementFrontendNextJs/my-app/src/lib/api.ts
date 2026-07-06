// A simple wrapper around fetch to include the backend API URL and default headers.

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  // In a real app, you would attach the JWT token here from localStorage or cookies
  // const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
    // ...(token ? { Authorization: `Bearer ${token}` } : {})
  };

  const response = await fetch(url, { ...options, headers });
  
  if (!response.ok) {
    const errorBody = await response.text().catch(() => null);
    throw new Error(`API Error: ${response.status} - ${errorBody || response.statusText}`);
  }
  
  return response.json();
}
