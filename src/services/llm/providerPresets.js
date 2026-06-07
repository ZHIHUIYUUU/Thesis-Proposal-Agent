export const providerPresets = [
  {
    id: "openai",
    label: "OpenAI / Codex",
    description: "支持 OpenAI API 与 Codex 相关模型 ID，使用 Responses API。",
    apiStyle: "openai-responses",
    defaultBaseUrl: "https://api.openai.com/v1",
    defaultModel: "gpt-4.1-mini",
    modelHint: "例如 gpt-4.1-mini、gpt-4.1 或你的 Codex 模型 ID",
    baseUrlEditable: true,
  },
  {
    id: "anthropic",
    label: "Claude / Anthropic",
    description: "支持 Claude Messages API。",
    apiStyle: "anthropic-messages",
    defaultBaseUrl: "https://api.anthropic.com",
    defaultModel: "claude-sonnet-4-6",
    modelHint: "例如 claude-sonnet-4-6",
    baseUrlEditable: true,
  },
  {
    id: "deepseek",
    label: "DeepSeek",
    description: "使用 OpenAI 兼容 Chat Completions 接口。",
    apiStyle: "openai-compatible-chat",
    defaultBaseUrl: "https://api.deepseek.com",
    defaultModel: "deepseek-v4-pro",
    modelHint: "例如 deepseek-v4-pro 或 deepseek-v4-flash",
    baseUrlEditable: true,
  },
  {
    id: "xiaomi",
    label: "小米 / MiLM",
    description: "按 OpenAI 兼容接口接入；请填写小米平台提供的 Base URL 和模型 ID。",
    apiStyle: "openai-compatible-chat",
    defaultBaseUrl: "",
    defaultModel: "",
    modelHint: "填写小米平台的模型 ID",
    baseUrlEditable: true,
  },
  {
    id: "custom",
    label: "自定义兼容接口",
    description: "适用于其他 OpenAI 兼容 API 服务。",
    apiStyle: "openai-compatible-chat",
    defaultBaseUrl: "",
    defaultModel: "",
    modelHint: "填写服务商提供的模型 ID",
    baseUrlEditable: true,
  },
];

export function getProviderPreset(provider) {
  return providerPresets.find((preset) => preset.id === provider) || providerPresets[0];
}

export function normalizeProviderConfig(config = {}) {
  const provider = String(config.provider || "openai").trim();
  const preset = getProviderPreset(provider);
  return {
    provider: preset.id,
    label: preset.label,
    apiStyle: preset.apiStyle,
    apiKey: String(config.apiKey || "").trim(),
    baseUrl: trimTrailingSlash(config.baseUrl || preset.defaultBaseUrl || ""),
    model: String(config.model || preset.defaultModel || "").trim(),
  };
}

function trimTrailingSlash(value) {
  return String(value || "").trim().replace(/\/+$/, "");
}
