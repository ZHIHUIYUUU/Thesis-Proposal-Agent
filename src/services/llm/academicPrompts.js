import { academicSchemas } from "./academicSchemas.js";

const taskInstructions = {
  topicNarrowing: [
    "任务：把当前候选方向收窄为保守版、标准版、强化版三个可开题版本。",
    "每个版本必须明确研究对象、边界、研究问题、方法路线、数据路线、可行性风险、答辩焦点和补文献关键词。",
  ],
  searchStrategy: [
    "任务：生成 3-5 组英文 OpenAlex 检索式。",
    "每组必须说明检索目的、必须包含的术语、应避免的误检词、预期论文类型和误检风险。",
    "query 字段必须是英文，不要加入中文。",
  ],
  gapAnalysis: [
    "任务：基于已选文献和缺口矩阵生成可比较的开题缺口方向。",
    "每个方向必须包含至少两条证据链、两条风险、两条补文献词，并说明 openingValue、evidenceGap 和 scopeBoundary。",
  ],
  proposalDraft: [
    "任务：把规则开题包和已选缺口扩写成具体开题报告初稿。",
    "不得输出泛模板。每个部分都必须绑定当前题目、文献、方法和数据条件。",
  ],
};

export function buildAcademicPrompt(task, context = {}, feedback = "") {
  const schema = academicSchemas[task];
  if (!schema) throw new Error(`未知 AI 任务：${task}`);
  return {
    responseSchemaName: schema.name,
    schema,
    system: [
      "你是研究选题智能体，服务于毕业论文开题工作台。",
      "你的输出必须具体、可验证、可答辩，不能泛泛生成模板。",
      "只能基于用户当前上下文推理，不要声称已经阅读 PDF 全文，不要编造 DOI 或不存在的数据。",
      "输出严格 JSON，不要输出 Markdown 解释。",
      ...taskInstructions[task],
    ].join("\n"),
    user: [
      "请根据下面上下文完成任务。",
      feedback ? `上次输出需要修正的问题：${feedback}` : "",
      "",
      "学生画像与边界：",
      `- 培养层次：${text(context.report?.degree?.level)}`,
      `- 创新边界：${text(context.report?.degree?.profile?.innovation)}`,
      `- 方法传统：${text(context.report?.routing?.methodName)}；${text(context.report?.routing?.methodBoundary)}`,
      `- 数据条件：${text(context.report?.routing?.dataConditionName)}`,
      `- 导师偏好：${text(context.report?.intake?.advisorPreference)}`,
      `- 学生能力：${text(context.report?.intake?.studentProfile)}`,
      `- 核心证据池：${list(context.report?.pool?.core)}`,
      `- 相邻证据池：${list(context.report?.pool?.adjacent)}`,
      "",
      "当前方向：",
      `- 标题：${text(context.topic?.title)}`,
      `- 场景：${text(context.topic?.scenario)}`,
      `- 研究问题：${text(context.topic?.question)}`,
      `- 方法路线：${text(context.topic?.methodRoute)}`,
      `- 数据路线：${text(context.topic?.dataRoute)}`,
      "",
      "方向深挖信息：",
      `- 追问：${list(context.deepDive?.discussionQuestions)}`,
      `- 规则收窄选项：${list((context.deepDive?.narrowingOptions || []).map((item) => `${item.level}:${item.title}:${item.detail}`))}`,
      "",
      "检索信息：",
      `- 中文检索意图：${text(context.searchPlan?.query)}`,
      `- 当前英文检索式：${text(context.searchPlan?.openAlexQuery)}`,
      "",
      "已选文献：",
      ...formatWorks(context.works),
      "",
      "缺口矩阵：",
      `- 模板：${text(context.matrix?.template)}`,
      `- 总结：${text(context.matrix?.summary)}`,
      `- 维度：${list((context.matrix?.dimensions || []).map((item) => `${item.label}:${item.description}`))}`,
      ...formatMatrixRows(context.matrix?.rows),
      "",
      "规则候选缺口：",
      ...formatRuleCandidates(context.ruleCandidates),
      "",
      "规则开题包：",
      `- 中文题目：${text(context.proposal?.chineseTitle)}`,
      `- 核心问题：${text(context.proposal?.coreResearchProblem)}`,
      `- 方法：${text(context.proposal?.methodDataRoute?.method)}`,
      `- 数据：${text(context.proposal?.methodDataRoute?.data)}`,
      `- 已选缺口：${text(context.gapNote)}`,
      "",
      `请按 JSON Schema ${schema.name} 输出。`,
    ]
      .filter((line) => line !== "")
      .join("\n"),
  };
}

function formatWorks(works = []) {
  if (!works.length) return ["- 未选择文献。"];
  return works.slice(0, 8).map((work, index) =>
    [
      `文献 ${index + 1}:`,
      `- 题名：${text(work.title)}`,
      `- 来源/年份：${text(work.source)} / ${text(work.year)}`,
      `- 摘要或可见信息：${truncate(text(work.abstract || work.description || work.authors), 520)}`,
    ].join("\n"),
  );
}

function formatMatrixRows(rows = []) {
  return rows.slice(0, 8).map((row, index) => {
    const cells = (row.cells || []).map((cell) => `${cell.key || cell.value}:${cell.status || ""}:${cell.evidence || ""}`).join("；");
    return `- 矩阵行 ${index + 1}：${row.title}；威胁=${row.threatLevel || "待核验"}；${cells}`;
  });
}

function formatRuleCandidates(candidates = []) {
  if (!candidates.length) return ["- 暂无规则候选。"];
  return candidates.slice(0, 5).map((item, index) => `- 规则候选 ${index + 1}：${text(item.gapName || item.title)}；${text(item.gapLogic || item.improvementPlan)}`);
}

function list(value = []) {
  return (Array.isArray(value) ? value : [value]).map(text).filter((item) => item && item !== "未提供").join("；") || "未提供";
}

function text(value) {
  return String(value ?? "").replace(/\s+/g, " ").trim() || "未提供";
}

function truncate(value, maxLength) {
  return value.length > maxLength ? `${value.slice(0, maxLength)}...` : value;
}
