import React from "react";

const h = React.createElement;

export default function AiStatusBadge({ config, onOpen }) {
  const enabled = Boolean(config);
  return h(
    "div",
    { className: `ai-status-badge ${enabled ? "enabled" : "default"}` },
    h(
      "div",
      { className: "ai-status-copy" },
      h("strong", null, enabled ? "智能模式" : "默认模式"),
      h("span", null, enabled ? `${config.label || config.provider} · ${config.model}` : "规则引擎，无需 API Key"),
    ),
    h(
      "button",
      { className: "secondary-button compact-button", type: "button", onClick: onOpen },
      enabled ? "API 配置" : "配置 API",
    ),
  );
}
