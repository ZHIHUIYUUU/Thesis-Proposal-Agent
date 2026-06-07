# BYOK AI Mode Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add optional BYOK intelligent mode with provider configuration and AI deep gap analysis while preserving the current no-key rule-engine mode.

**Architecture:** Keep the existing React + Context workflow. Add a focused `src/services/llm/` service layer for provider config, request adapters, prompt construction, and response normalization. Add small UI components for AI configuration/status and integrate only the Gap Matrix page for the first release.

**Tech Stack:** React 19, React Router 7, Vite 6, browser `fetch`, Web Storage, current Node-based test scripts.

---

## Reference Facts

- OpenAI Responses API creates model responses with `POST /v1/responses`; `text.format` can request JSON Schema structured output.
- DeepSeek supports OpenAI-compatible `/chat/completions` using base URL `https://api.deepseek.com`; current examples include `deepseek-v4-pro` and `deepseek-v4-flash`, while legacy `deepseek-chat` and `deepseek-reasoner` should stay editable rather than hard-coded as the only choices.
- Anthropic Messages API uses `POST /v1/messages`, `x-api-key`, `anthropic-version: 2023-06-01`, `model`, `max_tokens`, and `messages`.
- Browser BYOK is not as secure as a backend proxy. The UI must make clear that keys stay in the user's browser and should not be saved on shared computers.

## File Structure

Create:

- `src/services/llm/providerPresets.js`: provider metadata and editable defaults.
- `src/services/llm/configStore.js`: browser storage and config validation.
- `src/services/llm/gapAnalysisSchema.js`: runtime validation and normalization for AI results.
- `src/services/llm/gapPrompt.js`: context-to-prompt builder.
- `src/services/llm/callLlm.js`: adapter selection, timeout handling, JSON extraction.
- `src/services/llm/adapters/openaiResponses.js`: OpenAI/Codex Responses API adapter.
- `src/services/llm/adapters/openaiCompatibleChat.js`: DeepSeek, Xiaomi, and custom OpenAI-compatible chat adapter.
- `src/services/llm/adapters/anthropicMessages.js`: Claude Messages API adapter.
- `src/services/llm/gapAgent.js`: public `runGapAnalysis()` function used by React.
- `src/components/AiConfigModal.jsx`: BYOK settings UI.
- `src/components/AiStatusBadge.jsx`: compact mode/status indicator.
- `tests/llmConfig.test.mjs`
- `tests/llmPromptSchema.test.mjs`
- `tests/llmAdapters.test.mjs`
- `tests/aiWorkflow.test.mjs`

Modify:

- `src/workflow.js`: add AI analysis state and reducer actions.
- `src/state/WorkflowContext.jsx`: no key storage in workflow state; preserve existing state persistence.
- `src/components/AppShell.jsx`: add AI status/config entry point.
- `src/pages/GapPage.jsx`: add AI deep analysis trigger and AI result rendering.
- `styles.css`: modal, status badge, AI result cards.
- `package.json`: include new tests in `npm test`.
- `README.md`: document BYOK mode and warning.

## Task 1: Provider Presets and Config Store

**Files:**
- Create: `src/services/llm/providerPresets.js`
- Create: `src/services/llm/configStore.js`
- Test: `tests/llmConfig.test.mjs`
- Modify: `package.json`

- [ ] **Step 1: Write the failing config tests**

Create `tests/llmConfig.test.mjs`:

```js
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
  assert.ok(providerPresets.openai);
  assert.equal(getProviderPreset("deepseek").adapter, "openai-compatible-chat");
  assert.equal(getProviderPreset("anthropic").adapter, "anthropic-messages");
  assert.equal(getProviderPreset("xiaomi").adapter, "openai-compatible-chat");
  assert.equal(getProviderPreset("missing").id, "custom");
}

{
  const normalized = normalizeProviderConfig({
    provider: "deepseek",
    apiKey: "  sk-test  ",
    model: "",
    baseUrl: "",
    remember: false,
  });
  assert.equal(normalized.provider, "deepseek");
  assert.equal(normalized.apiKey, "sk-test");
  assert.equal(normalized.baseUrl, "https://api.deepseek.com");
  assert.equal(normalized.model, "deepseek-v4-pro");
  assert.equal(normalized.storage, "session");
}

{
  const valid = validateAiConfig({
    provider: "custom",
    adapter: "openai-compatible-chat",
    apiKey: "key",
    baseUrl: "https://example.com/v1",
    model: "custom-model",
    storage: "local",
  });
  assert.equal(valid.ok, true);
}

{
  const invalid = validateAiConfig({
    provider: "openai",
    adapter: "openai-responses",
    apiKey: "",
    baseUrl: "notaurl",
    model: "",
    storage: "session",
  });
  assert.equal(invalid.ok, false);
  assert.match(invalid.errors.join(" "), /API Key/);
  assert.match(invalid.errors.join(" "), /Base URL/);
  assert.match(invalid.errors.join(" "), /模型/);
}

{
  const session = memoryStorage();
  const local = memoryStorage();
  const config = normalizeProviderConfig({
    provider: "openai",
    apiKey: "sk-browser-user",
    baseUrl: "https://api.openai.com/v1",
    model: "gpt-5.4",
    remember: false,
  });
  saveAiConfig(config, { sessionStorage: session, localStorage: local });
  assert.ok(session.getItem(AI_CONFIG_STORAGE_KEY));
  assert.equal(local.getItem(AI_CONFIG_STORAGE_KEY), null);
  assert.equal(loadAiConfig({ sessionStorage: session, localStorage: local }).model, "gpt-5.4");
  clearAiConfig({ sessionStorage: session, localStorage: local });
  assert.equal(loadAiConfig({ sessionStorage: session, localStorage: local }), null);
}

console.log("llm config tests passed");
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
node tests/llmConfig.test.mjs
```

Expected: fail because `src/services/llm/providerPresets.js` does not exist.

- [ ] **Step 3: Implement provider presets**

Create `src/services/llm/providerPresets.js`:

```js
export const providerPresets = {
  openai: {
    id: "openai",
    label: "OpenAI / Codex",
    adapter: "openai-responses",
    defaultBaseUrl: "https://api.openai.com/v1",
    defaultModel: "gpt-5.4",
    modelHint: "例如 gpt-5.4、gpt-5.5、gpt-5-codex",
  },
  deepseek: {
    id: "deepseek",
    label: "DeepSeek",
    adapter: "openai-compatible-chat",
    defaultBaseUrl: "https://api.deepseek.com",
    defaultModel: "deepseek-v4-pro",
    modelHint: "例如 deepseek-v4-pro、deepseek-v4-flash",
  },
  anthropic: {
    id: "anthropic",
    label: "Anthropic / Claude",
    adapter: "anthropic-messages",
    defaultBaseUrl: "https://api.anthropic.com",
    defaultModel: "claude-sonnet-4-20250514",
    modelHint: "填写你的 Claude 模型 ID",
  },
  xiaomi: {
    id: "xiaomi",
    label: "小米",
    adapter: "openai-compatible-chat",
    defaultBaseUrl: "",
    defaultModel: "",
    modelHint: "填写小米平台提供的模型 ID",
  },
  custom: {
    id: "custom",
    label: "自定义 OpenAI 兼容",
    adapter: "openai-compatible-chat",
    defaultBaseUrl: "",
    defaultModel: "",
    modelHint: "填写兼容 /chat/completions 的模型 ID",
  },
};

export function getProviderPreset(provider) {
  return providerPresets[provider] || providerPresets.custom;
}

export function normalizeProviderConfig(input = {}) {
  const preset = getProviderPreset(input.provider);
  const storage = input.storage || (input.remember ? "local" : "session");
  return {
    provider: preset.id,
    label: preset.label,
    adapter: preset.adapter,
    apiKey: String(input.apiKey || "").trim(),
    baseUrl: String(input.baseUrl || preset.defaultBaseUrl || "").trim().replace(/\/+$/g, ""),
    model: String(input.model || preset.defaultModel || "").trim(),
    storage: storage === "local" ? "local" : "session",
  };
}
```

- [ ] **Step 4: Implement config store**

Create `src/services/llm/configStore.js`:

```js
import { normalizeProviderConfig } from "./providerPresets.js";

export const AI_CONFIG_STORAGE_KEY = "graduate-proposal-ai-config";

export function validateAiConfig(config = {}) {
  const errors = [];
  if (!String(config.apiKey || "").trim()) errors.push("API Key 不能为空。");
  if (!String(config.model || "").trim()) errors.push("模型 ID 不能为空。");
  try {
    new URL(String(config.baseUrl || ""));
  } catch {
    errors.push("Base URL 必须是有效 URL。");
  }
  if (!["openai-responses", "openai-compatible-chat", "anthropic-messages"].includes(config.adapter)) {
    errors.push("API 提供商适配器无效。");
  }
  return { ok: errors.length === 0, errors };
}

export function saveAiConfig(config, storageTargets = browserStorage()) {
  const normalized = normalizeProviderConfig(config);
  const validation = validateAiConfig(normalized);
  if (!validation.ok) {
    return { ok: false, errors: validation.errors };
  }
  const serialized = JSON.stringify(normalized);
  storageTargets.sessionStorage.removeItem(AI_CONFIG_STORAGE_KEY);
  storageTargets.localStorage.removeItem(AI_CONFIG_STORAGE_KEY);
  const target = normalized.storage === "local" ? storageTargets.localStorage : storageTargets.sessionStorage;
  target.setItem(AI_CONFIG_STORAGE_KEY, serialized);
  return { ok: true, config: normalized };
}

export function loadAiConfig(storageTargets = browserStorage()) {
  const raw = storageTargets.sessionStorage.getItem(AI_CONFIG_STORAGE_KEY) || storageTargets.localStorage.getItem(AI_CONFIG_STORAGE_KEY);
  if (!raw) return null;
  try {
    const normalized = normalizeProviderConfig(JSON.parse(raw));
    return validateAiConfig(normalized).ok ? normalized : null;
  } catch {
    return null;
  }
}

export function clearAiConfig(storageTargets = browserStorage()) {
  storageTargets.sessionStorage.removeItem(AI_CONFIG_STORAGE_KEY);
  storageTargets.localStorage.removeItem(AI_CONFIG_STORAGE_KEY);
}

function browserStorage() {
  if (typeof window === "undefined") {
    const empty = {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
    };
    return { sessionStorage: empty, localStorage: empty };
  }
  return { sessionStorage: window.sessionStorage, localStorage: window.localStorage };
}
```

- [ ] **Step 5: Update npm test script**

Modify `package.json`:

```json
"test": "node tests/engine.test.mjs && node tests/workflow.test.mjs && node tests/literatureApi.test.mjs && node tests/literatureSort.test.mjs && node tests/llmConfig.test.mjs"
```

- [ ] **Step 6: Run tests**

Run:

```bash
npm.cmd test
```

Expected: existing tests plus `llm config tests passed`.

- [ ] **Step 7: Commit**

```bash
git add package.json src/services/llm/providerPresets.js src/services/llm/configStore.js tests/llmConfig.test.mjs
git commit -m "Add BYOK provider config store"
```

## Task 2: Gap Prompt and AI Output Schema

**Files:**
- Create: `src/services/llm/gapAnalysisSchema.js`
- Create: `src/services/llm/gapPrompt.js`
- Test: `tests/llmPromptSchema.test.mjs`
- Modify: `package.json`

- [ ] **Step 1: Write failing prompt/schema tests**

Create `tests/llmPromptSchema.test.mjs`:

```js
import assert from "node:assert/strict";
import { buildGapAnalysisPrompt } from "../src/services/llm/gapPrompt.js";
import { extractJsonObject, normalizeGapAnalysisResult, validateGapAnalysisResult } from "../src/services/llm/gapAnalysisSchema.js";

const context = {
  report: {
    routing: { methodName: "优化/建模", subfieldName: "运筹优化" },
    degree: { level: "硕士" },
  },
  topic: {
    title: "考虑车辆路径算法对比的优化/建模选题",
    scenario: "车辆路径",
    question: "如何在最后一公里配送中比较路径算法？",
  },
  works: [
    {
      title: "Hybrid Truck-Drone Delivery Systems",
      year: 2024,
      source: "European Journal of Operational Research",
      abstract: "This review studies truck drone routing constraints and benchmarks.",
    },
  ],
  matrix: {
    template: "车辆路径场景矩阵",
    summary: "已建立 1 篇文献 × 9 个维度的矩阵。",
    dimensions: [{ label: "车辆/运载方式" }, { label: "基线算例" }],
    coverage: [{ label: "基线算例", coverageRate: 100 }],
  },
  ruleCandidates: [
    {
      gapName: "车辆路径的基线比较与评价指标缺口",
      gapType: "评价/基线缺口",
      missingDimension: "ALNS/传统VRP/启发式基线 + 成本/时间/服务水平指标",
    },
  ],
};

{
  const prompt = buildGapAnalysisPrompt(context);
  assert.match(prompt.system, /研究选题/);
  assert.match(prompt.user, /Hybrid Truck-Drone Delivery Systems/);
  assert.match(prompt.user, /车辆\/运载方式/);
  assert.match(prompt.user, /只输出 JSON/);
}

{
  const json = extractJsonObject("prefix {\"summary\":\"ok\",\"candidates\":[],\"warnings\":[]} suffix");
  assert.equal(JSON.parse(json).summary, "ok");
}

{
  const normalized = normalizeGapAnalysisResult(
    {
      summary: "文献显示可以从基线和指标收窄。",
      candidates: [
        {
          title: "车辆路径基线评价缺口",
          gapType: "评价/基线缺口",
          researchQuestion: "不同基线下改进是否稳定？",
          articleUnderstanding: "综述提供 truck-drone 背景。",
          evidenceChain: ["文献覆盖运载方式", "矩阵提示基线需要核查"],
          improvementPlan: "设置传统启发式和 ALNS 对照。",
          methodRoute: "优化建模与基线实验。",
          dataRoute: "Solomon 或 VRPLIB 算例。",
          risks: ["不能声称全面优于所有算法"],
          nextSearchKeywords: ["vehicle routing ALNS benchmark"],
          confidence: "medium",
        },
      ],
      warnings: [],
    },
    { provider: "deepseek", model: "deepseek-v4-pro" },
  );
  assert.equal(normalized.candidates.length, 1);
  assert.equal(normalized.provider, "deepseek");
  assert.equal(validateGapAnalysisResult(normalized).ok, true);
}

{
  const invalid = normalizeGapAnalysisResult({ summary: "", candidates: [{}] }, { provider: "openai", model: "gpt-5.4" });
  const validation = validateGapAnalysisResult(invalid);
  assert.equal(validation.ok, false);
  assert.match(validation.errors.join(" "), /summary/);
}

console.log("llm prompt/schema tests passed");
```

