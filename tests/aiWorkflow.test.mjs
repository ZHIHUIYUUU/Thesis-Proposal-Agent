import assert from "node:assert/strict";
import { createInitialWorkflowState, workflowReducer } from "../src/workflow.js";

const completeIntake = {
  degreeLevel: "master",
  collection: "engineering",
  subfield: "mechanical-engineering",
  method: "optimization",
  dataCondition: "public-simulation",
  advisorPreference: "偏工程应用、可完成性和规范开题。",
  studentProfile: "会基础 Python，能读英文文献，希望题目不要太虚。",
  multiLevel: false,
};

function readyState() {
  let state = createInitialWorkflowState();
  state = workflowReducer(state, { type: "UPDATE_INTAKE", payload: completeIntake });
  state = workflowReducer(state, { type: "TOGGLE_DIRECTION", payload: "scenario:车辆路径" });
  state = workflowReducer(state, { type: "SELECT_TOPIC", payload: 1 });
  state = workflowReducer(state, {
    type: "SET_LITERATURE",
    payload: {
      works: [
        { id: "w1", title: "A", source: "Transportation Science" },
        { id: "w2", title: "B", source: "European Journal of Operational Research" },
      ],
      meta: { count: 2 },
    },
  });
  state = workflowReducer(state, { type: "TOGGLE_LITERATURE_SELECTION", payload: "w1" });
  state = workflowReducer(state, { type: "TOGGLE_LITERATURE_SELECTION", payload: "w2" });
  return state;
}

{
  const state = createInitialWorkflowState();
  assert.deepEqual(state.aiGapAnalysis, { loading: false, error: "", result: null });
  assert.deepEqual(Object.keys(state.ai), ["topicNarrowing", "searchStrategy", "gapAnalysis", "proposalDraft"]);
  assert.deepEqual(state.ai.topicNarrowing, { loading: false, error: "", result: null });
  assert.deepEqual(state.ai.gapAnalysis, { loading: false, error: "", result: null, validationFeedback: [] });
}

{
  let state = createInitialWorkflowState();
  state = workflowReducer(state, { type: "SET_AI_GAP_LOADING", payload: true });
  assert.equal(state.aiGapAnalysis.loading, true);
  assert.equal(state.aiGapAnalysis.error, "");
  state = workflowReducer(state, {
    type: "SET_AI_GAP_RESULT",
    payload: { summary: "AI summary", candidates: [{ id: "a" }] },
  });
  assert.equal(state.aiGapAnalysis.loading, false);
  assert.equal(state.aiGapAnalysis.error, "");
  assert.equal(state.aiGapAnalysis.result.summary, "AI summary");
  assert.equal(state.ai.gapAnalysis.result.summary, "AI summary");
}

{
  let state = createInitialWorkflowState();
  state = workflowReducer(state, { type: "SET_AI_GAP_ERROR", payload: "bad key" });
  assert.equal(state.aiGapAnalysis.loading, false);
  assert.equal(state.aiGapAnalysis.error, "bad key");
  assert.equal(state.ai.gapAnalysis.error, "bad key");
}

{
  let state = createInitialWorkflowState();
  state = workflowReducer(state, { type: "SET_AI_TASK_LOADING", task: "topicNarrowing", payload: true });
  assert.equal(state.ai.topicNarrowing.loading, true);
  state = workflowReducer(state, {
    type: "SET_AI_TASK_RESULT",
    task: "topicNarrowing",
    payload: { summary: "topic summary", versions: [{ level: "safe" }] },
  });
  assert.equal(state.ai.topicNarrowing.loading, false);
  assert.equal(state.ai.topicNarrowing.result.summary, "topic summary");
  state = workflowReducer(state, { type: "SET_AI_TASK_ERROR", task: "searchStrategy", payload: "network bad" });
  assert.equal(state.ai.searchStrategy.error, "network bad");
}

{
  let state = createInitialWorkflowState();
  state = workflowReducer(state, {
    type: "SET_AI_TASK_RESULT",
    task: "gapAnalysis",
    payload: { summary: "gap summary", candidates: [] },
    validationFeedback: ["第 1 个方向缺少风险。"],
  });
  assert.deepEqual(state.ai.gapAnalysis.validationFeedback, ["第 1 个方向缺少风险。"]);
}

{
  let state = readyState();
  state = workflowReducer(state, {
    type: "SET_AI_GAP_RESULT",
    payload: { summary: "AI summary", candidates: [] },
  });
  state = workflowReducer(state, { type: "UPDATE_GAP_NOTE", payload: "manual note" });
  assert.equal(state.gapNote, "manual note");
  assert.equal(state.aiGapAnalysis.result, null);
  assert.equal(state.ai.gapAnalysis.result, null);
}

{
  let state = readyState();
  state = workflowReducer(state, {
    type: "SET_AI_GAP_RESULT",
    payload: { summary: "AI summary", candidates: [{ id: "ai-1" }] },
  });
  state = workflowReducer(state, {
    type: "SELECT_AI_GAP_OPTION",
    payload: { id: "ai-1", draft: "AI selected draft" },
  });
  assert.equal(state.gapChoiceId, "ai:ai-1");
  assert.equal(state.gapNote, "AI selected draft");
  assert.equal(state.aiGapAnalysis.result.summary, "AI summary");
  assert.equal(state.ai.gapAnalysis.result.summary, "AI summary");
}

{
  let state = readyState();
  state = workflowReducer(state, {
    type: "SET_AI_GAP_RESULT",
    payload: { summary: "AI summary", candidates: [{ id: "ai-1" }] },
  });
  state = workflowReducer(state, { type: "TOGGLE_LITERATURE_SELECTION", payload: "w2" });
  assert.equal(state.aiGapAnalysis.result, null);
  assert.equal(state.ai.gapAnalysis.result, null);
  assert.equal(state.proposal, null);
}

{
  let state = readyState();
  state = workflowReducer(state, {
    type: "SET_AI_TASK_RESULT",
    task: "topicNarrowing",
    payload: { summary: "topic summary", versions: [] },
  });
  state = workflowReducer(state, { type: "SELECT_TOPIC", payload: 1 });
  assert.equal(state.ai.topicNarrowing.result, null);
}

console.log("ai workflow tests passed");
