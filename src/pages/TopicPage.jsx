import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useWorkflow } from "../state/WorkflowContext.jsx";

export default function TopicPage() {
  const { rank } = useParams();
  const { state, dispatch } = useWorkflow();
  const deepDive = state.deepDive;
  const topic = deepDive.topic;

  useEffect(() => {
    if (Number(rank) !== state.selectedTopicRank) {
      dispatch({ type: "SELECT_TOPIC", payload: Number(rank) });
    }
  }, [dispatch, rank, state.selectedTopicRank]);

  return (
    <section className="page-grid">
      <div className="page-card">
        <span className="eyebrow">Step 5</span>
        <h2>方向深挖</h2>
        <p className="page-lead">现在只讨论一个候选方向。目标是把“可以做”继续收窄成“值得做、能完成、能答辩”。</p>
        <div className="action-row">
          <Link className="secondary-link" to="/screening">
            返回候选筛选
          </Link>
          <Link className="primary-link" to={`/literature/${topic.rank}`}>
            去检索文献
          </Link>
        </div>
      </div>

      <article className="page-card topic-focus">
        <h3>{topic.title}</h3>
        <p>{topic.englishTitle}</p>
        <dl>
          <dt>核心研究问题</dt>
          <dd>{topic.question}</dd>
          <dt>方法路线</dt>
          <dd>{topic.methodRoute}</dd>
          <dt>数据路线</dt>
          <dd>{topic.dataRoute}</dd>
        </dl>
      </article>

      <article className="page-card">
        <h3>继续追问</h3>
        <ul className="question-list">
          {deepDive.discussionQuestions.map((question) => (
            <li key={question}>{question}</li>
          ))}
        </ul>
      </article>

      <div className="option-grid">
        {deepDive.narrowingOptions.map((option) => (
          <article key={option.level} className="option-card">
            <span>{option.level}</span>
            <strong>{option.title}</strong>
            <p>{option.detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
