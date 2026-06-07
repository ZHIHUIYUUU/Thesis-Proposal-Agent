import assert from "node:assert/strict";
import { buildGapAnalysisPrompt } from "../src/services/llm/gapPrompt.js";
import {
  GAP_ANALYSIS_JSON_SCHEMA,
  normalizeGapAnalysisPayload,
} from "../src/services/llm/gapAnalysisSchema.js";

const context = {
  report: {
    degree: { level: "硕士", profile: { innovation: "有限创新，重在问题边界清楚和验证扎实" } },
    routing: {
      methodName: "运筹优化",
      dataConditionName: "公开数据或可解释仿真数据",
      methodBoundary: "需要明确约束、目标函数、基线与评价指标",
    },
    pool: {
      name: "物流与运筹优化",
      core: ["Transportation Science", "European Journal of Operational Research"],
      adjacent: ["Sustainability"],
      excluded: ["纯综述性科普材料"],
    },
  },
  topic: {
    title: "车辆路径的应用约束与落地边界方向",
    scenario: "车辆路径",
    question: "如何在末端配送车辆路径中同时界定服务约束、评价指标和可复现实验边界？",
    methodRoute: "构建带时间窗和容量约束的路径优化模型，并与启发式基线比较。",
    dataRoute: "使用公开算例或可解释仿真订单数据。",
  },
  works: [
    {
      id: "w1",
      title: "Last-mile delivery concepts: a survey from an operational research perspective",
      year: 2020,
      source: "OR Spectrum",
      abstract: "The paper reviews last-mile delivery concepts, vehicle routing variants, and operational constraints.",
    },
    {
      id: "w2",
      title: "The multi-vehicle truck-and-robot routing problem for last-mile delivery",
      year: 2023,
      source: "European Journal of Operational Research",
      abstract: "The paper studies a truck-and-robot routing problem with operational constraints and computational experiments.",
    },
  ],
  matrix: {
    template: "车辆路径问题模板",
    summary: "已选文献覆盖了末端配送和车辆路径，但可复现实验、服务约束和指标边界仍需要核验。",
    dimensions: [
      { key: "object", label: "研究对象", description: "车辆、订单、站点和服务对象是否明确" },
      { key: "constraint", label: "约束条件", description: "容量、时间窗、服务水平和资源限制" },
      { key: "baseline", label: "基线指标", description: "是否有可比较基线和评价指标" },
    ],
    rows: [
      {
        title: "Last-mile delivery concepts: a survey from an operational research perspective",
        threatLevel: "中威胁",
        cells: [
          { key: "object", value: "末端配送概念", status: "partial", evidence: "综述覆盖广但对象不够窄" },
          { key: "constraint", value: "多类约束", status: "partial", evidence: "提到约束但非统一实验" },
          { key: "baseline", value: "缺少统一基线", status: "missing", evidence: "综述不提供实验基线" },
        ],
      },
    ],
    highThreatPapers: [{ title: "The multi-vehicle truck-and-robot routing problem for last-mile delivery" }],
  },
  ruleCandidates: [
    {
      gapName: "车辆路径的应用约束与落地边界方向",
      gapType: "应用边界缺口",
      gapLogic: "需要把适用场景、不适用场景、假设条件和降难度方案说清楚。",
      improvementPlan: "把一般性讨论转成可复现实验。",
    },
  ],
};

{
  const prompt = buildGapAnalysisPrompt(context);
  assert.match(prompt.system, /研究选题智能体/);
  assert.match(prompt.system, /不要泛泛/);
  assert.match(prompt.user, /车辆路径的应用约束与落地边界方向/);
  assert.match(prompt.user, /Last-mile delivery concepts/);
  assert.match(prompt.user, /The multi-vehicle truck-and-robot routing problem/);
  assert.match(prompt.user, /车辆路径问题模板/);
  assert.match(prompt.user, /基线指标/);
  assert.match(prompt.user, /输出严格 JSON/);
  assert.equal(prompt.responseSchemaName, "gap_deep_analysis");
}

{
  assert.equal(GAP_ANALYSIS_JSON_SCHEMA.name, "gap_deep_analysis");
  assert.equal(GAP_ANALYSIS_JSON_SCHEMA.schema.required.includes("candidates"), true);
  assert.equal(GAP_ANALYSIS_JSON_SCHEMA.schema.properties.candidates.minItems, 2);
}

{
  const normalized = normalizeGapAnalysisPayload(
    {
      summary: "两篇文献说明车辆路径已有综述和多车辆扩展，但服务约束、可复现实验和评价边界仍可形成硕士开题问题。",
      candidates: [
        {
          title: "车辆路径服务约束与评价边界研究",
          gapType: "评价/基线缺口",
          researchQuestion: "在公开算例条件下，末端配送车辆路径如何同时界定时间窗、容量与服务水平指标？",
          articleUnderstanding: "一篇综述给出概念边界，另一篇具体算法论文给出可比较的车辆路径扩展问题。",
          evidenceChain: ["综述覆盖末端配送概念但实验基线不足", "算法论文聚焦特定路径扩展但未覆盖学生数据条件"],
          improvementPlan: "把服务约束、基线算法和评价指标写成同一实验设计。",
          methodRoute: "建立带时间窗和容量约束的路径优化模型，设置启发式和精确方法基线。",
          dataRoute: "使用公开 VRP 算例并构造末端配送订单仿真。",
          risks: ["公开数据可能不含真实服务时间", "算法复杂度需要降到硕士可完成"],
          nextSearchKeywords: ["vehicle routing time windows benchmark", "last mile delivery routing service level"],
          confidence: "high",
        },
        {
          title: "车辆路径可复现实验边界研究",
          gapType: "数据/复现缺口",
          researchQuestion: "如何把末端配送路径问题限定到可复现实验和可解释仿真数据？",
          articleUnderstanding: "已有文献给出问题族和算法案例，但还需要转成学生可执行的数据方案。",
          evidenceChain: ["综述可作为问题族入口", "算法论文可作为高威胁对照"],
          improvementPlan: "先复现实验基线，再加入一类服务约束做小幅改进。",
          methodRoute: "复现基线启发式，增加敏感性分析。",
          dataRoute: "公开算例加仿真订单。",
          risks: ["不能声称真实企业落地", "需要核验代码和参数"],
          nextSearchKeywords: ["VRP reproducible benchmark", "last mile delivery simulation data"],
          confidence: "medium",
        },
      ],
    },
    { provider: "openai", model: "gpt-test" },
  );
  assert.equal(normalized.valid, true);
  assert.equal(normalized.provider, "openai");
  assert.equal(normalized.model, "gpt-test");
  assert.equal(normalized.candidates.length, 2);
  assert.equal(normalized.candidates[0].id, "ai-gap-1");
  assert.equal(normalized.candidates[0].risks.length, 2);
}

{
  const invalid = normalizeGapAnalysisPayload(
    { summary: "太短", candidates: [{ title: "空泛方向" }] },
    { provider: "deepseek", model: "deepseek-test" },
  );
  assert.equal(invalid.valid, false);
  assert.ok(invalid.validationErrors.length >= 2);
  assert.equal(invalid.provider, "deepseek");
}

console.log("llm prompt schema tests passed");
