import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import AiConfigModal from "../src/components/AiConfigModal.js";
import AiStatusBadge from "../src/components/AiStatusBadge.js";

{
  const html = renderToStaticMarkup(React.createElement(AiStatusBadge, { config: null, onOpen: () => {} }));
  assert.match(html, /默认模式/);
  assert.match(html, /规则引擎/);
  assert.match(html, /配置 API/);
}

{
  const html = renderToStaticMarkup(
    React.createElement(AiStatusBadge, {
      config: { provider: "deepseek", label: "DeepSeek", model: "deepseek-test" },
      onOpen: () => {},
    }),
  );
  assert.match(html, /智能模式/);
  assert.match(html, /DeepSeek/);
  assert.match(html, /deepseek-test/);
}

{
  const html = renderToStaticMarkup(React.createElement(AiConfigModal, { open: true, onClose: () => {}, onSaved: () => {} }));
  assert.match(html, /API 配置/);
  assert.match(html, /OpenAI \/ Codex/);
  assert.match(html, /Claude \/ Anthropic/);
  assert.match(html, /DeepSeek/);
  assert.match(html, /小米 \/ MiLM/);
  assert.match(html, /自定义兼容接口/);
  assert.match(html, /保存在本地浏览器/);
}

{
  const html = renderToStaticMarkup(React.createElement(AiConfigModal, { open: false, onClose: () => {}, onSaved: () => {} }));
  assert.equal(html, "");
}

console.log("ai component tests passed");
