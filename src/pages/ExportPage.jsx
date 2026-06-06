import { Link } from "react-router-dom";
import { downloadLiteratureCsv, downloadLiteratureMarkdown, downloadReport, selectedWorks } from "../services/exportFiles.js";
import { useWorkflow } from "../state/WorkflowContext.jsx";

export default function ExportPage() {
  const { state } = useWorkflow();
  const works = selectedWorks(state);

  return (
    <section className="page-grid">
      <div className="page-card">
        <span className="eyebrow">Step 9</span>
        <h2>下载中心</h2>
        <p className="page-lead">这里集中导出开题材料和文献表。所有内容来自前面步骤的选择，不再重新生成。</p>
        <div className="action-row">
          <Link className="secondary-link" to={`/proposal/${state.selectedTopicRank}`}>
            返回开题包
          </Link>
        </div>
      </div>

      <div className="export-grid">
        <ExportCard title="开题报告 Markdown" detail="包含路由、已选方向、文献列表、缺口和开题包。" action={() => downloadReport(state)} />
        <ExportCard title="文献 Markdown" detail={`导出 ${works.length} 条已选文献的 Markdown 表格。`} action={() => downloadLiteratureMarkdown(state)} />
        <ExportCard title="文献 CSV" detail={`导出 ${works.length} 条已选文献，可直接放入 Excel。`} action={() => downloadLiteratureCsv(state)} />
      </div>
    </section>
  );
}

function ExportCard({ title, detail, action }) {
  return (
    <article className="page-card export-card">
      <h3>{title}</h3>
      <p>{detail}</p>
      <button className="primary-button" type="button" onClick={action}>
        下载
      </button>
    </article>
  );
}
