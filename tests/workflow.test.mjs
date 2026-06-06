import assert from "node:assert/strict";
import {
  canEnterRoute,
  createInitialWorkflowState,
  getNextRoute,
  serializeWorkflowState,
  workflowReducer,
} from "../src/workflow.js";

const completeIntake = {
  degreeLevel: "master",
  collection: "engineering",
  subfield: "mechanical-engineering",
  method: "experiment-simulation",
  dataCondition: "public-simulation",
  advisorPreference: "偏工程应用、可完成性和规范开题。",
  studentProfile: "会基础 Python，能读英文文献，希望题目不要太虚。",
  multiLevel: false,
};

{
  const state = createInitialWorkflowState();
  assert.equal(state.currentRoute, "/intake");
  assert.equal(canEnterRoute(state, "/intake").allowed, true);
  assert.equal(canEnterRoute(state, "/routing").allowed, false);
  assert.match(canEnterRoute(state, "/routing").reason, /完成基本信息/);
}

{
  let state = createInitialWorkflowState();
  state = workflowReducer(state, { type: "UPDATE_INTAKE", payload: completeIntake });
  assert.equal(canEnterRoute(state, "/routing").allowed, true);
  assert.equal(getNextRoute(state, "/intake"), "/routing");
  assert.ok(state.report);
  assert.ok(state.report.topics.length >= 3);
}

{
  let state = createInitialWorkflowState();
  state = workflowReducer(state, { type: "UPDATE_INTAKE", payload: completeIntake });
  assert.equal(canEnterRoute(state, "/direction-map").allowed, true);
  assert.equal(canEnterRoute(state, "/screening").allowed, false);

  state = workflowReducer(state, { type: "TOGGLE_DIRECTION", payload: "scenario:智能制造" });
  assert.equal(canEnterRoute(state, "/screening").allowed, true);
  assert.equal(getNextRoute(state, "/direction-map"), "/screening");
  assert.deepEqual([...new Set(state.report.topics.map((topic) => topic.scenario))], ["智能制造"]);
  assert.ok(new Set(state.report.topics.map((topic) => topic.question)).size >= 3);
}

{
  let state = createInitialWorkflowState();
  state = workflowReducer(state, { type: "UPDATE_INTAKE", payload: completeIntake });
  state = workflowReducer(state, { type: "TOGGLE_DIRECTION", payload: "scenario:智能制造" });
  assert.equal(canEnterRoute(state, "/topic/1").allowed, false);

  state = workflowReducer(state, { type: "SELECT_TOPIC", payload: 1 });
  assert.equal(canEnterRoute(state, "/topic/1").allowed, true);
  assert.equal(canEnterRoute(state, "/literature/1").allowed, true);
  assert.ok(state.deepDive);
}

{
  let state = createInitialWorkflowState();
  state = workflowReducer(state, { type: "UPDATE_INTAKE", payload: completeIntake });
  state = workflowReducer(state, { type: "TOGGLE_DIRECTION", payload: "scenario:智能制造" });
  state = workflowReducer(state, { type: "SELECT_TOPIC", payload: 1 });
  assert.equal(canEnterRoute(state, "/gap/1").allowed, false);

  state = workflowReducer(state, {
    type: "SET_LITERATURE",
    payload: {
      works: [
        { id: "w1", title: "A", source: "Journal of Manufacturing Systems" },
        { id: "w2", title: "B", source: "Journal of Mechanical Design" },
      ],
      meta: { count: 2 },
      query: "smart manufacturing scheduling",
      url: "https://api.openalex.org/works?search=smart+manufacturing+scheduling",
    },
  });
  assert.equal(state.literature.searched, true);
  assert.equal(state.literature.resultCount, 2);
  state = workflowReducer(state, { type: "TOGGLE_LITERATURE_SELECTION", payload: "w1" });
  assert.equal(canEnterRoute(state, "/gap/1").allowed, false);
  state = workflowReducer(state, { type: "TOGGLE_LITERATURE_SELECTION", payload: "w2" });
  assert.equal(canEnterRoute(state, "/gap/1").allowed, true);
  state = workflowReducer(state, {
    type: "SELECT_GAP_OPTION",
    payload: {
      id: "data-validation-route",
      draft: "现有研究覆盖智能制造方向，但缺少面向公开仿真数据的验证路线。",
    },
  });
  assert.equal(state.gapChoiceId, "data-validation-route");
  assert.match(state.gapNote, /公开仿真数据/);
  assert.equal(canEnterRoute(state, "/proposal/1").allowed, true);
}

{
  let state = createInitialWorkflowState();
  state = workflowReducer(state, { type: "UPDATE_INTAKE", payload: completeIntake });
  state = workflowReducer(state, { type: "TOGGLE_DIRECTION", payload: "scenario:智能制造" });
  state = workflowReducer(state, { type: "SELECT_TOPIC", payload: 1 });
  state = workflowReducer(state, {
    type: "SET_LITERATURE",
    payload: [
      { id: "w1", title: "A", source: "Journal of Manufacturing Systems" },
      { id: "w2", title: "B", source: "Journal of Mechanical Design" },
    ],
  });
  state = workflowReducer(state, { type: "TOGGLE_LITERATURE_SELECTION", payload: "w1" });
  state = workflowReducer(state, { type: "TOGGLE_LITERATURE_SELECTION", payload: "w2" });
  state = workflowReducer(state, { type: "UPDATE_GAP_NOTE", payload: "近年文献多关注通用制造系统，缺少与学生数据条件匹配的可验证方案。" });
  assert.equal(canEnterRoute(state, "/proposal/1").allowed, true);
  assert.equal(canEnterRoute(state, "/export").allowed, false);

  state = workflowReducer(state, { type: "BUILD_PROPOSAL" });
  assert.equal(canEnterRoute(state, "/export").allowed, true);
  assert.ok(state.proposal);
  assert.match(state.proposal.userGapNote, /近年文献/);
}

{
  let state = createInitialWorkflowState();
  state = workflowReducer(state, { type: "UPDATE_INTAKE", payload: completeIntake });
  state = workflowReducer(state, { type: "TOGGLE_DIRECTION", payload: "scenario:智能制造" });
  state = workflowReducer(state, { type: "SELECT_TOPIC", payload: 1 });
  state = workflowReducer(state, {
    type: "SET_LITERATURE",
    payload: [{ id: "w1", title: "A", source: "Journal of Manufacturing Systems" }],
  });
  state = workflowReducer(state, {
    type: "UPDATE_INTAKE",
    payload: { ...completeIntake, method: "optimization" },
  });
  assert.equal(state.selectedTopicRank, null);
  assert.equal(state.deepDive, null);
  assert.equal(state.literature.works.length, 0);
  assert.equal(state.gapNote, "");
  assert.equal(state.proposal, null);
}

{
  const state = workflowReducer(createInitialWorkflowState(), { type: "UPDATE_INTAKE", payload: completeIntake });
  const serialized = serializeWorkflowState(state);
  assert.match(serialized, /mechanical-engineering/);
  assert.doesNotThrow(() => JSON.parse(serialized));
}

console.log("workflow tests passed");