- [ ] **Step 2: Run test to verify it fails**

```bash
node tests/llmPromptSchema.test.mjs
```

Expected: fail because prompt/schema modules do not exist.

- [ ] **Step 3: Implement schema utilities**

Create `src/services/llm/gapAnalysisSchema.js`:

```js
export const gapAnalysisJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: ["summary", "candidates", "warnings"],
  properties: {
    summary: { type: "string" },
    warnings: { type: "array", items: { type: "string" } },
    candidates: {
      type: "array",
      minItems: 1,
      items: {
        type: "object",
        additionalProperties: false,
        required: [
          "title",
          "gapType",
          "researchQuestion",
          "articleUnderstanding",
          "evidenceChain",
          "improvementPlan",
          "methodRoute",
          "dataRoute",
          "risks",
          "nextSearchKeywords",
          "confidence",
        ],
        properties: {
          title: { type: "string" },
          gapType: { type: "string" },
          researchQuestion: { type: "string" },
          articleUnderstanding: { type: "string" },
          evidenceChain: { type: "array", items: { type: "string" } },
          improvementPlan: { type: "string" },
          methodRoute: { type: "string" },
          dataRoute: { type: "string" },
          risks: { type: "array", items: { type: "string" } },
          nextSearchKeywords: { type: "array", items: { type: "string" } },
          confidence: { type: "string", enum: ["low", "medium", "high"] },
        },
      },
    },
  },
};

export function extractJsonObject(text) {
  const value = String(text || "").trim();
  if (!value) throw new Error("模型没有返回内容。");
  if (value.startsWith("{") && value.endsWith("}")) return value;
  const start = value.indexOf("{");
  const end = value.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) throw new Error("模型输出不是可解析 JSON。");
  return value.slice(start, end + 1);
}

export function normalizeGapAnalysisResult(raw, meta = {}) {
  const candidates = Array.isArray(raw?.candidates) ? raw.candidates : [];
  return {
    provider: meta.provider || "custom",
    model: meta.model || "",
    generatedAt: meta.generatedAt || new Date().toISOString(),
    summary: String(raw?.summary || "").trim(),
    warnings: asStringArray(raw?.warnings),
    candidates: candidates.map((candidate, index) => ({
      id: String(candidate.id || `ai-gap-${index + 1}`),
      title: String(candidate.title || "").trim(),
      gapType: String(candidate.gapType || "").trim(),
      researchQuestion: String(candidate.researchQuestion || "").trim(),
      articleUnderstanding: String(candidate.articleUnderstanding || "").trim(),
      evidenceChain: asStringArray(candidate.evidenceChain),
      improvementPlan: String(candidate.improvementPlan || "").trim(),
      methodRoute: String(candidate.methodRoute || "").trim(),
      dataRoute: String(candidate.dataRoute || "").trim(),
      risks: asStringArray(candidate.risks),
      nextSearchKeywords: asStringArray(candidate.nextSearchKeywords),
      confidence: ["low", "medium", "high"].includes(candidate.confidence) ? candidate.confidence : "medium",
    })),
  };
}

export function validateGapAnalysisResult(result) {
  const errors = [];
  if (!result?.summary) errors.push("summary 不能为空。");
  if (!Array.isArray(result?.candidates) || result.candidates.length < 1) errors.push("至少需要 1 个候选缺口。");
  (result?.candidates || []).forEach((candidate, index) => {
    ["title", "gapType", "researchQuestion", "articleUnderstanding", "improvementPlan", "methodRoute", "dataRoute"].forEach((key) => {
      if (!candidate[key]) errors.push(`candidate ${index + 1} 缺少 ${key}。`);
    });
    ["evidenceChain", "risks", "nextSearchKeywords"].forEach((key) => {
      if (!Array.isArray(candidate[key]) || candidate[key].length === 0) errors.push(`candidate ${index + 1} 缺少 ${key}。`);
    });
  });
  return { ok: errors.length === 0, errors };
}

function asStringArray(value) {
  return Array.isArray(value) ? value.map((item) => String(item || "").trim()).filter(Boolean) : [];
}
```

- [ ] **Step 4: Implement prompt builder**

Create `src/services/llm/gapPrompt.js`:

```js
export function buildGapAnalysisPrompt({ report, topic, works, matrix, ruleCandidates }) {
  const compactWorks = (works || []).slice(0, 8).map((work, index) => ({
    index: index + 1,
    title: work.title,
    year: work.year,
    source: work.source,
    authors: work.authors,
    citedBy: work.citedBy,
    concepts: work.concepts,
    abstract: trim(work.abstract, 900),
    url: work.openAccessUrl || work.url || work.doi,
  }));
  const payload = {
    discipline: {
      degree: report?.degree?.level,
      subfield: report?.routing?.subfieldName,
      method: report?.routing?.methodName,
    },
    topic: {
      title: topic?.title,
      scenario: topic?.scenario,
      question: topic?.question,
    },
    literature: compactWorks,
    matrix: {
      template: matrix?.template,
      summary: matrix?.summary,
      dimensions: (matrix?.dimensions || []).map((item) => item.label),
      coverage: matrix?.coverage || [],
      highThreatPapers: matrix?.highThreatPapers?.map((item) => item.title) || [],
    },
    ruleCandidates: (ruleCandidates || []).map((item) => ({
      name: item.gapName,
      type: item.gapType,
      missingDimension: item.missingDimension,
      logic: item.gapLogic,
    })),
  };
  return {
    system:
      "你是严谨的研究选题与开题报告顾问。你的任务是基于用户已选文献和缺口矩阵，生成具体、可答辩、可验证的研究缺口。不要夸大首创性，不要把论文题名当作方向，不要编造未给出的文献信息。",
    user: [
      "请阅读以下 JSON 上下文，输出更深入的文献缺口分析。",
      "要求：具体场景具体分析；每个候选方向必须说明证据链、怎么改、方法路线、数据路线、风险和下一步检索词。",
      "只输出 JSON，不要输出 Markdown，不要添加解释性前后缀。",
      JSON.stringify(payload, null, 2),
    ].join("\n\n"),
  };
}

function trim(value, maxLength) {
  const text = String(value || "").replace(/\s+/g, " ").trim();
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
}
```

