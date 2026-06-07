export const academicSchemas = {
  topicNarrowing: {
    name: "topicNarrowing",
    strict: true,
    schema: {
      type: "object",
      required: ["summary", "versions"],
      additionalProperties: false,
      properties: {
        summary: { type: "string" },
        versions: { type: "array", minItems: 3, maxItems: 3, items: { type: "object" } },
      },
    },
  },
  searchStrategy: {
    name: "searchStrategy",
    strict: true,
    schema: {
      type: "object",
      required: ["summary", "queries"],
      additionalProperties: false,
      properties: {
        summary: { type: "string" },
        queries: { type: "array", minItems: 3, maxItems: 5, items: { type: "object" } },
      },
    },
  },
  gapAnalysis: {
    name: "gapAnalysis",
    strict: true,
    schema: {
      type: "object",
      required: ["summary", "candidates"],
      additionalProperties: false,
      properties: {
        summary: { type: "string" },
        candidates: { type: "array", minItems: 2, maxItems: 4, items: { type: "object" } },
      },
    },
  },
  proposalDraft: {
    name: "proposalDraft",
    strict: true,
    schema: {
      type: "object",
      required: ["summary", "draft"],
      additionalProperties: false,
      properties: {
        summary: { type: "string" },
        draft: { type: "object" },
      },
    },
  },
};

const topicVersionFields = [
  "level",
  "title",
  "researchObject",
  "boundary",
  "researchQuestion",
  "methodRoute",
  "dataRoute",
  "feasibilityRisk",
  "defenseFocus",
];

const searchQueryFields = ["label", "query", "intent", "expectedPapers", "falsePositiveRisk"];

const gapCandidateFields = [
  "title",
  "gapType",
  "researchQuestion",
  "articleUnderstanding",
  "openingValue",
  "evidenceGap",
  "scopeBoundary",
  "improvementPlan",
  "methodRoute",
  "dataRoute",
];

const proposalDraftFields = [
  "background",
  "literatureReviewFrame",
  "researchProblem",
  "methodology",
  "dataAndExperiment",
  "expectedInnovation",
];

export function normalizeAcademicPayload(task, payload, meta = {}) {
  const parsed = parsePayload(payload);
  if (parsed.error) return invalidBase(task, meta, [parsed.error], parsed.rawText);
  if (task === "topicNarrowing") return normalizeTopicNarrowing(parsed.value, meta);
  if (task === "searchStrategy") return normalizeSearchStrategy(parsed.value, meta);
  if (task === "gapAnalysis") return normalizeGapAnalysis(parsed.value, meta);
  if (task === "proposalDraft") return normalizeProposalDraft(parsed.value, meta);
  return invalidBase(task, meta, [`未知 AI 任务：${task}`]);
}

function normalizeTopicNarrowing(value = {}, meta) {
  const versions = cleanArray(value.versions).map((item, index) => ({
    id: cleanText(item.id) || `topic-version-${index + 1}`,
    level: normalizeLevel(item.level, index),
    title: cleanText(item.title),
    researchObject: cleanText(item.researchObject),
    boundary: cleanText(item.boundary),
    researchQuestion: cleanText(item.researchQuestion),
    methodRoute: cleanText(item.methodRoute),
    dataRoute: cleanText(item.dataRoute),
    feasibilityRisk: cleanText(item.feasibilityRisk),
    defenseFocus: cleanText(item.defenseFocus),
    nextSearchKeywords: cleanArray(item.nextSearchKeywords).map(cleanText).filter(Boolean),
  }));
  const result = baseResult("topicNarrowing", meta, { summary: cleanText(value.summary), versions });
  validateSummary(result);
  if (versions.length !== 3) result.validationErrors.push("AI 追问收窄必须给出保守版、标准版、强化版三个版本。");
  validateObjects(result, versions, topicVersionFields, "版本");
  versions.forEach((item, index) => {
    if (item.nextSearchKeywords.length < 2) result.validationErrors.push(`第 ${index + 1} 个版本至少需要 2 个补文献关键词。`);
  });
  return finalize(result);
}

function normalizeSearchStrategy(value = {}, meta) {
  const queries = cleanArray(value.queries).map((item, index) => ({
    id: cleanText(item.id) || `search-query-${index + 1}`,
    label: cleanText(item.label),
    query: cleanText(item.query),
    intent: cleanText(item.intent),
    mustHaveTerms: cleanArray(item.mustHaveTerms).map(cleanText).filter(Boolean),
    avoidTerms: cleanArray(item.avoidTerms).map(cleanText).filter(Boolean),
    expectedPapers: cleanText(item.expectedPapers),
    falsePositiveRisk: cleanText(item.falsePositiveRisk),
  }));
  const result = baseResult("searchStrategy", meta, { summary: cleanText(value.summary), queries });
  validateSummary(result);
  if (queries.length < 3) result.validationErrors.push("AI 检索策略至少需要 3 组英文检索式。");
  validateObjects(result, queries, searchQueryFields, "检索式");
  queries.forEach((item, index) => {
    if (!/^[\x00-\x7F\s\-()]+$/.test(item.query)) result.validationErrors.push(`第 ${index + 1} 组检索式必须是英文 OpenAlex 查询。`);
    if (item.mustHaveTerms.length < 2) result.validationErrors.push(`第 ${index + 1} 组检索式至少需要 2 个 must-have terms。`);
  });
  return finalize(result);
}

