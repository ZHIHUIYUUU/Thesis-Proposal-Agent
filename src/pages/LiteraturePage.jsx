import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import AiConfigModal from "../components/AiConfigModal.js";
import { buildOpenAlexUrl, labelLiteratureSource } from "../engine.js";
import { searchOpenAlex } from "../services/literatureApi.js";
import { filterLiteratureWorks, sortLiteratureWorks } from "../services/literatureSort.js";
import { buildAcademicContext, usableSearchQueries, validationFeedbackFromResult } from "../services/llm/academicPresentation.js";
import { loadAiConfig } from "../services/llm/configStore.js";
import { runAcademicAgent } from "../services/llm/academicAgent.js";
import { useWorkflow } from "../state/WorkflowContext.jsx";

export default function LiteraturePage() {
  const { state, dispatch } = useWorkflow();
  const { report, deepDive, literature } = state;
  const selected = new Set(literature.selectedIds);
  const [sortConfig, setSortConfig] = useState({ key: "relevance", direction: "desc" });
  const [yearFilter, setYearFilter] = useState({ fromYear: "2000", toYear: String(new Date().getFullYear()) });
  const [aiConfig, setAiConfig] = useState(() => loadAiConfig());
  const [aiConfigOpen, setAiConfigOpen] = useState(false);
  const aiState = state.ai?.searchStrategy || { loading: false, error: "", result: null };
  const aiResult = aiState.result;
  const searchQueries = usableSearchQueries(aiResult || {});
  const visibleWorks = useMemo(() => filterLiteratureWorks(literature.works, yearFilter), [literature.works, yearFilter]);
  const sortedWorks = useMemo(
    () => sortLiteratureWorks(visibleWorks, sortConfig, report.pool),
    [visibleWorks, sortConfig, report.pool],
  );

  async function runSearch(searchPlan = {}) {
    const query = searchPlan.query || deepDive.searchPlan.openAlexQuery;
    const url =
      searchPlan.url ||
      deepDive.searchPlan.openAlexUrl ||
      buildOpenAlexUrl(query, { fromYear: Number(yearFilter.fromYear) || 2000, toYear: Number(yearFilter.toYear) || new Date().getFullYear() });
    dispatch({ type: "SET_LITERATURE_LOADING", payload: true });
    try {
      const result = await searchOpenAlex(url);
      dispatch({
        type: "SET_LITERATURE",
        payload: {
          ...result,
          query,
        },
      });
    } catch (error) {
      dispatch({ type: "SET_LITERATURE_ERROR", payload: error.message });
    }
  }

  async function handleAiSearchStrategy() {
    const config = loadAiConfig();
    setAiConfig(config);
    if (!config) {
      setAiConfigOpen(true);
      return;
    }
    dispatch({ type: "SET_AI_TASK_LOADING", task: "searchStrategy", payload: true });
    try {
      const result = await runAcademicAgent({
        task: "searchStrategy",
        config,
        context: buildAcademicContext(state),
      });
      dispatch({
        type: "SET_AI_TASK_RESULT",
        task: "searchStrategy",
        payload: result,
        validationFeedback: validationFeedbackFromResult(result),
      });
    } catch (error) {
      dispatch({ type: "SET_AI_TASK_ERROR", task: "searchStrategy", payload: error.message || "AI 检索策略生成失败" });
    }
  }

  function runAiQuery(query) {
    const url = buildOpenAlexUrl(query, {
      fromYear: Number(yearFilter.fromYear) || 2000,
      toYear: Number(yearFilter.toYear) || new Date().getFullYear(),
    });
    runSearch({ query, url });
  }

  function changeSort(key) {
    setSortConfig((current) => ({
      key,
      direction: current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
  }

  return (
    <section className="page-grid">
      <div className="page-card">
        <span className="eyebrow">Step 6</span>
        <h2>联网文献检索</h2>
        <p className="page-lead">
          这里检索的是公开文献元数据。它能提供 DOI、来源和开放链接，但最终缺口仍要靠人工阅读核验。
        </p>
        <div className="query-stack">
          <div>
            <span className="field-label">检索意图</span>
            <div className="query-box">{deepDive.searchPlan.query}</div>
          </div>
          <div>
            <span className="field-label">OpenAlex 英文检索式</span>
            <div className="query-box query-box-muted">{deepDive.searchPlan.openAlexQuery}</div>
          </div>
        </div>
        <p className="search-note">
          检索方式：{deepDive.searchPlan.strategy}；过滤：{deepDive.searchPlan.filters.join("、")}。
        </p>
        <div className="matrix-explainer">
          <strong>缺口矩阵怎么用</strong>
          <p>
            先在下方至少勾选 2 篇文献。下一页会把这些文献当作证据，生成几个可改进的研究方向和理由；你选择一个方向后，系统会形成可继续修改的缺口草稿。
          </p>
        </div>
        <div className="action-row">
          <Link className="secondary-link" to={`/topic/${state.selectedTopicRank}`}>
            返回深挖
          </Link>
          <button className="secondary-button" type="button" onClick={handleAiSearchStrategy} disabled={aiState.loading}>
            {aiState.loading ? "AI 生成中..." : aiConfig ? `AI 生成检索式 · ${aiConfig.label || aiConfig.provider}` : "配置 API 后生成检索式"}
          </button>
          <button className="primary-button" type="button" onClick={() => runSearch()} disabled={literature.loading}>
            {literature.loading ? "检索中..." : "检索 OpenAlex"}
          </button>
          <Link className={`primary-link ${selected.size >= 2 ? "" : "disabled"}`} to={selected.size >= 2 ? `/gap/${state.selectedTopicRank}` : `/literature/${state.selectedTopicRank}`}>
            进入缺口矩阵
          </Link>
          {selected.size < 2 && <span className="hint-text">请先勾选至少 2 篇文献。</span>}
        </div>
        {literature.loading && <p className="status-text">正在请求 OpenAlex，请稍候。</p>}
        {literature.searched && !literature.loading && !literature.error && (
          <p className="status-text">
            OpenAlex 返回 {literature.resultCount} 条，当前按年份筛选后展示 {sortedWorks.length} 条。
            {literature.lastUrl && (
              <>
                {" "}
                <a href={literature.lastUrl} target="_blank" rel="noreferrer">
                  打开本次请求
                </a>
              </>
            )}
          </p>
        )}
        {literature.error && <p className="error-text">{literature.error}</p>}
        {aiState.error && <p className="error-text">{aiState.error}</p>}
      </div>

      {aiResult && (
        <article className="page-card ai-result-panel">
          <div className="gap-title-row">
            <div>
              <span className="eyebrow">Intelligent Mode</span>
              <h3>AI 检索策略</h3>
            </div>
            <span className="maturity-badge">
              {aiResult.provider || "AI"} · {aiResult.model || "model"}
            </span>
          </div>
          <p className="table-hint">{aiResult.summary}</p>
          {aiResult.valid === false && <ValidationList items={aiResult.validationErrors} />}
          {searchQueries.length > 0 ? (
          <div className="ai-card-grid">
            {searchQueries.map((item) => (
              <article key={item.id || item.query} className="ai-insight-card">
                <span className="gap-tag">{item.label}</span>
                <div className="query-box query-box-muted">{item.query}</div>
                <dl>
                  <dt>检索目的</dt>
                  <dd>{item.intent}</dd>
                  <dt>必须包含</dt>
                  <dd>{(item.mustHaveTerms || []).join("；")}</dd>
                  <dt>避免误检</dt>
                  <dd>{(item.avoidTerms || []).join("；")}</dd>
                  <dt>预期论文</dt>
                  <dd>{item.expectedPapers}</dd>
                  <dt>误检风险</dt>
                  <dd>{item.falsePositiveRisk}</dd>
                </dl>
                <button className="primary-button" type="button" onClick={() => runAiQuery(item.query)} disabled={literature.loading}>
                  用这一组检索
                </button>
              </article>
            ))}
          </div>
          ) : (
            <p className="empty-text">这次 AI 没有给出可用的英文检索式。系统会在下一次请求时自动要求模型补齐至少 3 组 query。</p>
          )}
        </article>
      )}

      <article className="page-card">
        <h3>候选文献</h3>
        <p className="table-hint">默认从 2000 年开始检索。点击表头可排序；年份表头下方可筛选展示范围。</p>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>选择</th>
                {renderSortHeader("题名", "title", sortConfig, changeSort)}
                {renderSortHeader("来源", "source", sortConfig, changeSort)}
                {renderSortHeader("口径", "fit", sortConfig, changeSort)}
                {renderYearHeader(sortConfig, changeSort, yearFilter, setYearFilter)}
                {renderSortHeader("引用", "citedBy", sortConfig, changeSort)}
                <th>链接</th>
              </tr>
            </thead>
            <tbody>
              {sortedWorks.map((work) => {
                const sourceFit = labelLiteratureSource(work, report.pool);
                return (
                  <tr key={work.id || work.title}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selected.has(work.id)}
                        onChange={() => dispatch({ type: "TOGGLE_LITERATURE_SELECTION", payload: work.id })}
                      />
                    </td>
                    <td>
                      <strong>{work.title}</strong>
                      <span>{work.authors || "作者信息缺失"}</span>
                    </td>
                    <td>{work.source}</td>
                    <td>
                      <span className={`source-label ${sourceFit.tone}`}>{sourceFit.label}</span>
                    </td>
                    <td>{work.year}</td>
                    <td>{work.citedBy}</td>
                    <td>{renderLink(work)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {!literature.works.length && (
            <p className="empty-text">
              {literature.searched
                ? "已完成检索，但当前查询没有返回可展示文献。可以返回深挖页收窄问题，或用 AI 生成更多检索式。"
                : "还没有检索结果。点击上方按钮开始检索。"}
            </p>
          )}
        </div>
      </article>
      <AiConfigModal open={aiConfigOpen} onClose={() => setAiConfigOpen(false)} onSaved={setAiConfig} />
    </section>
  );
}

function renderSortHeader(label, key, sortConfig, changeSort) {
  const active = sortConfig.key === key;
  const indicator = active ? (sortConfig.direction === "asc" ? "↑" : "↓") : "↕";
  return (
    <th>
      <button className={`sort-header ${active ? "active" : ""}`} type="button" onClick={() => changeSort(key)}>
        <span>{label}</span>
        <span>{indicator}</span>
      </button>
    </th>
  );
}

function renderYearHeader(sortConfig, changeSort, yearFilter, setYearFilter) {
  const active = sortConfig.key === "year";
  const indicator = active ? (sortConfig.direction === "asc" ? "↑" : "↓") : "↕";
  return (
    <th>
      <button className={`sort-header ${active ? "active" : ""}`} type="button" onClick={() => changeSort("year")}>
        <span>年份</span>
        <span>{indicator}</span>
      </button>
      <div className="year-filter" onClick={(event) => event.stopPropagation()}>
        <input
          aria-label="起始年份"
          inputMode="numeric"
          value={yearFilter.fromYear}
          onChange={(event) => setYearFilter((current) => ({ ...current, fromYear: event.target.value }))}
        />
        <span>-</span>
        <input
          aria-label="结束年份"
          inputMode="numeric"
          value={yearFilter.toYear}
          onChange={(event) => setYearFilter((current) => ({ ...current, toYear: event.target.value }))}
        />
      </div>
    </th>
  );
}

function renderLink(work) {
  const href = work.openAccessUrl || work.doi || work.url;
  return href ? (
    <a href={href} target="_blank" rel="noreferrer">
      打开
    </a>
  ) : (
    "无"
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
