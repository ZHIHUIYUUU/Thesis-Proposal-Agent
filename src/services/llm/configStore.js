import { normalizeProviderConfig } from "./providerPresets.js";

export const AI_CONFIG_STORAGE_KEY = "graduate-proposal-ai-config";

export function validateAiConfig(config) {
  const normalized = normalizeProviderConfig(config);
  const errors = [];
  if (!normalized.apiKey) errors.push("请填写 API Key。");
  if (!normalized.baseUrl) errors.push("请填写 Base URL。");
  if (!normalized.model) errors.push("请填写模型 ID。");
  return { valid: errors.length === 0, errors, config: normalized };
}

export function loadAiConfig(storage = getDefaultStorage()) {
  if (!storage) return null;
  try {
    const raw = storage.getItem(AI_CONFIG_STORAGE_KEY);
    if (!raw) return null;
    return normalizeProviderConfig(JSON.parse(raw));
  } catch {
    return null;
  }
}

export function saveAiConfig(config, storage = getDefaultStorage()) {
  if (!storage) throw new Error("当前环境不支持本地存储。");
  const validation = validateAiConfig(config);
  if (!validation.valid) {
    throw new Error(validation.errors.join(" "));
  }
  storage.setItem(AI_CONFIG_STORAGE_KEY, JSON.stringify(validation.config));
  return validation.config;
}

export function clearAiConfig(storage = getDefaultStorage()) {
  storage?.removeItem(AI_CONFIG_STORAGE_KEY);
}

function getDefaultStorage() {
  return typeof window === "undefined" ? null : window.localStorage;
}
