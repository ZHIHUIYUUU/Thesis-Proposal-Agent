# BYOK AI Mode Design

## Goal

Add an optional BYOK (Bring Your Own Key) intelligent mode to the research topic workstation while preserving the current no-key rule-engine mode as the default. Users without an API key can still use the app exactly as they do today; users with an API key can enable AI-assisted gap analysis from the literature gap matrix page.

## Product Positioning

The application will have two clear modes:

1. **Default Mode: Rule Engine**
   - No login, no API key, no backend.
   - Uses the existing deterministic workflow, OpenAlex metadata search, scoring logic, candidate generation, and proposal package generation.
   - This remains the fallback whenever AI configuration is missing or an AI request fails.

2. **Intelligent Mode: BYOK API**
   - User configures their own provider, API key, base URL, and model ID.
   - The app stores this configuration only in the user's browser.
   - The first AI feature is "AI 深度分析" on the gap matrix page.
   - The AI output enhances the existing gap candidates rather than replacing the whole workflow.

The app will not include any project-owned API key. It will not ask for ChatGPT membership credentials. It will not claim that ChatGPT Plus, Pro, or other consumer subscriptions can be used as API credentials.

## Provider Scope

The UI should support provider presets plus a custom provider path:

- **OpenAI / Codex**
  - Adapter: OpenAI Responses API.
  - Default base URL: `https://api.openai.com/v1`.
  - Example models: `gpt-5.4`, `gpt-5.5`, `gpt-5-codex`.
  - Codex is treated as an OpenAI model family, not as a separate provider.

- **DeepSeek**
  - Adapter: OpenAI-compatible Chat Completions.
  - Default base URL: `https://api.deepseek.com/v1`.
  - Example models: `deepseek-chat`, `deepseek-reasoner`.

- **Anthropic / Claude**
  - Adapter: Anthropic Messages API.
  - Default base URL: `https://api.anthropic.com`.
  - Model ID remains user-editable because model names change over time.

- **Xiaomi**
  - Adapter: OpenAI-compatible Chat Completions by default.
  - Base URL and model ID are user-editable.
  - The preset exists for user convenience but does not hard-code an unstable endpoint.

- **Custom OpenAI Compatible**
  - Adapter: OpenAI-compatible Chat Completions.
  - User supplies base URL and model ID.
  - Intended for providers such as SiliconFlow, OpenRouter, Zhipu, Qwen-compatible gateways, Moonshot-compatible gateways, or school/private gateways.

## Security Model

Because the current deployment is static GitHub Pages, all BYOK calls happen from the user's browser. This is less secure than a server-side proxy, so the UI must be explicit:

- API keys are never committed to the repository.
- API keys are never placed in build-time environment variables.
- API keys are never sent to the app owner.
- Users can choose storage mode:
  - `sessionStorage`: default, cleared when the browser session ends.
  - `localStorage`: optional "remember on this device" mode.
- The settings modal provides a visible "清除 API 配置" action.
- The API key input is masked by default and can be temporarily revealed.
- The UI warns users not to save keys on shared or public computers.

The app should not promise enterprise-grade key security in BYOK browser mode. A future backend mode can improve this, but it is outside this first implementation.

## First AI Feature

The first release implements only one AI feature:

### Gap Matrix AI Deep Analysis

Location: `GapPage.jsx`

Button behavior:

- If no valid AI configuration exists:
  - Show "配置 API 后启用".
  - Clicking opens the AI configuration modal.

- If configuration exists:
  - Button label includes the provider or model, such as "AI 深度分析 · DeepSeek".
  - Clicking sends the current gap analysis context to the provider adapter.
  - Loading, success, and error states are visible.
  - On success, AI-enhanced gap candidates appear above or alongside the existing rule-generated candidates.
  - On failure, the rule-generated candidates remain visible and usable.

The AI request payload contains:

- Current route and discipline information.
- Selected topic and deep-dive details.
- Selected literature metadata: title, year, source, authors, abstract, concepts, cited count, URL.
- Existing literature readings.
- Existing gap matrix dimensions, cells, coverage, high-threat papers.
- Existing rule-generated gap candidates.

The AI output must be structured and normalized before rendering.

## AI Output Contract

The normalized AI gap analysis result should use this shape:

```js
{
  provider: "openai" | "anthropic" | "deepseek" | "xiaomi" | "custom",
  model: "string",
  generatedAt: "ISO timestamp",
  summary: "string",
  candidates: [
    {
      id: "string",
      title: "string",
      gapType: "string",
      researchQuestion: "string",
      articleUnderstanding: "string",
      evidenceChain: ["string"],
      improvementPlan: "string",
      methodRoute: "string",
      dataRoute: "string",
      risks: ["string"],
      nextSearchKeywords: ["string"],
      confidence: "low" | "medium" | "high"
    }
  ],
  warnings: ["string"]
}
```

Minimum validation:

- `summary` must be a non-empty string.
- At least one candidate must be present.
- Each candidate must include title, gap type, research question, evidence chain, improvement plan, method route, data route, risks, and next search keywords.
- If parsing or validation fails, show the model's raw text in a read-only fallback panel and keep the rule-generated cards unchanged.

## Architecture

Add a small LLM service layer under `src/services/llm/`:

- `providerPresets.js`
  - Defines provider labels, default base URLs, default adapter types, and editable example model IDs.

- `configStore.js`
  - Reads, writes, validates, and clears AI configuration.
  - Supports session and local storage.
  - Never logs the key.

- `adapters/openaiResponses.js`
  - Calls OpenAI Responses API.
  - Used for OpenAI and Codex models.

- `adapters/openaiCompatibleChat.js`
  - Calls `/chat/completions`.
  - Used for DeepSeek, Xiaomi default, and custom OpenAI-compatible providers.

- `adapters/anthropicMessages.js`
  - Calls Anthropic Messages API.
  - Used for Claude-compatible provider mode.

- `callLlm.js`
  - Chooses adapter from config.
  - Handles timeout, JSON extraction, parsing, and normalized error messages.

- `gapPrompt.js`
  - Builds the system and user prompt for gap analysis.
  - Keeps prompt text out of React components.

- `gapAnalysisSchema.js`
  - Provides runtime validation for AI gap analysis output.

Add UI components:

- `src/components/AiConfigModal.jsx`
  - Modal for provider selection, API key, base URL, model ID, storage mode, test connection, save, and clear.

- `src/components/AiStatusBadge.jsx`
  - Compact badge showing default mode or enabled intelligent mode.

Modify pages/components:

- `src/components/AppShell.jsx`
  - Add "AI 配置" entry point and status badge.

- `src/pages/GapPage.jsx`
  - Add AI deep analysis button.
  - Render AI-enhanced results when available.
  - Preserve rule-generated candidates.

- `src/state/WorkflowContext.jsx`
  - Store AI analysis result and loading/error state.
  - Do not store API key in workflow state.

## Error Handling

The UI should handle:

- Missing API key.
- Invalid base URL.
- Provider CORS failure.
- Authentication failure.
- Rate limit failure.
- Network timeout.
- Non-JSON model output.
- Empty or incomplete JSON.

Every failure should keep the default rule-engine output available. The user should never lose existing selections or selected literature because an AI request failed.

## Testing

Add focused tests for:

- Provider preset normalization.
- Config validation without persisting real keys.
- Adapter request-shape construction using mocked fetch.
- Gap prompt includes selected literature and matrix dimensions.
- AI output parser accepts valid JSON and rejects incomplete candidates.
- Workflow reducer stores AI analysis result and error states correctly.

Browser/manual verification:

- Default mode still works without configuration.
- AI config modal saves and clears settings.
- Gap page button opens config when no API is set.
- Mocked AI response renders enhanced candidates without removing rule cards.
- Build still emits `docs/` for manual GitHub Pages deployment.

## Deployment

The first implementation continues to support static GitHub Pages:

- `npm run build:pages` generates `docs/`.
- Users upload `docs/` to GitHub.
- Repository Pages source remains `main / docs`.

No backend is required for the BYOK browser mode. A future backend proxy can be added later if the project needs stronger key security or server-side tool use.

## Out Of Scope

- Project-owned API billing.
- Server-side API proxy.
- User account system.
- ChatGPT membership login.
- File upload or PDF full-text parsing.
- Multi-agent orchestration.
- Automatic OpenAlex tool-calling loop.
- Persisting conversation history to a database.

These can be revisited after the first BYOK gap-analysis feature is stable.