- [ ] **Step 5: Update npm test script**

Append `&& node tests/llmPromptSchema.test.mjs` to the `test` script after `llmConfig.test.mjs`.

- [ ] **Step 6: Run tests**

```bash
npm.cmd test
```

Expected: includes `llm prompt/schema tests passed`.

- [ ] **Step 7: Commit**

```bash
git add package.json src/services/llm/gapAnalysisSchema.js src/services/llm/gapPrompt.js tests/llmPromptSchema.test.mjs
git commit -m "Add AI gap prompt and schema validation"
```

## Task 3: LLM Adapters and Public Gap Agent Service

**Files:**
- Create: `src/services/llm/adapters/openaiResponses.js`
- Create: `src/services/llm/adapters/openaiCompatibleChat.js`
- Create: `src/services/llm/adapters/anthropicMessages.js`
- Create: `src/services/llm/callLlm.js`
- Create: `src/services/llm/gapAgent.js`
- Test: `tests/llmAdapters.test.mjs`
- Modify: `package.json`

- [ ] **Step 1: Write failing adapter tests**

Create `tests/llmAdapters.test.mjs`:

```js
import assert from "node:assert/strict";
import { callLlm } from "../src/services/llm/callLlm.js";
import { runGapAnalysis } from "../src/services/llm/gapAgent.js";

function mockFetch(handler) {
  const calls = [];
  const fetchImpl = async (url, init) => {
    calls.push({ url, init, body: JSON.parse(init.body) });
    return handler(url, init, calls);
  };
  fetchImpl.calls = calls;
  return fetchImpl;
}

function okJson(payload) {
  return {
    ok: true,
    status: 200,
    json: async () => payload,
  };
}

const validJson = {
  summary: "AI summary",
  candidates: [
    {
      title: "AI gap",
      gapType: "评价缺口",
      researchQuestion: "如何比较？",
      articleUnderstanding: "文献提供背景。",
      evidenceChain: ["证据1"],
      improvementPlan: "加入基线。",
      methodRoute: "优化建模。",
      dataRoute: "公开算例。",
      risks: ["不要夸大"],
      nextSearchKeywords: ["vehicle routing benchmark"],
      confidence: "high",
    },
  ],
  warnings: [],
};

{
  const fetchImpl = mockFetch(() => okJson({ output_text: JSON.stringify(validJson) }));
  const text = await callLlm({
    config: {
      provider: "openai",
      adapter: "openai-responses",
      apiKey: "key",
      baseUrl: "https://api.openai.com/v1",
      model: "gpt-5.4",
    },
    prompt: { system: "sys", user: "user" },
    fetchImpl,
    timeoutMs: 1000,
  });
  assert.match(text, /AI summary/);
  assert.equal(fetchImpl.calls[0].url, "https://api.openai.com/v1/responses");
  assert.equal(fetchImpl.calls[0].body.model, "gpt-5.4");
}

{
  const fetchImpl = mockFetch(() => okJson({ choices: [{ message: { content: JSON.stringify(validJson) } }] }));
  const text = await callLlm({
    config: {
      provider: "deepseek",
      adapter: "openai-compatible-chat",
      apiKey: "key",
      baseUrl: "https://api.deepseek.com",
      model: "deepseek-v4-pro",
    },
    prompt: { system: "sys", user: "user" },
    fetchImpl,
    timeoutMs: 1000,
  });
  assert.match(text, /AI summary/);
  assert.equal(fetchImpl.calls[0].url, "https://api.deepseek.com/chat/completions");
  assert.equal(fetchImpl.calls[0].body.messages[0].role, "system");
}

{
  const fetchImpl = mockFetch(() => okJson({ content: [{ type: "text", text: JSON.stringify(validJson) }] }));
  const text = await callLlm({
    config: {
      provider: "anthropic",
      adapter: "anthropic-messages",
      apiKey: "key",
      baseUrl: "https://api.anthropic.com",
      model: "claude-sonnet-4-20250514",
    },
    prompt: { system: "sys", user: "user" },
    fetchImpl,
    timeoutMs: 1000,
  });
  assert.match(text, /AI summary/);
  assert.equal(fetchImpl.calls[0].url, "https://api.anthropic.com/v1/messages");
  assert.equal(fetchImpl.calls[0].body.max_tokens, 2500);
}

{
  const fetchImpl = mockFetch(() => okJson({ choices: [{ message: { content: JSON.stringify(validJson) } }] }));
  const result = await runGapAnalysis({
    config: {
      provider: "custom",
      adapter: "openai-compatible-chat",
      apiKey: "key",
      baseUrl: "https://example.com/v1",
      model: "custom-model",
    },
    context: {
      report: { routing: { methodName: "优化/建模" }, degree: { level: "硕士" } },
      topic: { title: "车辆路径", scenario: "车辆路径", question: "问题" },
      works: [{ title: "Paper", abstract: "Abstract" }],
      matrix: { template: "车辆路径场景矩阵", summary: "summary", dimensions: [], coverage: [] },
      ruleCandidates: [],
    },
    fetchImpl,
  });
  assert.equal(result.candidates[0].title, "AI gap");
  assert.equal(result.provider, "custom");
}

console.log("llm adapter tests passed");
```

- [ ] **Step 2: Run test to verify it fails**

```bash
node tests/llmAdapters.test.mjs
```

Expected: fail because adapter modules do not exist.

- [ ] **Step 3: Implement OpenAI Responses adapter**

Create `src/services/llm/adapters/openaiResponses.js`:

```js
import { gapAnalysisJsonSchema } from "../gapAnalysisSchema.js";

export async function callOpenAIResponses({ config, prompt, fetchImpl, signal }) {
  const response = await fetchImpl(`${config.baseUrl}/responses`, {
    method: "POST",
    signal,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model,
      input: [
        { role: "system", content: prompt.system },
        { role: "user", content: prompt.user },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "gap_analysis",
          schema: gapAnalysisJsonSchema,
          strict: true,
        },
      },
    }),
  });
  const payload = await readJsonResponse(response);
  return payload.output_text || collectOutputText(payload) || JSON.stringify(payload);
}

async function readJsonResponse(response) {
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error?.message || `模型服务返回 ${response.status}`);
  }
  return payload;
}

function collectOutputText(payload) {
  return (payload.output || [])
    .flatMap((item) => item.content || [])
    .map((item) => item.text || "")
    .filter(Boolean)
    .join("\n");
}
```