function normalizeGapAnalysis(value = {}, meta) {
  const candidates = cleanArray(value.candidates).map((item, index) => ({
    id: cleanText(item.id) || `ai-gap-${index + 1}`,
    title: cleanText(item.title),
    gapType: cleanText(item.gapType),
    researchQuestion: cleanText(item.researchQuestion),
    articleUnderstanding: cleanText(item.articleUnderstanding),
    evidenceChain: cleanArray(item.evidenceChain).map(cleanText).filter(Boolean),
    openingValue: cleanText(item.openingValue),
    evidenceGap: cleanText(item.evidenceGap),
    scopeBoundary: cleanText(item.scopeBoundary),
    improvementPlan: cleanText(item.improvementPlan),
    methodRoute: cleanText(item.methodRoute),
    dataRoute: cleanText(item.dataRoute),
    risks: cleanArray(item.risks).map(cleanText).filter(Boolean),
    nextSearchKeywords: cleanArray(item.nextSearchKeywords).map(cleanText).filter(Boolean),
    confidence: ["low", "medium", "high"].includes(item.confidence) ? item.confidence : "medium",
  }));
  const result = baseResult("gapAnalysis", meta, { summary: cleanText(value.summary), candidates });
  validateSummary(result);
  if (candidates.length < 2) result.validationErrors.push("AI 缺口分析至少需要 2 个可比较方向。");
  validateObjects(result, candidates, gapCandidateFields, "缺口方向");
  candidates.forEach((item, index) => {
    if (item.evidenceChain.length < 2) result.validationErrors.push(`第 ${index + 1} 个方向至少需要 2 条证据链。`);
    if (item.risks.length < 2) result.validationErrors.push(`第 ${index + 1} 个方向至少需要 2 条风险。`);
    if (item.nextSearchKeywords.length < 2) result.validationErrors.push(`第 ${index + 1} 个方向至少需要 2 个补文献词。`);
  });
  return finalize(result);
}

function normalizeProposalDraft(value = {}, meta) {
  const draft = value.draft || {};
  const normalizedDraft = {
    background: cleanText(draft.background),
    literatureReviewFrame: cleanText(draft.literatureReviewFrame),
    researchProblem: cleanText(draft.researchProblem),
    researchContent: cleanArray(draft.researchContent).map(cleanText).filter(Boolean),
    methodology: cleanText(draft.methodology),
    dataAndExperiment: cleanText(draft.dataAndExperiment),
    expectedInnovation: cleanText(draft.expectedInnovation),
    risksAndFallbacks: cleanArray(draft.risksAndFallbacks).map(cleanText).filter(Boolean),
    defenseQuestions: cleanArray(draft.defenseQuestions).map(cleanText).filter(Boolean),
  };
  const result = baseResult("proposalDraft", meta, { summary: cleanText(value.summary), draft: normalizedDraft });
  validateSummary(result);
  proposalDraftFields.forEach((field) => {
    if (normalizedDraft[field].length < 20) result.validationErrors.push(`开题包扩写缺少具体的 ${field}。`);
  });
  if (normalizedDraft.researchContent.length < 3) result.validationErrors.push("研究内容至少需要 3 条。");
  if (normalizedDraft.risksAndFallbacks.length < 2) result.validationErrors.push("风险预案至少需要 2 条。");
  if (normalizedDraft.defenseQuestions.length < 3) result.validationErrors.push("答辩问题至少需要 3 条。");
  return finalize(result);
}

function parsePayload(payload) {
  if (typeof payload !== "string") return { value: payload || {} };
  const rawText = payload.trim();
  if (!rawText) return { value: {} };
  try {
    return { value: JSON.parse(rawText.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "")) };
  } catch (error) {
    return { error: `AI 返回内容不是有效 JSON：${error.message}`, rawText };
  }
}

function baseResult(task, meta, fields) {
  return {
    task,
    provider: meta.provider || "",
    model: meta.model || "",
    valid: true,
    validationErrors: [],
    rawText: meta.rawText || "",
    ...fields,
  };
}

function invalidBase(task, meta, validationErrors, rawText = "") {
  return {
    task,
    provider: meta.provider || "",
    model: meta.model || "",
    valid: false,
    validationErrors,
    rawText,
  };
}

function finalize(result) {
  result.valid = result.validationErrors.length === 0;
  return result;
}

function validateSummary(result) {
  if (!result.summary || result.summary.length < 20) result.validationErrors.push("AI 总结过短，无法支撑后续判断。");
}

function validateObjects(result, items, fields, label) {
  items.forEach((item, index) => {
    fields.forEach((field) => {
      const minLength = ["level", "gapType", "label"].includes(field) ? 2 : 8;
      if (!item[field] || String(item[field]).length < minLength) {
        result.validationErrors.push(`第 ${index + 1} 个${label}缺少具体的 ${field}。`);
      }
    });
  });
}

function cleanArray(value) {
  if (Array.isArray(value)) return value;
  if (value == null || value === "") return [];
  return [value];
}

function cleanText(value) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function normalizeLevel(value, index) {
  const text = cleanText(value);
  if (["safe", "standard", "advanced"].includes(text)) return text;
  return ["safe", "standard", "advanced"][index] || "standard";
}
