export function buildAcademicContext(state = {}, extras = {}) {
  return {
    report: state.report || null,
    topic: state.deepDive?.topic || null,
    deepDive: state.deepDive || null,
    searchPlan: state.deepDive?.searchPlan || null,
    topicNarrowing: state.ai?.topicNarrowing?.result || null,
    searchStrategy: state.ai?.searchStrategy?.result || null,
    gapAnalysis: state.ai?.gapAnalysis?.result || state.aiGapAnalysis?.result || null,
    proposalDraft: state.ai?.proposalDraft?.result || null,
    works: selectedWorksFromState(state),
    ...extras,
  };
}

export function validationFeedbackFromResult(result = {}) {
  if (result.valid !== false) {
    return [];
  }
  if (Array.isArray(result.validationErrors) && result.validationErrors.length) {
    return result.validationErrors;
  }
  return ["AI 返回内容不完整，需要补足后再采用。"];
}

export function gapDraftFromAiCandidate(candidate = {}) {
  return [
    `AI 缺口方向：${text(candidate.title)}`,
    `研究问题：${text(candidate.researchQuestion)}`,
    `文献理解：${text(candidate.articleUnderstanding)}`,
    `证据链：${joinList(candidate.evidenceChain)}`,
    `开题价值：${text(candidate.openingValue)}`,
    `证据空白：${text(candidate.evidenceGap)}`,
    `研究边界：${text(candidate.scopeBoundary)}`,
    `改进方案：${text(candidate.improvementPlan)}`,
    `方法路线：${text(candidate.methodRoute)}`,
    `数据路线：${text(candidate.dataRoute)}`,
    `主要风险：${joinList(candidate.risks)}`,
    `下一步补文献：${joinList(candidate.nextSearchKeywords)}`,
  ].join("。");
}

export function proposalDraftSections(result = {}) {
  const draft = result.draft || {};
  return [
    { key: "background", title: "研究背景与现实问题", content: text(draft.background) },
    { key: "literatureReviewFrame", title: "文献综述组织方式", content: text(draft.literatureReviewFrame) },
    { key: "researchProblem", title: "拟解决的核心问题", content: text(draft.researchProblem) },
    { key: "researchContent", title: "研究内容", items: cleanList(draft.researchContent) },
    { key: "methodology", title: "研究方法与技术路线", content: text(draft.methodology) },
    { key: "dataAndExperiment", title: "数据来源与实验设计", content: text(draft.dataAndExperiment) },
    { key: "expectedInnovation", title: "预期创新点", content: text(draft.expectedInnovation) },
    { key: "risksAndFallbacks", title: "风险与备用方案", items: cleanList(draft.risksAndFallbacks) },
    { key: "defenseQuestions", title: "答辩预判问题", items: cleanList(draft.defenseQuestions) },
  ];
}

export function usableTopicVersions(result = {}) {
  return (result.versions || []).filter((item) =>
    hasAllText(item, [
      "title",
      "researchObject",
      "boundary",
      "researchQuestion",
      "methodRoute",
      "dataRoute",
      "feasibilityRisk",
      "defenseFocus",
    ]),
  );
}

export function usableSearchQueries(result = {}) {
  return (result.queries || []).filter((item) => hasAllText(item, ["label", "query", "intent"]));
}

export function usableGapCandidates(result = {}) {
  return (result.candidates || []).filter((item) => hasAllText(item, ["title", "researchQuestion", "improvementPlan"]));
}

function selectedWorksFromState(state) {
  const selectedIds = new Set(state?.literature?.selectedIds || []);
  return (state?.literature?.works || []).filter((work) => selectedIds.has(work.id));
}

function cleanList(value) {
  const items = Array.isArray(value) ? value : value ? [value] : [];
  return items.map(text).filter((item) => item && item !== "未提供");
}

function joinList(value) {
  const items = cleanList(value);
  return items.length ? items.join("；") : "未提供";
}

function text(value) {
  return String(value ?? "").replace(/\s+/g, " ").trim() || "未提供";
}

function hasAllText(item, fields) {
  return fields.every((field) => String(item?.[field] ?? "").trim().length > 0);
}
