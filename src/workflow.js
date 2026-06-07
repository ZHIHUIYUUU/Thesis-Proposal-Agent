import { buildProposalPackage, buildTopicDeepDive, generateReport, refineReportForDirections } from "./engine.js";

export const routeSteps = [
  { route: "/intake", label: "需求采集" },
  { route: "/routing", label: "学科路由" },
  { route: "/direction-map", label: "方向地图" },
  { route: "/screening", label: "候选筛选" },
  { route: "/topic/:rank", label: "方向深挖" },
  { route: "/literature/:rank", label: "文献检索" },
  { route: "/gap/:rank", label: "缺口矩阵" },
  { route: "/proposal/:rank", label: "开题包" },
  { route: "/export", label: "下载中心" },
];

export function createInitialWorkflowState() {
  return {
    currentRoute: "/intake",
    intake: {
      degreeLevel: "",
      collection: "",
      subfield: "",
      method: "",
      dataCondition: "",
      advisorPreference: "",
      studentProfile: "",
      multiLevel: false,
    },
    report: null,
    directionSelections: [],
    selectedTopicRank: null,
    deepDive: null,
    literature: createLiteratureState(),
    aiGapAnalysis: createAiGapAnalysisState(),
    gapNote: "",
    gapChoiceId: "",
    proposal: null,
    notice: "",
  };
}

export function workflowReducer(state, action) {
  switch (action.type) {
    case "UPDATE_INTAKE":
      return updateIntake(state, action.payload || {});
    case "SET_ROUTE":
      return { ...state, currentRoute: action.payload };
    case "TOGGLE_DIRECTION":
      return toggleDirection(state, action.payload);
    case "SELECT_TOPIC":
      return selectTopic(state, action.payload);
    case "SET_LITERATURE_LOADING":
      return { ...state, literature: { ...state.literature, loading: Boolean(action.payload), error: "" } };
    case "SET_LITERATURE_ERROR":
      return { ...state, literature: { ...state.literature, loading: false, searched: true, error: String(action.payload || "检索失败") } };
    case "SET_LITERATURE":
      return setLiterature(state, action.payload);
    case "TOGGLE_LITERATURE_SELECTION":
      return toggleLiteratureSelection(state, action.payload);
    case "SET_AI_GAP_LOADING":
      return { ...state, aiGapAnalysis: { ...state.aiGapAnalysis, loading: Boolean(action.payload), error: "" } };
    case "SET_AI_GAP_RESULT":
      return { ...state, aiGapAnalysis: { loading: false, error: "", result: action.payload || null } };
    case "SET_AI_GAP_ERROR":
      return { ...state, aiGapAnalysis: { ...state.aiGapAnalysis, loading: false, error: String(action.payload || "AI 分析失败") } };
    case "CLEAR_AI_GAP_RESULT":
      return { ...state, aiGapAnalysis: createAiGapAnalysisState() };
    case "UPDATE_GAP_NOTE":
      return { ...state, aiGapAnalysis: createAiGapAnalysisState(), gapNote: String(action.payload || ""), gapChoiceId: "", proposal: null };
    case "SELECT_GAP_OPTION":
      return selectGapOption(state, action.payload || {});
    case "SELECT_AI_GAP_OPTION":
      return selectAiGapOption(state, action.payload || {});
    case "BUILD_PROPOSAL":
      return buildProposal(state);
    case "RESET_WORKFLOW":
      return createInitialWorkflowState();
    default:
      return state;
  }
}

function updateIntake(state, payload) {
  const nextIntake = { ...state.intake, ...payload };
  const majorChanged = ["degreeLevel", "collection", "subfield", "method", "dataCondition"].some(
    (key) => state.intake[key] !== nextIntake[key],
  );
  const baseReport = isIntakeComplete(nextIntake) ? generateReport(nextIntake) : null;
  const report = baseReport && state.directionSelections.length ? refineReportForDirections(baseReport, state.directionSelections, nextIntake) : baseReport;
  if (majorChanged) {
    return {
      ...state,
      intake: nextIntake,
      report: baseReport,
      directionSelections: [],
      selectedTopicRank: null,
      deepDive: null,
      literature: createLiteratureState(),
      aiGapAnalysis: createAiGapAnalysisState(),
      gapNote: "",
      gapChoiceId: "",
      proposal: null,
      notice: "",
    };
  }

  return {
    ...state,
    intake: nextIntake,
    report,
    proposal: state.deepDive && state.gapNote ? buildProposalPackage(report, state.deepDive, selectedWorks(state)) : state.proposal,
  };
}

function toggleDirection(state, key) {
  if (!key) {
    return state;
  }
  const exists = state.directionSelections.includes(key);
  const directionSelections = exists
    ? state.directionSelections.filter((item) => item !== key)
    : [...state.directionSelections, key];
  return {
    ...state,
    directionSelections,
    report: state.report ? refineReportForDirections(state.report, directionSelections, state.intake) : state.report,
    selectedTopicRank: null,
    deepDive: null,
    literature: createLiteratureState(),
    aiGapAnalysis: createAiGapAnalysisState(),
    gapNote: "",
    gapChoiceId: "",
    proposal: null,
  };
}

function selectTopic(state, rank) {
  if (!state.report) {
    return state;
  }
  const selectedRank = Number(rank);
  const deepDive = buildTopicDeepDive(state.report, selectedRank);
  return {
    ...state,
    selectedTopicRank: selectedRank,
    deepDive,
    literature: createLiteratureState(),
    aiGapAnalysis: createAiGapAnalysisState(),
    gapNote: "",
    gapChoiceId: "",
    proposal: null,
  };
}

