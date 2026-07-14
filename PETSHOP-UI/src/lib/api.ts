const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

export async function fetchApi<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`);
  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }
  const json = await res.json();
  return json.data;
}
