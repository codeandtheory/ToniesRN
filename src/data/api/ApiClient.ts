type HttpOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: Record<string, string>;
  body?: unknown;
  timeoutMs?: number;
};

const BASE_URL = 'https://jsonplaceholder.typicode.com';

async function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout>;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error('Request timed out')), ms);
  });
  return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timeoutId));
}

export async function http<T>(path: string, { method = 'GET', headers = {}, body, timeoutMs = 10000 }: HttpOptions = {}): Promise<T> {
  const url = `${BASE_URL}${path}`;
  const init: RequestInit = {
    method,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  };

  const doFetch = async () => {
    const res = await fetch(url, init);
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`HTTP ${res.status} ${res.statusText}${text ? `: ${text}` : ''}`);
    }
    const contentType = res.headers.get('content-type') ?? '';
    if (contentType.includes('application/json')) {
      return (await res.json()) as T;
    }
    return (await res.text()) as unknown as T;
  };

  return withTimeout(doFetch(), timeoutMs);
} 