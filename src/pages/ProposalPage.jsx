import { Link } from "react-router-dom";
import { useWorkflow } from "../state/WorkflowContext.jsx";

export default function ProposalPage() {
  const { state, dispatch } = useWorkflow();
  const proposal = state.proposal;

  return (
    <section className="page-grid">
      <div className="page-card">
        <span className="eyebrow">Step 8</span>
        <h2>开题包</h2>
        <p className="page-lead">把已选方向、文献缺口、方法路线和数据路线组织成开题材料。生成后可以进入下载中心。</p>
        <div className="action-row">
          <Link className="secondary-link" to={`/gap/${state.selectedTopicRank}`}>
            返回缺口矩阵
          </Link>
          <button className="primary-button" type="button" onClick={() => dispatch({ type: "BUILD_PROPOSAL" })}>
            生成开题包
          </button>
          <Link className={`primary-link ${proposal ? "" : "disabled"}`} to={proposal ? "/export" : `/proposal/${state.selectedTopicRank}`}>
            去下载中心
          </Link>
        </div>
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
          <p>点击上方按钮生成开题包。生成结果会包含题目、研究问题、方法与数据路线、文献缺口和答辩问题。</p>
        </article>
      )}
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
