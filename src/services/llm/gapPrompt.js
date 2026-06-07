import { GAP_ANALYSIS_JSON_SCHEMA } from "./gapAnalysisSchema.js";

export function buildGapAnalysisPrompt(context = {}) {
  const { report = {}, topic = {}, works = [], matrix = {}, ruleCandidates = [] } = context;
  return {
    responseSchemaName: GAP_ANALYSIS_JSON_SCHEMA.name,
    schema: GAP_ANALYSIS_JSON_SCHEMA,
    system: [
      "你是研究选题智能体，任务是帮助学生从已选文献中形成可答辩、可验证的开题缺口。",
      "不要泛泛总结，不要把论文题名改写成方向，不要声称已阅读 PDF 全文。",
      "必须基于用户已选文献题名、摘要、来源、年份、缺口矩阵和规则候选方向做具体场景具体分析。",
      "输出中文，严格围绕研究问题、证据链、怎么改、方法路线、数据路线、风险和补文献词。",
    ].join("\n"),
    user: [
      "请根据下面上下文生成 AI 深度缺口分析。",
      "",
      "学生与学科边界：",
      `- 培养层次：${text(report.degree?.level)}`,
      `- 创新边界：${text(report.degree?.profile?.innovation)}`,
      `- 方法传统：${text(report.routing?.methodName)}。${text(report.routing?.methodBoundary)}`,
      `- 数据条件：${text(report.routing?.dataConditionName)}`,
      `- 核心证据池：${list(report.pool?.core)}`,
      `- 相邻证据池：${list(report.pool?.adjacent)}`,
      "",
      "当前候选方向：",
      `- 标题：${text(topic.title)}`,
      `- 场景：${text(topic.scenario)}`,
      `- 核心问题：${text(topic.question)}`,
      `- 方法路线：${text(topic.methodRoute)}`,
      `- 数据路线：${text(topic.dataRoute)}`,
      "",
      "已选文献证据：",
      ...works.map(formatWork),
      "",
      "缺口矩阵：",
      `- 模板：${text(matrix.template)}`,
      `- 总结：${text(matrix.summary)}`,
      `- 维度：${formatDimensions(matrix.dimensions)}`,
      `- 高威胁文献：${list((matrix.highThreatPapers || []).map((item) => item.title))}`,
      ...formatMatrixRows(matrix.rows),
      "",
      "规则引擎候选方向：",
      ...ruleCandidates.slice(0, 4).map(formatRuleCandidate),
      "",
      "请输出严格 JSON，字段必须符合 gap_deep_analysis schema：summary 与 candidates。每个 candidate 必须包含 title、gapType、researchQuestion、articleUnderstanding、evidenceChain、improvementPlan、methodRoute、dataRoute、risks、nextSearchKeywords、confidence。",
      "要求：至少 2 个候选方向；每个方向要说明为什么、证据来自哪几篇文献、具体怎么改、需要什么数据或仿真条件、不能过度声称什么。",
    ].join("\n"),
  };
}

function formatWork(work, index) {
  return [
    `文献 ${index + 1}:`,
    `- 题名：${text(work.title)}`,
    `- 年份/来源：${text(work.year)} / ${text(work.source)}`,
    `- 摘要或可见信息：${truncate(text(work.abstract || work.description || work.authors), 520)}`,
  ].join("\n");
}

function formatDimensions(dimensions = []) {
  return dimensions.map((dimension) => `${dimension.label}（${dimension.description}）`).join("；") || "暂无维度";
}

function formatMatrixRows(rows = []) {
  return rows.slice(0, 6).map((row, index) => {
    const cells = (row.cells || [])
      .map((cell) => `${cell.value || cell.key}:${cell.status || "unknown"}，证据=${cell.evidence || ""}`)
      .join("；");
    return `- 矩阵行 ${index + 1}：${row.title}；威胁=${row.threatLevel || "待核验"}；${cells}`;
  });
}

function formatRuleCandidate(candidate, index) {
  return [
    `规则方向 ${index + 1}: ${text(candidate.gapName || candidate.title)}`,
    `- 类型：${text(candidate.gapType)}`,
    `- 缺口判断：${text(candidate.gapLogic)}`,
    `- 怎么改：${text(candidate.improvementPlan)}`,
  ].join("\n");
}

function list(value = []) {
  return (Array.isArray(value) ? value : [value]).map(text).filter(Boolean).join("；") || "未提供";
}

function text(value) {
  return String(value ?? "").replace(/\s+/g, " ").trim() || "未提供";
}

function truncate(value, maxLength) {
  return value.length > maxLength ? `${value.slice(0, maxLength)}...` : value;
}
