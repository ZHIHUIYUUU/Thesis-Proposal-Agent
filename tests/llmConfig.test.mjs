import assert from "node:assert/strict";
import {
  getProviderPreset,
  normalizeProviderConfig,
  providerPresets,
} from "../src/services/llm/providerPresets.js";
import {
  AI_CONFIG_STORAGE_KEY,
  clearAiConfig,
  loadAiConfig,
  saveAiConfig,
  validateAiConfig,
} from "../src/services/llm/configStore.js";

function memoryStorage() {
  const data = new Map();
  return {
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => data.set(key, String(value)),
    removeItem: (key) => data.delete(key),
  };
}

{
  const ids = providerPresets.map((preset) => preset.id);
  assert.deepEqual(ids, ["openai", "anthropic", "deepseek", "xiaomi", "custom"]);
  assert.equal(getProviderPreset("openai").label, "OpenAI / Codex");
  assert.equal(getProviderPreset("anthropic").apiStyle, "anthropic-messages");
  assert.equal(getProviderPreset("deepseek").apiStyle, "openai-compatible-chat");
  assert.equal(getProviderPreset("xiaomi").apiStyle, "openai-compatible-chat");
  assert.equal(getProviderPreset("custom").baseUrlEditable, true);
}

{
  const normalized = normalizeProviderConfig({
    provider: "deepseek",
    apiKey: "  sk-test  ",
    baseUrl: "",
    model: "",
  });
  assert.equal(normalized.provider, "deepseek");
  assert.equal(normalized.apiKey, "sk-test");
  assert.equal(normalized.baseUrl, "https://api.deepseek.com");
  assert.equal(normalized.model, "deepseek-v4-pro");
  assert.equal(normalized.apiStyle, "openai-compatible-chat");
}

{
  const normalized = normalizeProviderConfig({
    provider: "openai",
    apiKey: "key",
    baseUrl: "https://api.openai.com/v1/",
    model: "gpt-5.4",
  });
  assert.equal(normalized.baseUrl, "https://api.openai.com/v1");
  assert.equal(normalized.model, "gpt-5.4");
  assert.equal(normalized.apiStyle, "openai-responses");
}

{
  const invalid = validateAiConfig({ provider: "openai", apiKey: "", model: "" });
  assert.equal(invalid.valid, false);
  assert.match(invalid.errors.join(" "), /API Key/);

  const missingCustomFields = validateAiConfig({ provider: "custom", apiKey: "key", baseUrl: "", model: "" });
  assert.equal(missingCustomFields.valid, false);
  assert.match(missingCustomFields.errors.join(" "), /Base URL/);
  assert.match(missingCustomFields.errors.join(" "), /模型/);

  const valid = validateAiConfig({
    provider: "anthropic",
    apiKey: "test",
    baseUrl: "https://api.anthropic.com",
    model: "claude-sonnet-4-6",
  });
  assert.equal(valid.valid, true);
}

{
  const storage = memoryStorage();
  const config = saveAiConfig(
    {
      provider: "xiaomi",
      apiKey: "mi-key",
      baseUrl: "https://api.example.com/v1/",
      model: "MiLM",
    },
    storage,
  );
  assert.equal(config.baseUrl, "https://api.example.com/v1");
  assert.ok(storage.getItem(AI_CONFIG_STORAGE_KEY).includes("mi-key"));
  assert.deepEqual(loadAiConfig(storage), config);
  clearAiConfig(storage);
  assert.equal(loadAiConfig(storage), null);
}

{
  const storage = memoryStorage();
  storage.setItem(AI_CONFIG_STORAGE_KEY, "{bad-json");
  assert.equal(loadAiConfig(storage), null);
}

console.log("llm config tests passed");
