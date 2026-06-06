import { Link, useNavigate } from "react-router-dom";
import { useWorkflow } from "../state/WorkflowContext.jsx";

export default function ScreeningPage() {
  const { state, dispatch } = useWorkflow();
  const navigate = useNavigate();

  function choose(rank) {
    dispatch({ type: "SELECT_TOPIC", payload: rank });
    navigate(`/topic/${rank}`);
  }

  return (
    <section className="page-grid">
      <div className="page-card">
        <span className="eyebrow">Step 4</span>
        <h2>候选方向筛选</h2>
        <p className="page-lead">这里从粗方向收窄到可比较候选。每张卡展示评分、风险、研究问题和检索入口。</p>
        <div className="action-row">
          <Link className="secondary-link" to="/direction-map">
            返回方向地图
          </Link>
        </div>
      </div>

      <div className="candidate-grid">
        {state.report.topics.slice(0, 5).map((topic) => (
          <article key={topic.rank} className="candidate-card">
            <div className="candidate-head">
              <span>{topic.rank}</span>
              <div>
                <h3>{topic.title}</h3>
                <p>{topic.englishTitle}</p>
              </div>
            </div>
            <div className="score-line">
              <strong>{topic.scores.total}</strong>
              <span>{topic.scores.label}</span>
            </div>
            <p>
              <b>研究问题：</b>
              {topic.question}
            </p>
            <p>
              <b>数据路线：</b>
              {topic.dataRoute}
            </p>
            <div className="risk-list">
              {Object.entries(topic.risks).map(([key, value]) => (
                <span key={key}>{value}</span>
              ))}
            </div>
            <button className="primary-button" type="button" onClick={() => choose(topic.rank)}>
              选择并深挖
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
