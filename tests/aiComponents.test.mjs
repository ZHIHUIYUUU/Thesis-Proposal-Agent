import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import AiConfigModal, { applySavedAiConfig } from "../src/components/AiConfigModal.js";
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

{
  const saved = { provider: "xiaomi", label: "小米 / MiLM", model: "mimo-v2.5-pro" };
  let closed = false;
  let savedArg = null;
  let formArg = null;
  let message = "";
  applySavedAiConfig(saved, {
    setForm: (value) => {
      formArg = value;
    },
    setMessage: (value) => {
      message = value;
    },
    onSaved: (value) => {
      savedArg = value;
    },
    onClose: () => {
      closed = true;
    },
  });
  assert.equal(closed, true);
  assert.deepEqual(savedArg, saved);
  assert.deepEqual(formArg, saved);
  assert.equal(message, "已保存到本地浏览器。");
}

console.log("ai component tests passed");
