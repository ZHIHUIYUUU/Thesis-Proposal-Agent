# AI Workflow Expansion Design

## Goal

Extend the BYOK intelligent mode from one Gap Matrix action into four high-value academic workflow actions:

1. Topic deep-dive narrowing.
2. Literature search strategy generation.
3. Higher-quality gap matrix analysis.
4. Proposal package expansion.

The existing rule engine remains the default and fallback. AI augments decisions only after the user has selected enough context.

## Product Principles

- The app is a thesis proposal workbench, not a chat app. AI appears as structured task panels in the existing flow.
- Every AI result must be grounded in current workflow state: student intake, selected topic, selected literature, gap matrix, and chosen gap note where relevant.
- Outputs must be concrete enough for opening-report work: research object, variables, constraints, methods, data, evidence, risks, and next actions.
- No AI action may block the default no-key workflow. Missing API config opens the config modal; failed requests show actionable errors and preserve rule-engine content.
- The static browser BYOK model remains unchanged. API keys stay in localStorage and are not committed or sent anywhere except the selected provider request.

## AI Entry Points

### 1. Direction Deep-Dive: AI Narrowing

Page: `src/pages/TopicPage.jsx`

User action: `AI 追问收窄`

Input context:

- Full intake profile.
- Current report routing and evidence pools.
- Selected topic and its rule-generated discussion questions.
- Current narrowing options.

Output:

- `summary`: short diagnosis of the topic's current breadth.
- `versions`: exactly three versions: `safe`, `standard`, `advanced`.
- Each version includes title, research object, boundary, research question, method route, data route, feasibility risk, defense focus, and next literature keywords.

UX:

- Render a panel above the rule-generated narrowing options.
- Each AI version can be adopted. Adoption updates the topic working note, not the underlying engine topic title.
- If output is incomplete, show missing fields per version and still render usable valid fields.

### 2. Literature Search: AI Search Strategy

Page: `src/pages/LiteraturePage.jsx`

User action: `AI 生成检索策略`

Input context:

- Current topic, route, evidence pool, OpenAlex base query, method/data route.
- Current year filter and search constraints.

Output:

- `summary`: why the current query needs broadening/narrowing.
- `queries`: 3 to 5 English OpenAlex-compatible query plans.
- Each query plan includes label, query, intent, must-have terms, avoid terms, expected papers, and risk of false positives.

UX:

- Render query strategy cards between the query box and search button.
- User can click `使用这组检索式` to run OpenAlex with that generated query.
- The original rule-generated query remains visible and usable.

### 3. Gap Matrix: Quality-Gated AI Analysis

Page: `src/pages/GapPage.jsx`

Current action: `AI 深度分析`

Improvement:

- Tighten schema and prompt so each candidate must include at least two evidence-chain items, two risks, and two next-search keywords.
- Add validator output grouped by candidate instead of one long red line.
- Add a `重新生成并补全` action that passes validation feedback back to the model.

Output remains candidate-based, but each candidate also includes:

- `openingValue`: why this can become an opening-report problem.
- `scopeBoundary`: what the thesis will not claim.
- `evidenceGap`: what is known from selected papers versus what remains unverified.

### 4. Proposal Package: AI Expansion

Page: `src/pages/ProposalPage.jsx`

User action: `AI 扩写开题包`

Input context:

- Built rule-engine proposal.
- User-selected gap note.
- Selected literature.
- Topic and report routing.

Output:

- Structured opening-report draft:
  - background
  - literatureReviewFrame
  - researchProblem
  - researchContent
  - methodology
  - dataAndExperiment
  - expectedInnovation
  - risksAndFallbacks
  - defenseQuestions
- Each section must include concrete details and cannot be a generic template.

UX:

- Render an AI expanded draft panel below the rule proposal.
- User can adopt the draft into export state, but the rule-engine proposal stays available as fallback.

## Architecture

Create a shared task runner:

- `src/services/llm/academicAgent.js`
  - `runAcademicAgent({ task, config, context, feedback, fetchImpl, timeoutMs })`
  - Builds prompts, calls the LLM, normalizes and validates output.

Create task-specific files:

- `topicNarrowingPrompt.js` / `topicNarrowingSchema.js`
- `searchStrategyPrompt.js` / `searchStrategySchema.js`
- update `gapPrompt.js` / `gapAnalysisSchema.js`
- `proposalDraftPrompt.js` / `proposalDraftSchema.js`

Workflow state expands from `aiGapAnalysis` only to:

```js
ai: {
  topicNarrowing: { loading, error, result },
  searchStrategy: { loading, error, result },
  gapAnalysis: { loading, error, result, validationFeedback },
  proposalDraft: { loading, error, result }
}
```

Compatibility:

- Existing persisted states with `aiGapAnalysis` should be migrated into `ai.gapAnalysis`.
- Existing code can read a helper-normalized state to avoid crashes after localStorage upgrades.

## Error Handling

- Missing config opens `AiConfigModal`.
- HTTP errors show provider status and body excerpt.
- Invalid JSON shows the raw model text in a collapsed/raw block.
- Schema errors show per-candidate/per-section missing fields.
- The app never removes rule-engine results because of an AI failure.

## Testing

Add or extend tests:

- Prompt/schema tests for topic narrowing, search strategy, gap quality, and proposal draft.
- Adapter tests remain provider-agnostic.
- Workflow tests for new `ai` state, migration from old `aiGapAnalysis`, invalidation on topic/literature/gap changes.
- Component/server-render tests for new panels and buttons.
- Full `npm test`.
- `npm run build:pages`.

## Deployment

Regenerate `docs/` after implementation and keep `docs/.nojekyll`.