- [ ] **Step 4: Implement OpenAI-compatible chat adapter**

Create `src/services/llm/adapters/openaiCompatibleChat.js`:

```js
export async function callOpenAICompatibleChat({ config, prompt, fetchImpl, signal }) {
  const response = await fetchImpl(`${config.baseUrl}/chat/completions`, {
    method: "POST",
    signal,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model,
      messages: [
        { role: "system", content: prompt.system },
        { role: "user", content: prompt.user },
      ],
      temperature: 0.2,
      response_format: { type: "json_object" },
      stream: false,
    }),
  });
  const payload = await readJsonResponse(response);
  return payload.choices?.[0]?.message?.content || JSON.stringify(payload);
}

async function readJsonResponse(response) {
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error?.message || `模型服务返回 ${response.status}`);
  }
  return payload;
}
```

- [ ] **Step 5: Implement Anthropic adapter**

Create `src/services/llm/adapters/anthropicMessages.js`:

```js
export async function callAnthropicMessages({ config, prompt, fetchImpl, signal }) {
  const response = await fetchImpl(`${config.baseUrl}/v1/messages`, {
    method: "POST",
    signal,
    headers: {
      "Content-Type": "application/json",
      "x-api-key": config.apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: config.model,
      max_tokens: 2500,
      system: `${prompt.system}\n只输出 JSON，不要输出 Markdown。`,
      messages: [{ role: "user", content: prompt.user }],
    }),
  });
  const payload = await readJsonResponse(response);
  return (payload.content || [])
    .filter((item) => item.type === "text")
    .map((item) => item.text)
    .join("\n") || JSON.stringify(payload);
}

async function readJsonResponse(response) {
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error?.message || `模型服务返回 ${response.status}`);
  }
  return payload;
}
```

- [ ] **Step 6: Implement adapter selector**

Create `src/services/llm/callLlm.js`:

```js
import { callAnthropicMessages } from "./adapters/anthropicMessages.js";
import { callOpenAICompatibleChat } from "./adapters/openaiCompatibleChat.js";
import { callOpenAIResponses } from "./adapters/openaiResponses.js";

export async function callLlm({ config, prompt, fetchImpl = fetch, timeoutMs = 45000 }) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const args = { config, prompt, fetchImpl, signal: controller.signal };
    if (config.adapter === "openai-responses") return await callOpenAIResponses(args);
    if (config.adapter === "openai-compatible-chat") return await callOpenAICompatibleChat(args);
    if (config.adapter === "anthropic-messages") return await callAnthropicMessages(args);
    throw new Error("不支持的 API 适配器。");
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error(`AI 请求超时（${Math.round(timeoutMs / 1000)} 秒）。`);
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}
```

- [ ] **Step 7: Implement public gap agent service**

Create `src/services/llm/gapAgent.js`:

```js
import { callLlm } from "./callLlm.js";
import { extractJsonObject, normalizeGapAnalysisResult, validateGapAnalysisResult } from "./gapAnalysisSchema.js";
import { buildGapAnalysisPrompt } from "./gapPrompt.js";

export async function runGapAnalysis({ config, context, fetchImpl = fetch }) {
  const prompt = buildGapAnalysisPrompt(context);
  const rawText = await callLlm({ config, prompt, fetchImpl });
  let parsed;
  try {
    parsed = JSON.parse(extractJsonObject(rawText));
  } catch {
    return {
      provider: config.provider,
      model: config.model,
      generatedAt: new Date().toISOString(),
      summary: "模型返回了无法解析为结构化结果的内容。",
      candidates: [],
      warnings: ["模型输出不是有效 JSON，已保留原始内容供人工查看。"],
      rawText,
      valid: false,
    };
  }
  const normalized = normalizeGapAnalysisResult(parsed, { provider: config.provider, model: config.model });
  const validation = validateGapAnalysisResult(normalized);
  return {
    ...normalized,
    valid: validation.ok,
    validationErrors: validation.errors,
    rawText,
  };
}
```

- [ ] **Step 8: Update npm test script**

Append `&& node tests/llmAdapters.test.mjs`.

- [ ] **Step 9: Run tests**

```bash
npm.cmd test
```

Expected: includes `llm adapter tests passed`.

- [ ] **Step 10: Commit**

```bash
git add package.json src/services/llm/adapters src/services/llm/callLlm.js src/services/llm/gapAgent.js tests/llmAdapters.test.mjs
git commit -m "Add BYOK LLM adapters"
```

## Task 4: Workflow AI State

**Files:**
- Modify: `src/workflow.js`
- Test: `tests/aiWorkflow.test.mjs`
- Modify: `package.json`

- [ ] **Step 1: Write failing workflow tests**

Create `tests/aiWorkflow.test.mjs`:

```js
import assert from "node:assert/strict";
import { createInitialWorkflowState, workflowReducer } from "../src/workflow.js";

{
  const state = createInitialWorkflowState();
  assert.deepEqual(state.aiGapAnalysis, {
    loading: false,
    error: "",
    result: null,
  });
}

{
  let state = createInitialWorkflowState();
  state = workflowReducer(state, { type: "SET_AI_GAP_LOADING", payload: true });
  assert.equal(state.aiGapAnalysis.loading, true);
  assert.equal(state.aiGapAnalysis.error, "");
  state = workflowReducer(state, {
    type: "SET_AI_GAP_RESULT",
    payload: { summary: "AI summary", candidates: [{ id: "a" }] },
  });
  assert.equal(state.aiGapAnalysis.loading, false);
  assert.equal(state.aiGapAnalysis.result.summary, "AI summary");
}

{
  let state = createInitialWorkflowState();
  state = workflowReducer(state, { type: "SET_AI_GAP_ERROR", payload: "bad key" });
  assert.equal(state.aiGapAnalysis.loading, false);
  assert.equal(state.aiGapAnalysis.error, "bad key");
}

{
  let state = createInitialWorkflowState();
  state = workflowReducer(state, {
    type: "SET_AI_GAP_RESULT",
    payload: { summary: "AI summary", candidates: [] },
  });
  state = workflowReducer(state, { type: "UPDATE_GAP_NOTE", payload: "manual note" });
  assert.equal(state.aiGapAnalysis.result, null);
}

{
  let state = createInitialWorkflowState();
  state = workflowReducer(state, {
    type: "SET_AI_GAP_RESULT",
    payload: { summary: "AI summary", candidates: [{ id: "ai-1" }] },
  });
  state = workflowReducer(state, {
    type: "SELECT_AI_GAP_OPTION",
    payload: { id: "ai-1", draft: "AI selected draft" },
  });
  assert.equal(state.gapChoiceId, "ai:ai-1");
  assert.equal(state.gapNote, "AI selected draft");
  assert.equal(state.aiGapAnalysis.result.summary, "AI summary");
}

console.log("ai workflow tests passed");
```

