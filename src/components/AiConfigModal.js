import React, { useMemo, useState } from "react";
import { clearAiConfig, loadAiConfig, saveAiConfig, validateAiConfig } from "../services/llm/configStore.js";
import { getProviderPreset, normalizeProviderConfig, providerPresets } from "../services/llm/providerPresets.js";

const h = React.createElement;

export default function AiConfigModal({ open, onClose, onSaved }) {
  const savedConfig = useMemo(() => loadAiConfig(), []);
  const [form, setForm] = useState(() => normalizeProviderConfig(savedConfig || { provider: "openai" }));
  const [visibleKey, setVisibleKey] = useState(false);
  const [message, setMessage] = useState("");
  const preset = getProviderPreset(form.provider);

  if (!open) return null;

  function updateField(field, value) {
    setForm((current) => normalizeProviderConfig({ ...current, [field]: value }));
    setMessage("");
  }

  function chooseProvider(provider) {
    setForm((current) => normalizeProviderConfig({ provider, apiKey: current.apiKey }));
    setMessage("");
  }

  function handleSave(event) {
    event.preventDefault();
    const validation = validateAiConfig(form);
    if (!validation.valid) {
      setMessage(validation.errors.join(" "));
      return;
    }
    const saved = saveAiConfig(form);
    applySavedAiConfig(saved, { setForm, setMessage, onSaved, onClose });
  }

  function handleClear() {
    clearAiConfig();
    const empty = normalizeProviderConfig({ provider: "openai" });
    setForm(empty);
    setMessage("已清除本地 API 配置。");
    notifyConfigUpdated(null);
    onSaved?.(null);
  }

  return h(
    "div",
    { className: "modal-backdrop", role: "dialog", "aria-modal": "true" },
    h(
      "section",
      { className: "ai-config-modal" },
      h(
        "header",
        { className: "modal-head" },
        h("div", null, h("span", { className: "eyebrow" }, "BYOK"), h("h2", null, "API 配置")),
        h("button", { className: "icon-button", type: "button", onClick: onClose, "aria-label": "关闭" }, "×"),
      ),
      h(
        "form",
        { className: "ai-config-body", onSubmit: handleSave },
        h(
          "div",
          { className: "provider-grid" },
          providerPresets.map((item) =>
            h(
              "button",
              {
                key: item.id,
                type: "button",
                className: `provider-option ${form.provider === item.id ? "selected" : ""}`,
                onClick: () => chooseProvider(item.id),
              },
              h("strong", null, item.label),
              h("span", null, item.description),
            ),
          ),
        ),
        h(
          "p",
          { className: "security-note" },
          "API Key 只保存在本地浏览器。本项目没有后端代理；公共或共享电脑不要保存真实密钥。",
        ),
        h(
          "label",
          null,
          h("span", null, "API Key"),
          h(
            "div",
            { className: "secret-input" },
            h("input", {
              type: visibleKey ? "text" : "password",
              value: form.apiKey,
              onChange: (event) => updateField("apiKey", event.target.value),
              placeholder: "输入您的 API Key",
            }),
            h("button", { type: "button", onClick: () => setVisibleKey((value) => !value) }, visibleKey ? "隐藏" : "显示"),
          ),
        ),
        h(
          "label",
          null,
          h("span", null, "Base URL"),
          h("input", {
            type: "text",
            value: form.baseUrl,
            onChange: (event) => updateField("baseUrl", event.target.value),
            placeholder: preset.defaultBaseUrl || "https://example.com/v1",
          }),
        ),
        h(
          "label",
          null,
          h("span", null, "模型 ID"),
          h("input", {
            type: "text",
            value: form.model,
            onChange: (event) => updateField("model", event.target.value),
            placeholder: preset.modelHint,
          }),
        ),
        h("p", { className: "table-hint" }, `当前适配方式：${preset.apiStyle}。模型 ID 和 Base URL 都可以按服务商控制台修改。`),
        message ? h("p", { className: message.includes("已") ? "status-text" : "error-text" }, message) : null,
        h(
          "footer",
          { className: "modal-actions" },
          h("button", { className: "secondary-button", type: "button", onClick: handleClear }, "清除配置"),
          h("button", { className: "secondary-button", type: "button", onClick: onClose }, "取消"),
          h("button", { className: "primary-button", type: "submit" }, "保存配置"),
        ),
      ),
    ),
  );
}

export function applySavedAiConfig(saved, callbacks = {}) {
  callbacks.setForm?.(saved);
  callbacks.setMessage?.("已保存到本地浏览器。");
  notifyConfigUpdated(saved);
  callbacks.onSaved?.(saved);
  callbacks.onClose?.();
}

function notifyConfigUpdated(config) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("ai-config-updated", { detail: config }));
  }
}
