import { useState } from "react";
import { Link } from "react-router-dom";
import AiConfigModal from "../components/AiConfigModal.js";
import { buildAcademicContext, proposalDraftSections, validationFeedbackFromResult } from "../services/llm/academicPresentation.js";
import { loadAiConfig } from "../services/llm/configStore.js";
import { runAcademicAgent } from "../services/llm/academicAgent.js";
import { useWorkflow } from "../state/WorkflowContext.jsx";

export default function ProposalPage() {
  const { state, dispatch } = useWorkflow();
  const proposal = state.proposal;
  const aiState = state.ai?.proposalDraft || { loading: false, error: "", result: null };
  const aiResult = aiState.result;
  const [aiConfig, setAiConfig] = useState(() => loadAiConfig());
  const [aiConfigOpen, setAiConfigOpen] = useState(false);

  async function handleAiDraft() {
    const config = loadAiConfig();
    setAiConfig(config);
    if (!config) {
      setAiConfigOpen(true);
      return;
    }
    if (!proposal) {
      dispatch({ type: "BUILD_PROPOSAL" });
      dispatch({ type: "SET_AI_TASK_ERROR", task: "proposalDraft", payload: "请先生成基础开题包，再让 AI 扩写。" });
      return;
    }
    dispatch({ type: "SET_AI_TASK_LOADING", task: "proposalDraft", payload: true });
    try {
      const result = await runAcademicAgent({
        task: "proposalDraft",
        config,
        context: buildAcademicContext(state, {
          proposal,
          gapNote: state.gapNote,
        }),
      });
      dispatch({
        type: "SET_AI_TASK_RESULT",
        task: "proposalDraft",
        payload: result,
        validationFeedback: validationFeedbackFromResult(result),
      });
    } catch (error) {
      dispatch({ type: "SET_AI_TASK_ERROR", task: "proposalDraft", payload: error.message || "AI 开题扩写失败" });
    }
  }

  return (
    <section className="page-grid">
      <div className="page-card">
        <span className="eyebrow">Step 8</span>
        <h2>开题包</h2>
        <p className="page-lead">
          把已选方向、文献缺口、方法路线和数据路线组织成开题材料。基础包偏结构化，AI 扩写稿会把这些材料展开成更接近开题报告正文的初稿。
        </p>
        <div className="action-row">
          <Link className="secondary-link" to={`/gap/${state.selectedTopicRank}`}>
            返回缺口矩阵
          </Link>
          <button className="primary-button" type="button" onClick={() => dispatch({ type: "BUILD_PROPOSAL" })}>
            生成基础开题包
          </button>
          <button className="secondary-button" type="button" onClick={handleAiDraft} disabled={aiState.loading}>
            {aiState.loading ? "AI 扩写中..." : aiConfig ? `AI 扩写初稿 · ${aiConfig.label || aiConfig.provider}` : "配置 API 后扩写初稿"}
          </button>
          <Link className={`primary-link ${proposal ? "" : "disabled"}`} to={proposal ? "/export" : `/proposal/${state.selectedTopicRank}`}>
            去下载中心
          </Link>
        </div>
        {aiState.error && <p className="error-text">{aiState.error}</p>}
      </div>

      {proposal ? (
        <div className="proposal-layout">
          <Section title="中文题目" content={proposal.chineseTitle} />
          <Section title="English title" content={proposal.englishTitle} />
          <Section title="核心研究问题" content={proposal.coreResearchProblem} />
          <Section title="方法路线" content={proposal.methodDataRoute.method} />
          <Section title="数据路线" content={proposal.methodDataRoute.data} />
          <article className="page-card wide">
            <h3>文献缺口</h3>
            <ul>
              <li>{state.gapNote}</li>
              {proposal.literatureGap.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
          <article className="page-card wide">
            <h3>答辩问题</h3>
            <ul>
              {proposal.defenseQuestions.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </div>
      ) : (
        <article className="page-card empty-state">
          <h3>尚未生成</h3>
          <p>点击上方按钮生成基础开题包。生成结果会包含题目、研究问题、方法与数据路线、文献缺口和答辩问题。</p>
        </article>
      )}

      {aiResult && (
        <article className="page-card ai-result-panel">
          <div className="gap-title-row">
            <div>
              <span className="eyebrow">Intelligent Mode</span>
              <h3>AI 开题报告初稿</h3>
            </div>
            <span className="maturity-badge">
              {aiResult.provider || "AI"} · {aiResult.model || "model"}
            </span>
          </div>
          <p className="table-hint">{aiResult.summary}</p>
          {aiResult.valid === false && <ValidationList items={aiResult.validationErrors} />}
          <div className="ai-proposal-sections">
            {proposalDraftSections(aiResult).map((section) => (
              <article key={section.key} className="ai-proposal-section">
                <h4>{section.title}</h4>
                {section.items ? (
                  <ul>
                    {section.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p>{section.content}</p>
                )}
              </article>
            ))}
          </div>
        </article>
      )}
      <AiConfigModal open={aiConfigOpen} onClose={() => setAiConfigOpen(false)} onSaved={setAiConfig} />
    </section>
  );
}

function Section({ title, content }) {
  return (
    <article className="page-card proposal-section">
      <h3>{title}</h3>
      <p>{content}</p>
    </article>
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
