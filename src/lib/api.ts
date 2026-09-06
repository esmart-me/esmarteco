import { clientStore } from './clientDb.js';

const BASE_URL = '/api';
const isGitHubPages = typeof window !== 'undefined' && window.location.hostname.includes('github.io');

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; message?: string; [key: string]: any }> {
  // If hosted on static GitHub Pages, handle immediately via in-memory store
  if (isGitHubPages) {
    const res = clientStore.handleRequest(endpoint, options);
    return Promise.resolve(res);
  }

  const token = localStorage.getItem('esmart_token');
  const adminKey = localStorage.getItem('esmart_admin_key');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  if (adminKey) {
    headers['x-admin-key'] = adminKey;
    headers['x-admin-access'] = 'true';
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      // Fallback to clientStore if endpoint error
      const fallback = clientStore.handleRequest(endpoint, options);
      return Promise.resolve(fallback);
    }

    const data = await response.json();
    return { success: true, ...data, data };
  } catch (err) {
    // Network fetch failed (e.g. backend server down), fallback gracefully to clientStore
    const fallback = clientStore.handleRequest(endpoint, options);
    return Promise.resolve(fallback);
  }
}
