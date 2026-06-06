import { canEnterRoute, normalizeRoute } from "../workflow.js";

export default function StepNav({ currentPath, steps, state }) {
  const normalizedCurrent = normalizeRoute(currentPath);
  return (
    <ol className="step-nav">
      {steps.map((step, index) => {
        const target = step.route.replace(":rank", String(state.selectedTopicRank || 1));
        const routeKey = normalizeRoute(target);
        const guard = canEnterRoute(state, target);
        const active = routeKey === normalizedCurrent;
        return (
          <li key={step.route} className={active ? "active" : guard.allowed ? "open" : "locked"}>
            <span>{index + 1}</span>
            <strong>{step.label}</strong>
          </li>
        );
      })}
    </ol>
  );
}
