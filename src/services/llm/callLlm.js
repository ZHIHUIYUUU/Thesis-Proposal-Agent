import { validateAiConfig } from "./configStore.js";
import { callAnthropicMessages } from "./adapters/anthropicMessages.js";
import { callOpenAiCompatibleChat } from "./adapters/openaiCompatibleChat.js";
import { callOpenAiResponses } from "./adapters/openaiResponses.js";

export async function callLlm(config, prompt, options = {}) {
  const validation = validateAiConfig(config);
  if (!validation.valid) throw new Error(validation.errors.join(" "));
  const normalized = validation.config;
  const fetchImpl = options.fetchImpl || ((url, init) => globalThis.fetch(url, init));
  if (!fetchImpl) throw new Error("当前环境不支持 fetch，无法请求 AI 服务。");

  const timeoutMs = options.timeoutMs || 45000;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const adapterOptions = { ...options, fetchImpl, signal: controller.signal };
    if (normalized.apiStyle === "openai-responses") {
      return await callOpenAiResponses(normalized, prompt, adapterOptions);
    }
    if (normalized.apiStyle === "anthropic-messages") {
      return await callAnthropicMessages(normalized, prompt, adapterOptions);
    }
    if (normalized.apiStyle === "openai-compatible-chat") {
      return await callOpenAiCompatibleChat(normalized, prompt, adapterOptions);
    }
    throw new Error(`不支持的 API 类型：${normalized.apiStyle}`);
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error(`AI 请求超时（${Math.round(timeoutMs / 1000)} 秒）。`);
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
