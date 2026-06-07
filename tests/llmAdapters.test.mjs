import assert from "node:assert/strict";
import { callLlm } from "../src/services/llm/callLlm.js";
import { runGapAnalysis } from "../src/services/llm/gapAgent.js";

const validPayload = {
  summary: "已选文献覆盖了车辆路径的综述和扩展算法，但可复现实验边界、服务约束和基线指标仍需要具体化。",
  candidates: [
    {
      title: "车辆路径服务约束与评价边界研究",
      gapType: "评价/基线缺口",
      researchQuestion: "如何在末端配送车辆路径中同时限定时间窗、容量和服务水平评价？",
      articleUnderstanding: "综述文献提供问题族，算法文献提供高威胁对照，但二者没有直接给出学生数据条件下的实验边界。",
      evidenceChain: ["综述覆盖问题族但缺少统一实验", "算法论文可作对照但场景边界较窄"],
      improvementPlan: "将服务约束、基线算法和评价指标写成统一实验框架。",
      methodRoute: "构建带时间窗和容量约束的路径模型，并比较启发式基线。",
      dataRoute: "使用公开 VRP 算例并构造末端配送订单仿真。",
      risks: ["公开算例与真实末端配送存在差距", "算法复杂度需要控制"],
      nextSearchKeywords: ["vehicle routing time windows benchmark", "last mile delivery service level"],
      confidence: "high",
    },
    {
      title: "车辆路径可复现实验边界研究",
      gapType: "数据/复现缺口",
      researchQuestion: "如何把末端配送路径问题限定到可复现实验和可解释仿真数据？",
      articleUnderstanding: "已有文献给出问题族和算法案例，但还需要转成学生可执行的数据方案。",
      evidenceChain: ["综述可作为问题族入口", "算法论文可作为高威胁对照"],
      improvementPlan: "先复现实验基线，再加入一类服务约束做小幅改进。",
      methodRoute: "复现基线启发式并增加敏感性分析。",
      dataRoute: "公开算例加仿真订单。",
      risks: ["不能声称真实企业落地", "需要核验代码和参数"],
      nextSearchKeywords: ["VRP reproducible benchmark", "last mile delivery simulation data"],
      confidence: "medium",
    },
  ],
};

const prompt = {
  system: "system message",
  user: "user message",
  responseSchemaName: "gap_deep_analysis",
  schema: {
    name: "gap_deep_analysis",
    strict: true,
    schema: { type: "object", properties: {}, required: [] },
  },
};

function jsonResponse(payload, ok = true, status = 200) {
  return {
    ok,
    status,
    async text() {
      return JSON.stringify(payload);
    },
    async json() {
      return payload;
    },
  };
}

{
  let request;
  const result = await callLlm(
    {
      provider: "openai",
      apiKey: "openai-key",
      baseUrl: "https://api.openai.com/v1",
      model: "gpt-test",
    },
    prompt,
    {
      fetchImpl: async (url, options) => {
        request = { url, options, body: JSON.parse(options.body) };
        return jsonResponse({ output_text: JSON.stringify(validPayload) });
      },
    },
  );
  assert.equal(request.url, "https://api.openai.com/v1/responses");
  assert.equal(request.options.headers.Authorization, "Bearer openai-key");
  assert.equal(request.body.model, "gpt-test");
  assert.equal(request.body.input[0].role, "system");
  assert.equal(request.body.text.format.name, "gap_deep_analysis");
  assert.equal(JSON.parse(result.text).candidates.length, 2);
}

{
  let request;
  const result = await callLlm(
    {
      provider: "deepseek",
      apiKey: "deepseek-key",
      baseUrl: "https://api.deepseek.com",
      model: "deepseek-test",
    },
    prompt,
    {
      fetchImpl: async (url, options) => {
        request = { url, options, body: JSON.parse(options.body) };
        return jsonResponse({ choices: [{ message: { content: JSON.stringify(validPayload) } }] });
      },
    },
  );
  assert.equal(request.url, "https://api.deepseek.com/chat/completions");
  assert.equal(request.body.response_format.type, "json_object");
  assert.equal(request.body.messages[1].content, "user message");
  assert.equal(JSON.parse(result.text).summary.includes("车辆路径"), true);
}

{
  let request;
  const result = await callLlm(
    {
      provider: "anthropic",
      apiKey: "claude-key",
      baseUrl: "https://api.anthropic.com",
      model: "claude-test",
    },
    prompt,
    {
      fetchImpl: async (url, options) => {
        request = { url, options, body: JSON.parse(options.body) };
        return jsonResponse({ content: [{ type: "text", text: JSON.stringify(validPayload) }] });
      },
    },
  );
  assert.equal(request.url, "https://api.anthropic.com/v1/messages");
  assert.equal(request.options.headers["x-api-key"], "claude-key");
  assert.equal(request.body.system, "system message");
  assert.equal(result.text.startsWith("{"), true);
}

{
  const result = await runGapAnalysis({
    config: {
      provider: "deepseek",
      apiKey: "deepseek-key",
      baseUrl: "https://api.deepseek.com",
      model: "deepseek-test",
    },
    context: {
      report: {
        degree: { level: "硕士", profile: { innovation: "有限创新" } },
        routing: { methodName: "运筹优化", dataConditionName: "公开数据", methodBoundary: "边界清楚" },
        pool: { core: [], adjacent: [] },
      },
      topic: { title: "车辆路径方向", scenario: "车辆路径", question: "如何验证", methodRoute: "优化", dataRoute: "仿真" },
      works: [{ title: "A paper", source: "Journal", abstract: "vehicle routing benchmark" }],
      matrix: { template: "车辆路径模板", dimensions: [], rows: [], highThreatPapers: [], summary: "summary" },
      ruleCandidates: [],
    },
    fetchImpl: async () => jsonResponse({ choices: [{ message: { content: JSON.stringify(validPayload) } }] }),
  });
  assert.equal(result.valid, true);
  assert.equal(result.provider, "deepseek");
  assert.equal(result.model, "deepseek-test");
  assert.equal(result.candidates[0].id, "ai-gap-1");
}

{
  await assert.rejects(
    () =>
      callLlm(
        { provider: "custom", apiKey: "bad", baseUrl: "https://api.example.com/v1", model: "m" },
        prompt,
        { fetchImpl: async () => jsonResponse({ error: "bad request" }, false, 400) },
      ),
    /AI 服务返回 400/,
  );
}

console.log("llm adapter tests passed");
