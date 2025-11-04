export interface HttpOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
  signal?: AbortSignal;
}

export async function httpJSON<T = unknown>(url: string, opts: HttpOptions = {}): Promise<T> {
  const isFormData = typeof FormData !== "undefined" && opts.body instanceof FormData;
  const headers: Record<string, string> = {
    ...(opts.headers || {}),
    ...(opts.body && !isFormData ? { "Content-Type": "application/json" } : {}),
  };

  const res = await fetch(url, {
    method: opts.method || "GET",
    headers,
    body: opts.body && !isFormData ? JSON.stringify(opts.body) : opts.body,
    signal: opts.signal,
  });

  const text = await res.text();
  let json: any;
  try { json = text ? JSON.parse(text) : {}; } catch { json = { raw: text }; }

  if (!res.ok) {
    const msg = json?.message || json?.error || res.statusText;
    const err = new Error(`HTTP ${res.status}: ${msg}`);
    (err as any).status = res.status;
    (err as any).data = json;
    throw err;
  }
  return json as T;
}