- [ ] **Step 2: Run test to verify it fails**

```bash
node tests/aiWorkflow.test.mjs
```

Expected: fail because `aiGapAnalysis` state is missing.

- [ ] **Step 3: Add AI state and reducer actions**

Modify `src/workflow.js`:

```js
export function createInitialWorkflowState() {
  return {
    currentRoute: "/intake",
    intake: {
      degreeLevel: "",
      collection: "",
      subfield: "",
      method: "",
      dataCondition: "",
      advisorPreference: "",
      studentProfile: "",
      multiLevel: false,
    },
    report: null,
    directionSelections: [],
    selectedTopicRank: null,
    deepDive: null,
    literature: createLiteratureState(),
    aiGapAnalysis: createAiGapAnalysisState(),
    gapNote: "",
    gapChoiceId: "",
    proposal: null,
    notice: "",
  };
}
```

Add reducer cases:

```js
case "SET_AI_GAP_LOADING":
  return { ...state, aiGapAnalysis: { ...state.aiGapAnalysis, loading: Boolean(action.payload), error: "" } };
case "SET_AI_GAP_RESULT":
  return { ...state, aiGapAnalysis: { loading: false, error: "", result: action.payload || null } };
case "SET_AI_GAP_ERROR":
  return { ...state, aiGapAnalysis: { ...state.aiGapAnalysis, loading: false, error: String(action.payload || "AI 分析失败") } };
case "CLEAR_AI_GAP_RESULT":
  return { ...state, aiGapAnalysis: createAiGapAnalysisState() };
case "SELECT_AI_GAP_OPTION":
  return selectAiGapOption(state, action.payload || {});
```

Add helper:

```js
function createAiGapAnalysisState(overrides = {}) {
  return {
    loading: false,
    error: "",
    result: null,
    ...overrides,
  };
}
```

Clear AI result in state-changing functions that invalidate gap analysis:

```js
aiGapAnalysis: createAiGapAnalysisState(),
```

Apply this reset in `updateIntake` major-change branch, `toggleDirection`, `selectTopic`, `setLiterature`, `toggleLiteratureSelection`, and `UPDATE_GAP_NOTE`.

Add AI option adoption without clearing the AI result:

```js
function selectAiGapOption(state, option) {
  const draft = String(option.draft || "").trim();
  if (!draft) return state;
  return {
    ...state,
    gapChoiceId: `ai:${String(option.id || "selected")}`,
    gapNote: draft,
    proposal: null,
  };
}
```

- [ ] **Step 4: Update npm test script**

Append `&& node tests/aiWorkflow.test.mjs`.

- [ ] **Step 5: Run tests**

```bash
npm.cmd test
```

Expected: includes `ai workflow tests passed`.

- [ ] **Step 6: Commit**

```bash
git add package.json src/workflow.js tests/aiWorkflow.test.mjs
git commit -m "Add AI gap workflow state"
```

## Task 5: AI Configuration Modal and Status Badge

**Files:**
- Create: `src/components/AiConfigModal.jsx`
- Create: `src/components/AiStatusBadge.jsx`
- Modify: `src/components/AppShell.jsx`
- Modify: `styles.css`

- [ ] **Step 1: Add modal component**

Create `src/components/AiConfigModal.jsx`:

```jsx
import { useEffect, useMemo, useState } from "react";
import { clearAiConfig, loadAiConfig, saveAiConfig, validateAiConfig } from "../services/llm/configStore.js";
import { getProviderPreset, normalizeProviderConfig, providerPresets } from "../services/llm/providerPresets.js";
import { callLlm } from "../services/llm/callLlm.js";

export default function AiConfigModal({ open, onClose, onSaved }) {
  const [form, setForm] = useState(() => normalizeProviderConfig({ provider: "openai" }));
  const [showKey, setShowKey] = useState(false);
  const [status, setStatus] = useState("");
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    if (!open) return;
    setForm(loadAiConfig() || normalizeProviderConfig({ provider: "openai" }));
    setStatus("");
  }, [open]);

  const preset = useMemo(() => getProviderPreset(form.provider), [form.provider]);
  if (!open) return null;

  function updateField(key, value) {
    const next = key === "provider"
      ? normalizeProviderConfig({ provider: value, apiKey: form.apiKey, storage: form.storage })
      : normalizeProviderConfig({ ...form, [key]: value });
    setForm(next);
  }

  function save() {
    const result = saveAiConfig(form);
    if (!result.ok) {
      setStatus(result.errors.join(" "));
      return;
    }
    setStatus("配置已保存。");
    onSaved?.(result.config);
    onClose();
  }

  function clear() {
    clearAiConfig();
    setForm(normalizeProviderConfig({ provider: "openai" }));
    setStatus("配置已清除。");
    onSaved?.(null);
  }

  async function testConnection() {
    const validation = validateAiConfig(form);
    if (!validation.ok) {
      setStatus(validation.errors.join(" "));
      return;
    }
    setTesting(true);
    setStatus("正在测试连接...");
    try {
      await callLlm({
        config: form,
        prompt: {
          system: "You are a connection test assistant. Return a tiny JSON object.",
          user: "Return exactly {\"summary\":\"ok\",\"candidates\":[{\"title\":\"test\",\"gapType\":\"test\",\"researchQuestion\":\"test\",\"articleUnderstanding\":\"test\",\"evidenceChain\":[\"test\"],\"improvementPlan\":\"test\",\"methodRoute\":\"test\",\"dataRoute\":\"test\",\"risks\":[\"test\"],\"nextSearchKeywords\":[\"test\"],\"confidence\":\"low\"}],\"warnings\":[]}",
        },
        timeoutMs: 15000,
      });
      setStatus("连接测试成功。");
    } catch (error) {
      setStatus(error.message || "连接测试失败。");
    } finally {
      setTesting(false);
    }
  }

  return (
    <div className="modal-backdrop" role="presentation">
      <section className="ai-modal" role="dialog" aria-modal="true" aria-labelledby="ai-config-title">
        <div className="modal-title-row">
          <div>
            <span className="eyebrow">BYOK</span>
            <h2 id="ai-config-title">AI 配置</h2>
          </div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="关闭">
            ×
          </button>
        </div>
        <div className="provider-grid">
          {Object.values(providerPresets).map((item) => (
            <button
              key={item.id}
              className={`provider-option ${form.provider === item.id ? "selected" : ""}`}
              type="button"
              onClick={() => updateField("provider", item.id)}
            >
              <strong>{item.label}</strong>
              <span>{item.modelHint}</span>
            </button>
          ))}
        </div>
        <label>
          <span>API Key</span>
          <div className="secret-input">
            <input
              type={showKey ? "text" : "password"}
              value={form.apiKey}
              onChange={(event) => updateField("apiKey", event.target.value)}
              placeholder="输入您的 API Key"
            />
            <button type="button" onClick={() => setShowKey((value) => !value)}>
              {showKey ? "隐藏" : "显示"}
            </button>
          </div>
        </label>
        <label>
          <span>Base URL</span>
          <input value={form.baseUrl} onChange={(event) => updateField("baseUrl", event.target.value)} placeholder={preset.defaultBaseUrl || "https://example.com/v1"} />
        </label>
        <label>
          <span>模型 ID</span>
          <input value={form.model} onChange={(event) => updateField("model", event.target.value)} placeholder={preset.modelHint} />
        </label>
        <label className="check-line">
          <input type="checkbox" checked={form.storage === "local"} onChange={(event) => updateField("storage", event.target.checked ? "local" : "session")} />
          <span>记住在这台设备上</span>
        </label>
        <p className="hint-text">API Key 只保存在当前浏览器。不要在公共电脑保存 Key。</p>
        {status && <p className="status-text">{status}</p>}
        <div className="action-row">
          <button className="secondary-button" type="button" onClick={testConnection} disabled={testing}>
            {testing ? "测试中..." : "测试连接"}
          </button>
          <button className="secondary-button" type="button" onClick={clear}>
            清除配置
          </button>
          <button className="primary-button" type="button" onClick={save}>
            保存
          </button>
        </div>
      </section>
    </div>
  );
}
```

