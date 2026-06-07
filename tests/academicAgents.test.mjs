import assert from "node:assert/strict";
import { runAcademicAgent } from "../src/services/llm/academicAgent.js";
import { buildAcademicPrompt } from "../src/services/llm/academicPrompts.js";
import { normalizeAcademicPayload } from "../src/services/llm/academicSchemas.js";

const baseContext = {
  report: {
    intake: { studentProfile: "会基础 Python，能读英文文献。", advisorPreference: "偏工程应用。" },
    degree: { level: "硕士", profile: { innovation: "有限创新，强调边界和验证。" } },
    routing: {
      methodName: "运筹优化",
      methodBoundary: "需要明确目标函数、约束、基线和评价指标。",
      dataConditionName: "公开数据或可解释仿真",
    },
    pool: {
      core: ["Transportation Science", "European Journal of Operational Research"],
      adjacent: ["OR Spectrum"],
      excluded: ["无实验的泛综述"],
    },
  },
  topic: {
    title: "车辆路径的应用约束与落地边界方向",
    scenario: "车辆路径",
    question: "如何界定末端配送路径优化的服务约束和可复现实验边界？",
    methodRoute: "构建带时间窗和容量约束的路径优化模型。",
    dataRoute: "公开 VRP 算例和仿真订单。",
  },
  deepDive: {
    discussionQuestions: ["配送对象是什么？", "服务约束如何定义？"],
    narrowingOptions: [{ level: "standard", title: "标准版本", detail: "边界清楚。" }],
  },
  searchPlan: {
    openAlexQuery: "vehicle routing last mile delivery benchmark",
    query: "车辆路径 last mile delivery benchmark",
  },
  works: [
    {
      title: "Last-mile delivery concepts: a survey from an operational research perspective",
      source: "OR Spectrum",
      year: 2020,
      abstract: "Survey on last-mile delivery, vehicle routing, and operational constraints.",
    },
    {
      title: "The multi-vehicle truck-and-robot routing problem for last-mile delivery",
      source: "European Journal of Operational Research",
      year: 2023,
      abstract: "Routing model and computational experiments for last-mile delivery.",
    },
  ],
  matrix: {
    template: "车辆路径场景矩阵",
    summary: "约束、基线和数据复现维度覆盖不足。",
    dimensions: [{ label: "基线指标", description: "可比较基线和评价指标" }],
    rows: [{ title: "Last-mile delivery concepts", threatLevel: "中威胁", cells: [] }],
  },
  ruleCandidates: [{ gapName: "车辆路径的基线对比与评价指标方向", gapLogic: "基线不足。" }],
  proposal: {
    chineseTitle: "车辆路径应用约束研究",
    coreResearchProblem: "如何验证服务约束下的路径优化改进？",
    methodDataRoute: { method: "路径优化与基线对比", data: "公开算例和仿真数据" },
    defenseQuestions: ["数据怎么来？"],
  },
  gapNote: "需要把车辆路径问题收窄到可验证的服务约束和评价边界。",
};

const topicPayload = {
  summary: "当前题目仍偏宽，需要从配送对象、服务约束和数据边界三个方面收窄。",
  versions: [
    {
      level: "safe",
      title: "末端配送车辆路径服务约束建模研究",
      researchObject: "末端配送订单与配送车辆",
      boundary: "只讨论单仓到客户的公开算例场景",
      researchQuestion: "如何在时间窗和容量约束下验证路径方案改进？",
      methodRoute: "建立车辆路径模型并比较最近邻和节约算法基线。",
      dataRoute: "使用公开 VRP 算例和仿真订单。",
      feasibilityRisk: "真实企业数据不可得。",
      defenseFocus: "约束定义和基线是否合理。",
      nextSearchKeywords: ["vehicle routing time windows benchmark", "last mile delivery VRP"],
    },
    {
      level: "standard",
      title: "考虑服务水平的末端配送车辆路径优化研究",
      researchObject: "末端配送车辆、客户订单和服务时间窗",
      boundary: "限定同城最后一公里配送",
      researchQuestion: "如何平衡配送成本和准时率？",
      methodRoute: "建立多目标路径优化模型并做敏感性分析。",
      dataRoute: "公开算例加仿真服务时间。",
      feasibilityRisk: "多目标权重需要解释。",
      defenseFocus: "评价指标和目标函数对应关系。",
      nextSearchKeywords: ["last mile delivery service level", "multiobjective vehicle routing"],
    },
    {
      level: "advanced",
      title: "考虑混合车队与时间窗的末端配送路径优化研究",
      researchObject: "卡车、无人车和客户订单",
      boundary: "只比较小规模混合车队算例",
      researchQuestion: "混合车队在时间窗约束下是否优于传统车队？",
      methodRoute: "构建混合整数模型并设计启发式求解。",
      dataRoute: "公开基准算例改造为混合车队场景。",
      feasibilityRisk: "算法复杂度可能偏高。",
      defenseFocus: "混合车队假设和可完成性。",
      nextSearchKeywords: ["truck robot routing", "hybrid fleet vehicle routing"],
    },
  ],
};

const searchPayload = {
  summary: "当前检索式覆盖车辆路径，但需要拆成综述、基准、约束和混合车队四类检索。",
  queries: [
    {
      label: "基准算例",
      query: "vehicle routing problem benchmark last mile delivery time windows",
      intent: "找可复现实验和基线算法。",
      mustHaveTerms: ["vehicle routing", "benchmark"],
      avoidTerms: ["policy", "survey only"],
      expectedPapers: "基准算例和实验论文",
      falsePositiveRisk: "可能混入普通 VRP 算法论文。",
    },
    {
      label: "服务水平",
      query: "last mile delivery routing service level time window",
      intent: "找服务约束和评价指标。",
      mustHaveTerms: ["last mile delivery", "service level"],
      avoidTerms: ["marketing"],
      expectedPapers: "服务水平路径优化论文",
      falsePositiveRisk: "可能混入平台运营论文。",
    },
    {
      label: "混合车队",
      query: "truck robot routing problem last mile delivery",
      intent: "找高威胁混合车队对照论文。",
      mustHaveTerms: ["truck", "robot", "routing"],
      avoidTerms: ["pure drone survey"],
      expectedPapers: "卡车无人车路径论文",
      falsePositiveRisk: "模型难度可能高于硕士开题。",
    },
  ],
};

