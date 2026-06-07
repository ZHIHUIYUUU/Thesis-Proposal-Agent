export const GAP_ANALYSIS_JSON_SCHEMA = {
  name: "gap_deep_analysis",
  strict: true,
  schema: {
    type: "object",
    additionalProperties: false,
    required: ["summary", "candidates"],
    properties: {
      summary: { type: "string" },
      candidates: {
        type: "array",
        minItems: 2,
        maxItems: 4,
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
            evidenceChain: { type: "array", minItems: 2, items: { type: "string" } },
            improvementPlan: { type: "string" },
            methodRoute: { type: "string" },
            dataRoute: { type: "string" },
            risks: { type: "array", minItems: 2, items: { type: "string" } },
            nextSearchKeywords: { type: "array", minItems: 2, items: { type: "string" } },
            confidence: { type: "string", enum: ["low", "medium", "high"] },
          },
        },
      },
    },
  },
};

const REQUIRED_CANDIDATE_FIELDS = [
  "title",
  "gapType",
  "researchQuestion",
  "articleUnderstanding",
  "improvementPlan",
  "methodRoute",
  "dataRoute",
];

export function normalizeGapAnalysisPayload(payload, meta = {}) {
  const parsed = parsePayload(payload);
  if (parsed.error) {
    return {
      valid: false,
      provider: meta.provider || "",
      model: meta.model || "",
      summary: "",
      candidates: [],
      validationErrors: [parsed.error],
      warnings: [],
      rawText: parsed.rawText,
    };
  }

  const source = parsed.value || {};
  const candidates = Array.isArray(source.candidates)
    ? source.candidates.map((candidate, index) => normalizeCandidate(candidate, index))
    : [];
  const result = {
    valid: true,
    provider: meta.provider || "",
    model: meta.model || "",
    summary: cleanText(source.summary),
    candidates,
    validationErrors: [],
    warnings: [],
  };
  validateResult(result);
  result.valid = result.validationErrors.length === 0;
  return result;
}

function parsePayload(payload) {
  if (typeof payload !== "string") return { value: payload };
  const rawText = payload.trim();
  if (!rawText) return { value: {} };
  try {
    return { value: JSON.parse(stripCodeFence(rawText)) };
  } catch (error) {
    return { error: `AI 返回内容不是有效 JSON：${error.message}`, rawText };
  }
}

function stripCodeFence(text) {
  return text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");
}

function normalizeCandidate(candidate = {}, index) {
  return {
    id: cleanText(candidate.id) || `ai-gap-${index + 1}`,
    title: cleanText(candidate.title),
    gapType: cleanText(candidate.gapType),
    researchQuestion: cleanText(candidate.researchQuestion),
    articleUnderstanding: cleanText(candidate.articleUnderstanding),
    evidenceChain: cleanArray(candidate.evidenceChain),
    improvementPlan: cleanText(candidate.improvementPlan),
    methodRoute: cleanText(candidate.methodRoute),
    dataRoute: cleanText(candidate.dataRoute),
    risks: cleanArray(candidate.risks),
    nextSearchKeywords: cleanArray(candidate.nextSearchKeywords),
    confidence: normalizeConfidence(candidate.confidence),
  };
}

function validateResult(result) {
  if (result.summary.length < 30) {
    result.validationErrors.push("AI 总结过短，无法支撑开题缺口判断。");
  }
  if (result.candidates.length < 2) {
    result.validationErrors.push("AI 至少需要给出 2 个可比较的改进方向。");
  }
  result.candidates.forEach((candidate, index) => {
    REQUIRED_CANDIDATE_FIELDS.forEach((field) => {
      const minLength = field === "gapType" ? 3 : 8;
      if (!candidate[field] || candidate[field].length < minLength) {
        result.validationErrors.push(`第 ${index + 1} 个方向缺少具体的 ${field}。`);
      }
    });
    if (candidate.evidenceChain.length < 2) {
      result.validationErrors.push(`第 ${index + 1} 个方向至少需要 2 条证据链。`);
    }
    if (candidate.risks.length < 2) {
      result.validationErrors.push(`第 ${index + 1} 个方向至少需要 2 条风险。`);
    }
    if (candidate.nextSearchKeywords.length < 2) {
      result.validationErrors.push(`第 ${index + 1} 个方向至少需要 2 个补文献检索词。`);
    }
  });
}

function cleanArray(value) {
  return (Array.isArray(value) ? value : [value]).map(cleanText).filter(Boolean);
}

function cleanText(value) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function normalizeConfidence(value) {
  return ["low", "medium", "high"].includes(value) ? value : "medium";
}
