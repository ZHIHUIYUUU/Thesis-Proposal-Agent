import assert from "node:assert/strict";
import {
  buildAcademicContext,
  gapDraftFromAiCandidate,
  proposalDraftSections,
  usableGapCandidates,
  usableSearchQueries,
  usableTopicVersions,
  validationFeedbackFromResult,
} from "../src/services/llm/academicPresentation.js";

const state = {
  report: { id: "report-1" },
  deepDive: {
    topic: { title: "车辆路径服务约束研究", question: "如何界定服务约束？" },
    searchPlan: { openAlexQuery: "vehicle routing service level" },
  },
  literature: {
    selectedIds: ["w1"],
    works: [
      { id: "w1", title: "Selected paper", abstract: "selected abstract" },
      { id: "w2", title: "Ignored paper", abstract: "ignored abstract" },
    ],
  },
  ai: {
    topicNarrowing: { result: { summary: "收窄到服务约束和时间窗" } },
    searchStrategy: { result: { summary: "补充 benchmark query" } },
    gapAnalysis: { result: null },
    proposalDraft: { result: null },
  },
};

{
  const context = buildAcademicContext(state, { matrix: { summary: "矩阵摘要" } });
  assert.equal(context.report.id, "report-1");
  assert.equal(context.topic.title, "车辆路径服务约束研究");
  assert.equal(context.works.length, 1);
  assert.equal(context.works[0].title, "Selected paper");
  assert.equal(context.topicNarrowing.summary, "收窄到服务约束和时间窗");
  assert.equal(context.matrix.summary, "矩阵摘要");
}

{
  const draft = gapDraftFromAiCandidate({
    title: "服务约束与可复现实验缺口",
    researchQuestion: "如何验证时间窗约束下的路径优化改进？",
    articleUnderstanding: "综述给出方向，算法论文给出高威胁对照，但缺少学生可复现实验边界。",
    evidenceChain: ["综述覆盖最后一公里方向", "算法论文说明模型复杂度较高"],
    openingValue: "能形成可答辩的硕士开题。",
    evidenceGap: "缺少服务约束下统一基线。",
    scopeBoundary: "只做公开算例和可解释仿真。",
    improvementPlan: "补齐基线、评价指标和敏感性实验。",
    methodRoute: "混合整数规划与启发式基线。",
    dataRoute: "公开 VRP 算例加仿真订单。",
    risks: ["真实数据不足", "混合车队过难"],
    nextSearchKeywords: ["vehicle routing benchmark", "service level routing"],
  });
  assert.match(draft, /证据空白：缺少服务约束下统一基线/);
  assert.match(draft, /研究边界：只做公开算例和可解释仿真/);
  assert.match(draft, /主要风险：真实数据不足；混合车队过难/);
}

{
  const sections = proposalDraftSections({
    draft: {
      background: "背景",
      literatureReviewFrame: "综述框架",
      researchProblem: "研究问题",
      researchContent: ["内容一", "内容二", "内容三"],
      methodology: "方法",
      dataAndExperiment: "数据与实验",
      expectedInnovation: "创新",
      risksAndFallbacks: ["风险一", "风险二"],
      defenseQuestions: ["问题一", "问题二", "问题三"],
    },
  });
  assert.deepEqual(
    sections.map((section) => section.key),
    [
      "background",
      "literatureReviewFrame",
      "researchProblem",
      "researchContent",
      "methodology",
      "dataAndExperiment",
      "expectedInnovation",
      "risksAndFallbacks",
      "defenseQuestions",
    ],
  );
  assert.equal(sections.find((section) => section.key === "researchContent").items.length, 3);
}

{
  assert.deepEqual(validationFeedbackFromResult({ valid: true, validationErrors: ["ignored"] }), []);
  assert.deepEqual(validationFeedbackFromResult({ valid: false, validationErrors: ["缺少证据链"] }), ["缺少证据链"]);
  assert.deepEqual(validationFeedbackFromResult({ valid: false }), ["AI 返回内容不完整，需要补足后再采用。"]);
}

{
  assert.equal(
    usableTopicVersions({
      versions: [
        { level: "safe" },
        {
          level: "standard",
          title: "具体题目",
          researchObject: "对象",
          boundary: "边界",
          researchQuestion: "问题",
          methodRoute: "方法",
          dataRoute: "数据",
          feasibilityRisk: "风险",
          defenseFocus: "答辩",
        },
      ],
    }).length,
    1,
  );
  assert.equal(usableSearchQueries({ queries: [{ query: "" }, { label: "基准", query: "vehicle routing benchmark", intent: "找基准" }] }).length, 1);
  assert.equal(usableGapCandidates({ candidates: [{ title: "" }, { title: "缺口", researchQuestion: "问题", improvementPlan: "改进" }] }).length, 1);
}

console.log("academic presentation tests passed");