const gapPayload = {
  summary: "已有文献覆盖方向和部分模型，但基线、边界和可复现实验仍不足。",
  candidates: [
    {
      title: "车辆路径服务约束与评价边界研究",
      gapType: "评价/基线缺口",
      researchQuestion: "如何验证时间窗和容量约束下的路径改进？",
      articleUnderstanding: "综述提供方向，算法论文提供高威胁对照，但缺少学生可复现实验边界。",
      evidenceChain: ["综述覆盖方向但无统一实验", "算法论文说明高威胁模型但假设较窄"],
      openingValue: "能转化为模型、基线和评价指标清晰的硕士开题。",
      evidenceGap: "知道最后一公里和混合车队有研究，但未核验服务约束下的统一基线。",
      scopeBoundary: "不声称真实企业落地，只验证公开算例和仿真情景。",
      improvementPlan: "收窄到时间窗、容量和服务水平指标，设置两个基线。",
      methodRoute: "路径优化模型、启发式基线、敏感性分析。",
      dataRoute: "公开 VRP 算例和仿真订单。",
      risks: ["真实服务时间缺失", "混合车队算法复杂"],
      nextSearchKeywords: ["vehicle routing time windows benchmark", "last mile delivery service level"],
      confidence: "high",
    },
    {
      title: "车辆路径可复现实验边界研究",
      gapType: "数据/复现缺口",
      researchQuestion: "如何把末端配送限定到可复现实验？",
      articleUnderstanding: "文献给出问题族和模型案例，但数据方案仍需学生化。",
      evidenceChain: ["综述作为问题族入口", "算法论文作为高威胁对照"],
      openingValue: "能保证开题可完成、可答辩。",
      evidenceGap: "缺少面向当前数据条件的参数和实验矩阵。",
      scopeBoundary: "不做企业级部署。",
      improvementPlan: "先复现基线再加入服务约束。",
      methodRoute: "基线复现和小幅约束扩展。",
      dataRoute: "公开算例和仿真参数。",
      risks: ["参数解释困难", "创新幅度有限"],
      nextSearchKeywords: ["VRP reproducible benchmark", "routing simulation data"],
      confidence: "medium",
    },
  ],
};

const proposalPayload = {
  summary: "开题应围绕车辆路径服务约束和可复现实验展开。",
  draft: {
    background: "最后一公里配送需要在成本、准时率和服务约束之间权衡。",
    literatureReviewFrame: "先综述 VRP 和最后一公里配送，再比较服务水平、时间窗和混合车队研究。",
    researchProblem: "在公开数据条件下，如何验证服务约束下的车辆路径优化改进？",
    researchContent: ["构建问题边界", "建立模型", "设计基线", "完成仿真实验"],
    methodology: "采用混合整数规划建模、启发式基线和敏感性分析。",
    dataAndExperiment: "使用公开 VRP 算例，构造服务时间窗和订单规模情景。",
    expectedInnovation: "创新在于把服务约束、基线和可复现实验统一到硕士可完成框架。",
    risksAndFallbacks: ["若混合车队过难，退回传统车队", "若数据不足，采用可解释仿真"],
    defenseQuestions: ["数据来源是否可靠？", "基线为何公平？", "创新是否过度？"],
  },
};

function responseFor(task) {
  const payloads = { topicNarrowing: topicPayload, searchStrategy: searchPayload, gapAnalysis: gapPayload, proposalDraft: proposalPayload };
  return {
    ok: true,
    status: 200,
    async text() {
      return JSON.stringify({ choices: [{ message: { content: JSON.stringify(payloads[task]) } }] });
    },
    async json() {
      return { choices: [{ message: { content: JSON.stringify(payloads[task]) } }] };
    },
  };
}

for (const task of ["topicNarrowing", "searchStrategy", "gapAnalysis", "proposalDraft"]) {
  const prompt = buildAcademicPrompt(task, baseContext);
  assert.match(prompt.system, /研究选题智能体/);
  assert.match(prompt.user, /车辆路径/);
  assert.equal(prompt.schema.name, task);
}

{
  const normalized = normalizeAcademicPayload("topicNarrowing", topicPayload, { provider: "xiaomi", model: "mimo" });
  assert.equal(normalized.valid, true);
  assert.equal(normalized.versions.length, 3);
  assert.equal(normalized.versions[0].level, "safe");
}

{
  const invalid = normalizeAcademicPayload("searchStrategy", { summary: "太短", queries: [] }, {});
  assert.equal(invalid.valid, false);
  assert.ok(invalid.validationErrors.length >= 2);
}

for (const task of ["topicNarrowing", "searchStrategy", "gapAnalysis", "proposalDraft"]) {
  const result = await runAcademicAgent({
    task,
    config: {
      provider: "custom",
      apiKey: "test-key",
      baseUrl: "https://api.example.com/v1",
      model: "custom-model",
    },
    context: baseContext,
    fetchImpl: async () => responseFor(task),
  });
  assert.equal(result.valid, true, `${task}: ${result.validationErrors?.join("；")}`);
  assert.equal(result.task, task);
  assert.equal(result.provider, "custom");
}

console.log("academic agent tests passed");
