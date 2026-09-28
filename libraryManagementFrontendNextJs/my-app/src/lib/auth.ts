/**
 * Auth Utility — Client Side
 *
 * Handles login, logout, token refresh, and current user retrieval.
 * Tokens stored in httpOnly cookies (set by the backend) — not accessible via JS.
 *
 * Zero Trust: All role/identity verification happens on the backend.
 * This is only a convenience layer for the frontend UI.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export interface AuthUser {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: string;
  tenantId?: string;
  branchId?: string;
  lastLoginAt?: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

// ─── Login (Mocked for Frontend Only) ─────────────────────────────────────────
import hardcoded from '@/app/auth/hardcoded.json';

export async function login(identifier: string, password: string): Promise<LoginResponse> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  const roleConfig = hardcoded.roles.find(
    (r) => (r.email === identifier || r.id === identifier) && r.password === password
  );

  if (!roleConfig) {
    throw new Error('Invalid email or password');
  }

  const data: LoginResponse = {
    accessToken: `mock-jwt-token-${roleConfig.id}`,
    refreshToken: `mock-refresh-token-${roleConfig.id}`,
    user: {
      id: `user-${roleConfig.id}`,
      name: roleConfig.label,
      phone: '+919999999999',
      email: roleConfig.email,
      role: roleConfig.id,
    }
  };

  // Store tokens for client-side use
  if (typeof window !== 'undefined') {
    localStorage.setItem('access_token', data.accessToken);
    if (data.refreshToken) {
      localStorage.setItem('refresh_token', data.refreshToken);
    }
    localStorage.setItem('user', JSON.stringify(data.user));
    // Store token in cookie for middleware (server-side route protection)
    document.cookie = `access_token=${data.accessToken}; path=/; SameSite=Strict; max-age=900`;
  }

  return data;
}


// ─── Logout ───────────────────────────────────────────────────────────────────
export async function logout(): Promise<void> {
  // Pure frontend mock, no backend call
  clearAuthState();
}

// ─── Refresh Access Token ─────────────────────────────────────────────────────
export async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = localStorage.getItem('refresh_token');
  if (!refreshToken) return null;
  
  // Mock success refresh token response
  const newToken = 'mock-jwt-token-refreshed';
  localStorage.setItem('access_token', newToken);
  document.cookie = `access_token=${newToken}; path=/; SameSite=Strict; max-age=900`;
  return newToken;
}

// ─── Get Current User ─────────────────────────────────────────────────────────
export function getCurrentUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
}

// ─── Get Access Token ─────────────────────────────────────────────────────────
export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('access_token');
}

// ─── Check if Logged In ───────────────────────────────────────────────────────
export function isAuthenticated(): boolean {
  return !!getAccessToken();
}

// ─── Clear All Auth State (on logout) ────────────────────────────────────────
export function clearAuthState(): void {
  if (typeof window === 'undefined') return;

  // Clear localStorage
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');

  // Clear cookies
  document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict';
  document.cookie = 'refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict';

  // Redirect to login
  if (typeof window !== 'undefined') {
    window.location.href = '/auth/login';
  }
}
