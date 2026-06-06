import { NavLink, useLocation } from "react-router-dom";
import { routeSteps } from "../workflow.js";
import { useWorkflow } from "../state/WorkflowContext.jsx";
import StepNav from "./StepNav.jsx";

const routeTargets = {
  "/intake": "/intake",
  "/routing": "/routing",
  "/direction-map": "/direction-map",
  "/screening": "/screening",
  "/topic/:rank": "/topic/1",
  "/literature/:rank": "/literature/1",
  "/gap/:rank": "/gap/1",
  "/proposal/:rank": "/proposal/1",
  "/export": "/export",
};

export default function AppShell({ children }) {
  const { state } = useWorkflow();
  const location = useLocation();

  return (
    <main className="app-frame">
      <aside className="side-nav">
        <div className="brand-block">
          <h1>研究选题工作台</h1>
          <p>从模糊兴趣到可答辩开题方案</p>
        </div>
        <StepNav currentPath={location.pathname} steps={routeSteps} state={state} />
        <nav className="route-list" aria-label="工作台页面">
          {routeSteps.map((step) => (
            <NavLink key={step.route} to={targetFor(step.route, state)} className="route-link">
              {step.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <section className="view-shell">{children}</section>
    </main>
  );
}

function targetFor(route, state) {
  const rank = state.selectedTopicRank || 1;
  return (routeTargets[route] || "/intake").replace("1", String(rank));
}
