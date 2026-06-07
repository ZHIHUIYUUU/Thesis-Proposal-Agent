# AI Workflow Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add high-quality BYOK AI actions to topic narrowing, literature search strategy, gap analysis quality repair, and proposal draft expansion.

**Architecture:** Reuse the existing `callLlm()` adapter and add task-specific prompt/schema modules behind a shared `runAcademicAgent()` entry point. Expand workflow state from a single `aiGapAnalysis` object to a namespaced `ai` object while preserving the previous persisted state. Integrate each AI result as a structured panel in the relevant page, keeping rule-engine content as fallback.

**Tech Stack:** React 19, React Router 7, Vite 6, browser `fetch`, Web Storage, existing Node test scripts.

---

## Task 1: Shared Academic Agent Layer

**Files:**
- Create: `src/services/llm/academicAgent.js`
- Create: `src/services/llm/academicSchemas.js`
- Create: `src/services/llm/academicPrompts.js`
- Test: `tests/academicAgents.test.mjs`
- Modify: `package.json`

- [ ] Write tests for topic/search/proposal/gap schemas and the shared runner using fake fetch.
- [ ] Verify tests fail because modules do not exist.
- [ ] Implement `runAcademicAgent()`, prompt builders, schema validators, and JSON normalizers.
- [ ] Run `node tests/academicAgents.test.mjs`.
- [ ] Add it to `npm test` and run `npm.cmd test`.
- [ ] Commit `Add academic AI agent layer`.

## Task 2: Workflow AI State

**Files:**
- Modify: `src/workflow.js`
- Test: `tests/aiWorkflow.test.mjs`

- [ ] Add failing tests for `state.ai.topicNarrowing`, `state.ai.searchStrategy`, `state.ai.gapAnalysis`, `state.ai.proposalDraft`.
- [ ] Add migration compatibility from old `state.aiGapAnalysis` to `state.ai.gapAnalysis`.
- [ ] Implement generic AI reducer actions: `SET_AI_TASK_LOADING`, `SET_AI_TASK_RESULT`, `SET_AI_TASK_ERROR`, `CLEAR_AI_TASK`, `ADOPT_AI_TOPIC_VERSION`, `ADOPT_AI_SEARCH_QUERY`, `ADOPT_AI_PROPOSAL_DRAFT`.
- [ ] Preserve old gap actions as wrappers for compatibility.
- [ ] Run workflow tests and full tests.
- [ ] Commit `Add namespaced AI workflow state`.

## Task 3: Topic Deep-Dive AI UI

**Files:**
- Modify: `src/pages/TopicPage.jsx`
- Modify: `styles.css`
- Test: `tests/aiComponents.test.mjs`

- [ ] Add component tests for `AI 追问收窄`, `保守版`, `标准版`, `强化版`.
- [ ] Implement topic AI button, config modal fallback, loading/error states, result cards, and adoption.
- [ ] Run component tests, full tests, and `npm.cmd run build`.
- [ ] Commit `Add AI topic narrowing`.

## Task 4: Literature Search Strategy AI UI

**Files:**
- Modify: `src/pages/LiteraturePage.jsx`
- Modify: `styles.css`
- Test: `tests/aiComponents.test.mjs`

- [ ] Add component tests for `AI 生成检索策略`, strategy cards, and selected query text.
- [ ] Implement search strategy button, result cards, and `使用这组检索式` OpenAlex search path.
- [ ] Keep the original rule query button.
- [ ] Run component tests and full tests.
- [ ] Commit `Add AI literature search strategy`.

## Task 5: Gap Analysis Quality Repair

**Files:**
- Modify: `src/services/llm/gapAnalysisSchema.js`
- Modify: `src/services/llm/gapPrompt.js`
- Modify: `src/pages/GapPage.jsx`
- Modify: `styles.css`
- Test: `tests/llmPromptSchema.test.mjs`
- Test: `tests/aiComponents.test.mjs`

- [ ] Add tests for grouped validation feedback, `openingValue`, `scopeBoundary`, and `evidenceGap`.
- [ ] Update prompt/schema and page rendering.
- [ ] Add `重新生成并补全` with validation feedback passed as `feedback`.
- [ ] Run prompt/schema tests and full tests.
- [ ] Commit `Improve AI gap analysis quality`.

## Task 6: Proposal Draft AI UI

**Files:**
- Modify: `src/pages/ProposalPage.jsx`
- Modify: `src/workflow.js`
- Modify: `styles.css`
- Test: `tests/aiWorkflow.test.mjs`
- Test: `tests/aiComponents.test.mjs`

- [ ] Add tests for proposal draft result/adoption.
- [ ] Implement `AI 扩写开题包`, draft panel, section rendering, and adoption into workflow export state.
- [ ] Keep rule proposal fallback.
- [ ] Run full tests and `npm.cmd run build`.
- [ ] Commit `Add AI proposal expansion`.

## Task 7: Docs Build and Final Verification

**Files:**
- Modify: `README.md`
- Modify: `docs/`

- [ ] Document the four AI entry points.
- [ ] Run `npm.cmd test`.
- [ ] Run `npm.cmd run build:pages`.
- [ ] Restore `docs/.nojekyll`.
- [ ] Commit `Build Pages with expanded AI workflow`.

