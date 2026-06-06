import { Link } from "react-router-dom";
import { buildGapMatrix, buildGapOptions, buildLiteratureInsights, labelLiteratureSource } from "../engine.js";
import { selectedWorks } from "../services/exportFiles.js";
import { useWorkflow } from "../state/WorkflowContext.jsx";

export default function GapPage() {
  const { state, dispatch } = useWorkflow();
  const works = selectedWorks(state);
  const insights = buildLiteratureInsights(state.report, state.deepDive, works);
  const matrix = buildGapMatrix(state.report, state.deepDive, works);
  const gapOptions = buildGapOptions(state.report, state.deepDive, works);
  const selectedGap = gapOptions.find((option) => option.id === state.gapChoiceId);

  return (
    <section className="page-grid">
      <div className="page-card">
        <span className="eyebrow">Step 7</span>
        <h2>文献缺口矩阵</h2>
        <p className="page-lead">
          缺口矩阵不是让你抄论文 PDF，也不是让你凭空填写。这里会先读取你勾选文献的题名、摘要、主题词、来源和年份，形成逐篇理解，再综合成可以进入开题报告的研究改进方向。
        </p>
        <div className="action-row">
          <Link className="secondary-link" to={`/literature/${state.selectedTopicRank}`}>
            返回文献
          </Link>
          <Link className={`primary-link ${state.gapNote.trim() ? "" : "disabled"}`} to={state.gapNote.trim() ? `/proposal/${state.selectedTopicRank}` : `/gap/${state.selectedTopicRank}`}>
            进入开题包
          </Link>
        </div>
      </div>

      <article className="page-card">
        <h3>已选文献深读</h3>
        <p className="table-hint">{insights.synthesis}</p>
        <div className="reading-list">
          {insights.readings.map((reading) => {
            const work = works.find((item) => (item.id || item.title) === reading.id) || {};
            const sourceFit = labelLiteratureSource(work, state.report.pool);
            return (
              <article key={reading.id || reading.title} className="reading-card">
                <span className={`source-label ${sourceFit.tone}`}>{sourceFit.label}</span>
                <h4>{reading.title}</h4>
                <small>{reading.sourceLine}</small>
                <p>{reading.closeReading}</p>
                <p>{reading.contribution}</p>
                <p>{reading.limitationSignal}</p>
              </article>
            );
          })}
        </div>
      </article>

      <article className="page-card">
        <h3>文献 × 维度矩阵</h3>
        <p className="table-hint">{matrix.summary}</p>
        {matrix.scenarioLens && (
          <div className="scenario-lens">
            <strong>当前模板：{matrix.scenarioLens.template}</strong>
            <span>关键变量：{matrix.scenarioLens.variables.join("、")}</span>
          </div>
        )}
        <div className="table-wrap">
          <table className="gap-table">
            <thead>
              <tr>
                <th>文献</th>
                {matrix.dimensions.map((dimension) => (
                  <th key={dimension.key}>{dimension.label}</th>
                ))}
                <th>威胁</th>
              </tr>
            </thead>
            <tbody>
              {matrix.rows.map((row) => (
                <tr key={row.id}>
                  <td>
                    <strong>{row.title}</strong>
                    <span>{row.source} · {row.year || "年份缺失"} · 权重 {row.weight}</span>
                  </td>
                  {row.cells.map((cell) => (
                    <td key={cell.key}>
                      <span className={`matrix-status ${cell.status}`}>{statusLabel(cell.status)}</span>
                      <strong>{cell.value}</strong>
                      <span>{cell.evidence}</span>
                      <span>{cell.basis} · 置信度 {cell.confidence}</span>
                    </td>
                  ))}
                  <td>
                    <strong>{row.threatLevel}</strong>
                    <span>{Math.round(row.threatScore)} / 100</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>

      <div className="gap-matrix">
        {gapOptions.map((option) => {
          const selected = state.gapChoiceId === option.id;
          return (
            <article key={option.id} className={`gap-card ${selected ? "selected" : ""}`}>
              <div className="gap-title-row">
                <span className="gap-tag">{option.gapType}</span>
                <span className="maturity-badge">{option.maturity.level} · {option.maturity.label}</span>
              </div>
              <h3>{option.gapName}</h3>
              <div className="score-grid">
                <span>推荐 {option.scores.total}/100</span>
                <span>新颖 {option.scores.novelty}</span>
                <span>可行 {option.scores.feasibility}</span>
                <span>文献 {option.scores.literatureSupport}</span>
                <span>数据 {option.scores.dataAvailability}</span>
                <span>风险 {option.scores.risk}</span>
              </div>
              <div className="scenario-lens compact">
                <strong>{option.scenarioLens.template}</strong>
                <span>变量：{option.scenarioLens.keyVariables.join("、")}</span>
              </div>
              <dl>
                <dt>读到什么</dt>
                <dd>{option.articleUnderstanding}</dd>
                <dt>缺口判断</dt>
                <dd>{option.gapLogic}</dd>
                <dt>证据链</dt>
                <dd>
                  <ol className="compact-list">
                    {option.evidenceChain.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ol>
                </dd>
                <dt>开题落点</dt>
                <dd>{option.openingDirection}</dd>
                <dt>怎么推进</dt>
                <dd>{option.improvementPlan}</dd>
                <dt>题目层级</dt>
                <dd>
                  <ul className="compact-list">
                    <li>宽题目：{option.topicTitles.broad}</li>
                    <li>开题题目：{option.topicTitles.standard}</li>
                    <li>论文题目：{option.topicTitles.narrow}</li>
                  </ul>
                </dd>
                <dt>研究问题</dt>
                <dd>
                  <ul className="compact-list">
                    {option.researchQuestions.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </dd>
                <dt>贡献点</dt>
                <dd>
                  <ul className="compact-list">
                    {option.contributions.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </dd>
                <dt>不能声称</dt>
                <dd>
                  <ul className="compact-list">
                    {option.overclaimRisks.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </dd>
                <dt>下一步补文献</dt>
                <dd>{option.nextSearchKeywords.join("；")}</dd>
              </dl>
              <button
                className={selected ? "secondary-button" : "primary-button"}
                type="button"
                onClick={() => dispatch({ type: "SELECT_GAP_OPTION", payload: option })}
              >
                {selected ? "已选择" : "选择这个方向"}
              </button>
            </article>
          );
        })}
      </div>

      <label className="page-card gap-editor">
        <span>已选缺口方向草案</span>
        {selectedGap && (
          <div className="draft-grid">
            {Object.entries({
              缺口名称: selectedGap.structuredDraft.gapName,
              一句话缺口: selectedGap.structuredDraft.oneSentenceGap,
              支撑文献: selectedGap.structuredDraft.supportPapers.join("；"),
              已有研究已做到: selectedGap.structuredDraft.existingCoverage,
              尚未解决: selectedGap.structuredDraft.unresolvedPoint,
              本文拟解决: selectedGap.structuredDraft.proposedWork,
              预期方法: selectedGap.structuredDraft.expectedMethod,
              预期数据: selectedGap.structuredDraft.expectedData,
              场景变量: selectedGap.structuredDraft.scenarioVariables,
              核查维度: selectedGap.structuredDraft.concreteDimensions,
              风险: selectedGap.structuredDraft.risks,
              下一步任务: selectedGap.structuredDraft.nextTask,
            }).map(([label, value]) => (
              <div key={label}>
                <strong>{label}</strong>
                <p>{value}</p>
              </div>
            ))}
          </div>
        )}
        <textarea
          rows="5"
          value={state.gapNote}
          onChange={(event) => dispatch({ type: "UPDATE_GAP_NOTE", payload: event.target.value })}
          placeholder="先选择上方一个可改进方向，系统会自动填入草案。你可以在这里微调措辞，再进入开题包。"
        />
      </label>
    </section>
  );
}

function statusLabel(status) {
  return {
    covered: "已覆盖",
    partial: "部分",
    missing: "空白",
  }[status] || "待核验";
}
