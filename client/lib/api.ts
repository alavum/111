export async function safeFetchJSON(url: string, options: RequestInit = {}, timeout = 7000) {
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    if (!res.ok) {
      console.warn(`safeFetchJSON: ${url} returned status ${res.status}`);
      return null;
    }
    const json = await res.json();
    return json;
  } catch (err: any) {
    if (err.name === 'AbortError') {
      console.warn(`safeFetchJSON: ${url} aborted after ${timeout}ms`);
    } else {
      console.warn(`safeFetchJSON: error fetching ${url}:`, err);
    }
    return null;
  }
}
