const BASE_URL = '/api';

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; message?: string }> {
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

    const data = await response.json();
    if (!response.ok) {
      return { success: false, message: data.message || 'Request failed' };
    }
    return { success: true, ...data, data };
  } catch (err: any) {
    console.error(`API Error on ${endpoint}:`, err);
    return { success: false, message: err.message || 'Network error' };
  }
}
