import { Link } from "react-router-dom";
import { canEnterRoute } from "../workflow.js";
import { useWorkflow } from "../state/WorkflowContext.jsx";

export default function RouteGate({ route, children }) {
  const { state } = useWorkflow();
  const guard = canEnterRoute(state, route);
  if (guard.allowed) {
    return children;
  }

  return (
    <section className="page-card guard-card">
      <span className="eyebrow">流程守卫</span>
      <h2>现在还不能进入这个画面</h2>
      <p>{guard.reason}</p>
      <Link className="primary-link" to="/intake">
        回到需求采集
      </Link>
    </section>
  );
}