function setLiterature(state, payload = {}) {
  const works = Array.isArray(payload) ? payload : payload.works || [];
  return {
    ...state,
    literature: createLiteratureState({
      works,
      searched: true,
      resultCount: Array.isArray(payload) ? works.length : payload.meta?.count ?? works.length,
      lastQuery: Array.isArray(payload) ? "" : payload.query || "",
      lastUrl: Array.isArray(payload) ? "" : payload.url || "",
    }),
    aiGapAnalysis: createAiGapAnalysisState(),
    gapNote: "",
    gapChoiceId: "",
    proposal: null,
  };
}

function createLiteratureState(overrides = {}) {
  return {
    works: [],
    selectedIds: [],
    loading: false,
    error: "",
    searched: false,
    resultCount: 0,
    lastQuery: "",
    lastUrl: "",
    ...overrides,
  };
}

function createAiGapAnalysisState(overrides = {}) {
  return {
    loading: false,
    error: "",
    result: null,
    ...overrides,
  };
}

function toggleLiteratureSelection(state, id) {
  if (!id) {
    return state;
  }
  const exists = state.literature.selectedIds.includes(id);
  return {
    ...state,
    literature: {
      ...state.literature,
      selectedIds: exists
        ? state.literature.selectedIds.filter((item) => item !== id)
        : [...state.literature.selectedIds, id],
    },
    aiGapAnalysis: createAiGapAnalysisState(),
    gapNote: "",
    gapChoiceId: "",
    proposal: null,
  };
}

function buildProposal(state) {
  if (!state.report || !state.deepDive || !state.gapNote.trim()) {
    return state;
  }
  const proposal = {
    ...buildProposalPackage(state.report, state.deepDive, selectedWorks(state)),
    userGapNote: state.gapNote,
  };
  return { ...state, proposal };
}

function selectGapOption(state, payload) {
  const draft = String(payload.draft || "").trim();
  if (!draft) {
    return state;
  }
  return {
    ...state,
    gapChoiceId: String(payload.id || ""),
    gapNote: draft,
    proposal: null,
  };
}

function selectAiGapOption(state, payload) {
  const draft = String(payload.draft || "").trim();
  if (!draft) {
    return state;
  }
  return {
    ...state,
    gapChoiceId: `ai:${String(payload.id || "selected")}`,
    gapNote: draft,
    proposal: null,
  };
}

export function canEnterRoute(state, route) {
  const normalized = normalizeRoute(route);
  if (normalized === "/intake") {
    return allow();
  }
  if (!isIntakeComplete(state.intake) || !state.report) {
    return deny("请先完成基本信息。");
  }
  if (normalized === "/routing" || normalized === "/direction-map") {
    return allow();
  }
  if (normalized === "/screening" && state.directionSelections.length === 0) {
    return deny("请先在方向地图里选择至少一个粗方向。");
  }
  if (normalized === "/screening") {
    return allow();
  }
  if (["/topic", "/literature", "/gap", "/proposal"].includes(normalized) && !state.selectedTopicRank) {
    return deny("请先选择一个候选方向。");
  }
  if (normalized === "/topic" || normalized === "/literature") {
    return allow();
  }
  if (normalized === "/gap" && state.literature.selectedIds.length < 2) {
    return deny("请先选择至少两篇候选文献，或回到文献页继续检索。");
  }
  if (normalized === "/gap") {
    return allow();
  }
  if (normalized === "/proposal" && !state.gapNote.trim()) {
    return deny("请先形成文献缺口草案。");
  }
  if (normalized === "/proposal") {
    return allow();
  }
  if (normalized === "/export" && !state.proposal) {
    return deny("请先生成开题包。");
  }
  if (normalized === "/export") {
    return allow();
  }
  return deny("未知页面。");
}

export function getNextRoute(state, route) {
  const normalized = normalizeRoute(route);
  const rank = state.selectedTopicRank || 1;
  const next = {
    "/intake": "/routing",
    "/routing": "/direction-map",
    "/direction-map": "/screening",
    "/screening": `/topic/${rank}`,
    "/topic": `/literature/${rank}`,
    "/literature": `/gap/${rank}`,
    "/gap": `/proposal/${rank}`,
    "/proposal": "/export",
  };
  return next[normalized] || "/intake";
}

export function serializeWorkflowState(state) {
  return JSON.stringify(state);
}

export function isIntakeComplete(intake) {
  return Boolean(
    intake.degreeLevel &&
      intake.collection &&
      intake.subfield &&
      intake.method &&
      intake.dataCondition &&
      intake.advisorPreference?.trim() &&
      intake.studentProfile?.trim(),
  );
}

export function normalizeRoute(route) {
  if (/^\/topic\/\d+/.test(route)) {
    return "/topic";
  }
  if (/^\/literature\/\d+/.test(route)) {
    return "/literature";
  }
  if (/^\/gap\/\d+/.test(route)) {
    return "/gap";
  }
  if (/^\/proposal\/\d+/.test(route)) {
    return "/proposal";
  }
  return route || "/intake";
}

function selectedWorks(state) {
  const selected = new Set(state.literature.selectedIds);
  return state.literature.works.filter((work) => selected.has(work.id));
}

function allow() {
  return { allowed: true, reason: "" };
}

function deny(reason) {
  return { allowed: false, reason };
}
