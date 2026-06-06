import { Link } from "react-router-dom";
import { useWorkflow } from "../state/WorkflowContext.jsx";

export default function RoutingPage() {
  const { state } = useWorkflow();
  const { report } = state;

  return (
    <section className="page-grid">
      <div className="page-card">
        <span className="eyebrow">Step 2</span>
        <h2>学科与证据路由</h2>
        <p className="page-lead">{report.routing.rationale}</p>
        <div className="action-row">
          <Link className="secondary-link" to="/intake">
            返回修改信息
          </Link>
          <Link className="primary-link" to="/direction-map">
            确认路由，进入方向地图
          </Link>
        </div>
      </div>

      <div className="route-card-grid">
        <InfoCard title="培养层次" value={report.degree.level} detail={report.degree.profile.goal} />
        <InfoCard title="大学科集合" value={report.routing.collectionName} detail={report.routing.subfieldName} />
        <InfoCard title="方法传统" value={report.routing.methodName} detail={report.routing.methodBoundary} />
        <InfoCard title="数据条件" value={report.routing.dataConditionName} detail="后续候选方向会按数据可得性重新评分。" />
      </div>

      <PoolPanel title="核心证据池" items={report.pool.core} tone="core" />
      <PoolPanel title="相邻证据池" items={report.pool.adjacent} tone="adjacent" />
      <PoolPanel title="排除证据池" items={report.pool.excluded} tone="excluded" />
    </section>
  );
}

function InfoCard({ title, value, detail }) {
  return (
    <article className="info-card">
      <span>{title}</span>
      <strong>{value}</strong>
      <p>{detail}</p>
    </article>
  );
}

function PoolPanel({ title, items, tone }) {
  return (
    <article className={`page-card pool-panel ${tone}`}>
      <h3>{title}</h3>
      <div className="tag-cloud">
        {items.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
    </article>
  );
}
