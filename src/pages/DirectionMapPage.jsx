import { Link } from "react-router-dom";
import { useWorkflow } from "../state/WorkflowContext.jsx";

export default function DirectionMapPage() {
  const { state, dispatch } = useWorkflow();
  const directions = buildDirectionMap(state.report);
  const selected = new Set(state.directionSelections);

  return (
    <section className="page-grid">
      <div className="page-card">
        <span className="eyebrow">Step 3</span>
        <h2>方向地图</h2>
        <p className="page-lead">先看粗方向，不急着定题。每个方向都绑定场景、问题、方法和数据路线，避免只拿热词当选题。</p>
        <div className="action-row">
          <Link className="secondary-link" to="/routing">
            返回路由
          </Link>
          <Link className={`primary-link ${selected.size ? "" : "disabled"}`} to={selected.size ? "/screening" : "/direction-map"}>
            进入候选筛选
          </Link>
        </div>
      </div>

      <div className="direction-grid">
        {directions.map((direction) => (
          <button
            key={direction.key}
            className={`direction-card ${selected.has(direction.key) ? "selected" : ""}`}
            type="button"
            onClick={() => dispatch({ type: "TOGGLE_DIRECTION", payload: direction.key })}
          >
            <span>{direction.group}</span>
            <strong>{direction.title}</strong>
            <p>{direction.detail}</p>
            <small>{direction.method}</small>
          </button>
        ))}
      </div>
    </section>
  );
}

function buildDirectionMap(report) {
  const scenarios = report.pool.scenarios || report.topics.map((topic) => topic.scenario);
  return scenarios.slice(0, 8).map((scenario, index) => ({
    key: `scenario:${scenario}`,
    group: index % 2 === 0 ? "场景驱动" : "方法驱动",
    title: scenario,
    detail: `围绕${scenario}构建${report.routing.methodName}问题，后续按数据、难度和文献池筛选。`,
    method: `${report.routing.methodName} · ${report.routing.dataConditionName}`,
  }));
}