- [ ] **Step 2: Add status badge**

Create `src/components/AiStatusBadge.jsx`:

```jsx
export default function AiStatusBadge({ config, onClick }) {
  return (
    <button className={`ai-status-badge ${config ? "enabled" : ""}`} type="button" onClick={onClick}>
      {config ? `智能模式 · ${config.label || config.provider}` : "默认模式 · 规则引擎"}
    </button>
  );
}
```

- [ ] **Step 3: Wire AppShell**

Modify `src/components/AppShell.jsx`:

```jsx
import { useEffect, useState } from "react";
import AiConfigModal from "./AiConfigModal.jsx";
import AiStatusBadge from "./AiStatusBadge.jsx";
import { loadAiConfig } from "../services/llm/configStore.js";
```

Inside component:

```jsx
const [aiConfigOpen, setAiConfigOpen] = useState(false);
const [aiConfig, setAiConfig] = useState(null);

useEffect(() => {
  setAiConfig(loadAiConfig());
}, []);
```

Render in sidebar after brand block:

```jsx
<AiStatusBadge config={aiConfig} onClick={() => setAiConfigOpen(true)} />
<AiConfigModal open={aiConfigOpen} onClose={() => setAiConfigOpen(false)} onSaved={setAiConfig} />
```

- [ ] **Step 4: Add CSS**

Append to `styles.css`:

```css
.ai-status-badge {
  border: 1px solid #dbe3ec;
  border-radius: 8px;
  background: #ffffff;
  color: #344054;
  cursor: pointer;
  font-weight: 800;
  min-height: 40px;
  padding: 8px 10px;
  text-align: left;
}

.ai-status-badge.enabled {
  border-color: var(--accent);
  background: #f4fafc;
  color: var(--accent-strong);
}

.modal-backdrop {
  align-items: center;
  background: rgba(16, 24, 40, 0.45);
  display: flex;
  inset: 0;
  justify-content: center;
  padding: 20px;
  position: fixed;
  z-index: 50;
}

.ai-modal {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 24px 70px rgba(16, 24, 40, 0.25);
  display: grid;
  gap: 14px;
  max-height: calc(100vh - 40px);
  max-width: 860px;
  overflow: auto;
  padding: 22px;
  width: min(860px, 100%);
}

.modal-title-row {
  align-items: start;
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.icon-button {
  border: 0;
  background: transparent;
  color: #344054;
  cursor: pointer;
  font-size: 28px;
  line-height: 1;
}

.provider-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.provider-option {
  border: 1px solid #dbe3ec;
  border-radius: 8px;
  background: #fff;
  cursor: pointer;
  display: grid;
  gap: 5px;
  padding: 12px;
  text-align: left;
}

.provider-option.selected {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(23, 107, 135, 0.14);
}

.provider-option span {
  color: var(--muted);
  font-size: 12px;
}

.secret-input {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px;
}

.secret-input button {
  border: 1px solid #dbe3ec;
  border-radius: 7px;
  background: #fff;
  cursor: pointer;
  padding: 0 12px;
}
```

- [ ] **Step 5: Build verification**

Run:

```bash
npm.cmd run build
```

Expected: Vite build succeeds.

- [ ] **Step 6: Commit**

```bash
git add src/components/AiConfigModal.jsx src/components/AiStatusBadge.jsx src/components/AppShell.jsx styles.css
git commit -m "Add BYOK AI configuration UI"
```

## Task 6: Gap Page AI Deep Analysis Integration

**Files:**
- Modify: `src/pages/GapPage.jsx`
- Modify: `styles.css`

- [ ] **Step 1: Import services**

Modify `src/pages/GapPage.jsx` imports:

```jsx
import { useState } from "react";
import AiConfigModal from "../components/AiConfigModal.jsx";
import { loadAiConfig } from "../services/llm/configStore.js";
import { runGapAnalysis } from "../services/llm/gapAgent.js";
```

- [ ] **Step 2: Add local modal/config state**

Inside `GapPage`:

```jsx
const [aiConfigOpen, setAiConfigOpen] = useState(false);
const [aiConfig, setAiConfig] = useState(() => (typeof window === "undefined" ? null : loadAiConfig()));
const aiResult = state.aiGapAnalysis.result;
```

- [ ] **Step 3: Add AI handler**

Inside `GapPage`:

```jsx
async function runAiAnalysis() {
  const config = loadAiConfig();
  setAiConfig(config);
  if (!config) {
    setAiConfigOpen(true);
    return;
  }
  dispatch({ type: "SET_AI_GAP_LOADING", payload: true });
  try {
    const result = await runGapAnalysis({
      config,
      context: {
        report: state.report,
        topic: state.deepDive.topic,
        works,
        matrix,
        ruleCandidates: gapOptions,
      },
    });
    if (!result.valid) {
      dispatch({ type: "SET_AI_GAP_RESULT", payload: result });
      dispatch({ type: "SET_AI_GAP_ERROR", payload: result.validationErrors?.join("；") || result.warnings?.join("；") || "AI 返回结果不完整。" });
      return;
    }
    dispatch({ type: "SET_AI_GAP_RESULT", payload: result });
  } catch (error) {
    dispatch({ type: "SET_AI_GAP_ERROR", payload: error.message || "AI 分析失败" });
  }
}
```

- [ ] **Step 4: Add AI action row button**

In the top page card action row, add:

```jsx
<button className="secondary-button" type="button" onClick={runAiAnalysis} disabled={state.aiGapAnalysis.loading}>
  {state.aiGapAnalysis.loading ? "AI 分析中..." : aiConfig ? `AI 深度分析 · ${aiConfig.label || aiConfig.provider}` : "配置 API 后启用"}
</button>
```

