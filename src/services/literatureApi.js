import { normalizeOpenAlexWork } from "../engine.js";

export async function searchOpenAlex(url, fetchImpl = fetch, options = {}) {
  const timeoutMs = options.timeoutMs || 15000;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  let payload;
  try {
    const response = await fetchImpl(url, { signal: controller.signal });
    if (!response.ok) {
      throw new Error(`OpenAlex 返回 ${response.status}`);
    }
    payload = await response.json();
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error(`OpenAlex 请求超时（${Math.round(timeoutMs / 1000)} 秒）`);
    }
    if (error.message?.startsWith("OpenAlex 返回")) {
      throw error;
    }
    throw new Error(`无法连接 OpenAlex：${error.message}`);
  } finally {
    clearTimeout(timeoutId);
  }
  const works = Array.isArray(payload.results) ? payload.results.map(normalizeOpenAlexWork).slice(0, 10) : [];
  return {
    works,
    meta: payload.meta || { count: works.length },
    url,
  };
}
