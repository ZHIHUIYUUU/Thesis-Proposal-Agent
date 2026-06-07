import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AiConfigModal from "../components/AiConfigModal.js";
import { buildAcademicContext, usableTopicVersions, validationFeedbackFromResult } from "../services/llm/academicPresentation.js";
import { loadAiConfig } from "../services/llm/configStore.js";
import { runAcademicAgent } from "../services/llm/academicAgent.js";
import { useWorkflow } from "../state/WorkflowContext.jsx";

export default function TopicPage() {
  const { rank } = useParams();
  const { state, dispatch } = useWorkflow();
  const deepDive = state.deepDive;
  const topic = deepDive.topic;
  const aiState = state.ai?.topicNarrowing || { loading: false, error: "", result: null };
  const aiResult = aiState.result;
  const topicVersions = usableTopicVersions(aiResult || {});
  const [aiConfig, setAiConfig] = useState(() => loadAiConfig());
  const [aiConfigOpen, setAiConfigOpen] = useState(false);

  useEffect(() => {
    if (Number(rank) !== state.selectedTopicRank) {
      dispatch({ type: "SELECT_TOPIC", payload: Number(rank) });
    }
  }, [dispatch, rank, state.selectedTopicRank]);

  async function handleAiNarrowing() {
    const config = loadAiConfig();
    setAiConfig(config);
    if (!config) {
      setAiConfigOpen(true);
      return;
    }
    dispatch({ type: "SET_AI_TASK_LOADING", task: "topicNarrowing", payload: true });
    try {
      const result = await runAcademicAgent({
        task: "topicNarrowing",
        config,
        context: buildAcademicContext(state),
      });
      dispatch({
        type: "SET_AI_TASK_RESULT",
        task: "topicNarrowing",
        payload: result,
        validationFeedback: validationFeedbackFromResult(result),
      });
    } catch (error) {
      dispatch({ type: "SET_AI_TASK_ERROR", task: "topicNarrowing", payload: error.message || "AI 追问失败" });
    }
  }

  return (
    <section className="page-grid">
      <div className="page-card">
        <span className="eyebrow">Step 5</span>
        <h2>方向深挖</h2>
        <p className="page-lead">
          现在只讨论一个候选方向。目标是把“可以做”继续收窄成“值得做、能完成、能答辩”。
        </p>
        <div className="action-row">
          <Link className="secondary-link" to="/screening">
            返回候选筛选
          </Link>
          <button className="secondary-button" type="button" onClick={handleAiNarrowing} disabled={aiState.loading}>
            {aiState.loading ? "AI 追问中..." : aiConfig ? `AI 追问收窄 · ${aiConfig.label || aiConfig.provider}` : "配置 API 后 AI 追问"}
          </button>
          <Link className="primary-link" to={`/literature/${topic.rank}`}>
            去检索文献
          </Link>
        </div>
        {aiState.error && <p className="error-text">{aiState.error}</p>}
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

      {aiResult && (
        <article className="page-card ai-result-panel">
          <div className="gap-title-row">
            <div>
              <span className="eyebrow">Intelligent Mode</span>
              <h3>AI 收窄建议</h3>
            </div>
            <span className="maturity-badge">
              {aiResult.provider || "AI"} · {aiResult.model || "model"}
            </span>
          </div>
          <p className="table-hint">{aiResult.summary}</p>
          {aiResult.valid === false && <ValidationList items={aiResult.validationErrors} />}
          {topicVersions.length > 0 ? (
          <div className="ai-card-grid">
            {topicVersions.map((version) => (
              <article key={version.id || version.title} className="ai-insight-card">
                <span className="gap-tag">{levelLabel(version.level)}</span>
                <h3>{version.title}</h3>
                <dl>
                  <dt>研究对象</dt>
                  <dd>{version.researchObject}</dd>
                  <dt>边界</dt>
                  <dd>{version.boundary}</dd>
                  <dt>研究问题</dt>
                  <dd>{version.researchQuestion}</dd>
                  <dt>方法路线</dt>
                  <dd>{version.methodRoute}</dd>
                  <dt>数据路线</dt>
                  <dd>{version.dataRoute}</dd>
                  <dt>可行性风险</dt>
                  <dd>{version.feasibilityRisk}</dd>
                  <dt>答辩焦点</dt>
                  <dd>{version.defenseFocus}</dd>
                  <dt>补文献词</dt>
                  <dd>{(version.nextSearchKeywords || []).join("；")}</dd>
                </dl>
              </article>
            ))}
          </div>
          ) : (
            <p className="empty-text">这次 AI 只返回了空壳版本，没有形成可展示的收窄方案。系统会在下一次请求时自动带着缺失项要求模型补全。</p>
          )}
        </article>
      )}
      <AiConfigModal open={aiConfigOpen} onClose={() => setAiConfigOpen(false)} onSaved={setAiConfig} />
    </section>
  );
}

function ValidationList({ items = [] }) {
  if (!items.length) return null;
  return (
    <div className="validation-panel">
      <strong>AI 输出需要补足</strong>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function levelLabel(level) {
  return { safe: "保守版", standard: "标准版", advanced: "强化版" }[level] || level || "建议";
}