Render modal near the top-level section:

```jsx
<AiConfigModal open={aiConfigOpen} onClose={() => setAiConfigOpen(false)} onSaved={setAiConfig} />
```

- [ ] **Step 5: Render AI result section**

Before the rule-generated `.gap-matrix`, render:

```jsx
{state.aiGapAnalysis.error && <p className="error-text">{state.aiGapAnalysis.error}</p>}
{aiResult && (
  <article className="page-card ai-result-panel">
    <div className="gap-title-row">
      <h3>AI 深度分析</h3>
      <span className="maturity-badge">{aiResult.provider} · {aiResult.model}</span>
    </div>
    <p className="table-hint">{aiResult.summary}</p>
    {aiResult.rawText && !aiResult.valid && (
      <pre className="raw-ai-output">{aiResult.rawText}</pre>
    )}
    <div className="gap-matrix">
      {aiResult.candidates.map((candidate) => (
        <article key={candidate.id} className="gap-card ai-gap-card">
          <div className="gap-title-row">
            <span className="gap-tag">{candidate.gapType}</span>
            <span className="maturity-badge">置信度 {confidenceLabel(candidate.confidence)}</span>
          </div>
          <h3>{candidate.title}</h3>
          <dl>
            <dt>研究问题</dt>
            <dd>{candidate.researchQuestion}</dd>
            <dt>文献理解</dt>
            <dd>{candidate.articleUnderstanding}</dd>
            <dt>证据链</dt>
            <dd>
              <ol className="compact-list">
                {candidate.evidenceChain.map((item) => <li key={item}>{item}</li>)}
              </ol>
            </dd>
            <dt>怎么改</dt>
            <dd>{candidate.improvementPlan}</dd>
            <dt>方法路线</dt>
            <dd>{candidate.methodRoute}</dd>
            <dt>数据路线</dt>
            <dd>{candidate.dataRoute}</dd>
            <dt>风险</dt>
            <dd>
              <ul className="compact-list">
                {candidate.risks.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </dd>
            <dt>补文献词</dt>
            <dd>{candidate.nextSearchKeywords.join("；")}</dd>
          </dl>
          <button
            className="primary-button"
            type="button"
            onClick={() => dispatch({
              type: "SELECT_AI_GAP_OPTION",
              payload: {
                id: candidate.id,
                draft: `AI 缺口方向：${candidate.title}。研究问题：${candidate.researchQuestion}。改进方案：${candidate.improvementPlan}。方法路线：${candidate.methodRoute}。数据路线：${candidate.dataRoute}。主要风险：${candidate.risks.join("；")}。`,
              },
            })}
          >
            采用这个 AI 方向
          </button>
        </article>
      ))}
    </div>
  </article>
)}
```

Add helper below `statusLabel`:

```jsx
function confidenceLabel(value) {
  return { low: "低", medium: "中", high: "高" }[value] || "中";
}
```

- [ ] **Step 6: Add CSS**

Append:

```css
.ai-result-panel {
  border-color: #cfe1e8;
}

.ai-gap-card {
  background: #fbfdff;
}

.raw-ai-output {
  background: #101828;
  border-radius: 8px;
  color: #e6edf4;
  line-height: 1.5;
  max-height: 280px;
  overflow: auto;
  padding: 12px;
  white-space: pre-wrap;
}
```

- [ ] **Step 7: Build verification**

```bash
npm.cmd run build
```

Expected: build succeeds.

- [ ] **Step 8: Commit**

```bash
git add src/pages/GapPage.jsx styles.css
git commit -m "Add AI deep gap analysis UI"
```

## Task 7: Documentation and Manual Pages Build

**Files:**
- Modify: `README.md`
- Modify/Create: `docs/`

- [ ] **Step 1: Update README**

Add a BYOK section:

```markdown
## BYOK 智能模式

默认情况下，本项目使用规则引擎，不需要 API Key。

如果需要 AI 深度分析，可以在页面里的 `AI 配置` 中填写自己的 API Key、Base URL 和模型 ID。当前支持 OpenAI/Codex、DeepSeek、Claude、小米和自定义 OpenAI-compatible 接口。

注意：GitHub Pages 是纯前端部署，API Key 只保存在你的浏览器中。不要在公共电脑保存 Key，仓库中也不要提交任何 Key。
```

- [ ] **Step 2: Run full verification**

```bash
npm.cmd test
npm.cmd run build
npm.cmd run build:pages
```

Expected: all pass and `docs/index.html` plus assets are generated.

- [ ] **Step 3: Add `.nojekyll` if missing**

```powershell
New-Item -ItemType File -Force docs\.nojekyll
```

- [ ] **Step 4: Check built references**

```powershell
$html = Get-Content -Raw -Path docs\index.html
$matches = [regex]::Matches($html, '(?:src|href)="\.\/([^"]+)"')
foreach ($m in $matches) {
  $path = Join-Path 'docs' $m.Groups[1].Value
  if (Test-Path $path) { "OK $path" } else { "MISSING $path" }
}
```

Expected: all referenced files print `OK`.

- [ ] **Step 5: Commit**

```bash
git add README.md docs package.json package-lock.json
git commit -m "Document and build BYOK AI mode"
```

## Task 8: Final Verification and Upload Handoff

**Files:**
- No source edits unless verification finds a bug.

- [ ] **Step 1: Check repository status**

```bash
git status -sb
```

Expected: clean working tree.

- [ ] **Step 2: Start local dev server if needed**

```bash
npm.cmd run dev
```

Expected: Vite reports a local URL, usually `http://127.0.0.1:5173/`.

- [ ] **Step 3: Manual smoke test**

Open local app and verify:

- Default mode badge appears.
- AI configuration modal opens.
- Saving invalid config shows validation errors.
- Saving a fake valid custom config enables the gap page button.
- Running with fake config returns a readable error and keeps rule cards visible.
- Existing OpenAlex literature search still works when network allows it.
- Gap note and proposal generation still work without AI.

- [ ] **Step 4: Prepare upload folder for GitHub Pages**

Use PowerShell:

```powershell
$target = '..\graduate-proposal-agent-web-byok-upload'
New-Item -ItemType Directory -Force $target | Out-Null
Copy-Item -Recurse -Force docs $target
Copy-Item -Force README.md,package.json,package-lock.json,index.html,styles.css,vite.config.js $target
Copy-Item -Recurse -Force src,tests $target
Get-ChildItem -Recurse $target | Select-Object FullName,Length
```

- [ ] **Step 5: Final user handoff**

Tell the user to upload all contents of:

```text
C:\Users\YH\Desktop\数模agent\graduate-proposal-agent-web-byok-upload
```

to GitHub, then keep Pages configured as:

```text
Source: Deploy from a branch
Branch: main
Folder: /docs
```

Do not re-add `.github/workflows/deploy.yml` unless the user's GitHub billing issue is resolved and they explicitly want Actions again.
