import { buildLiteratureCsv, buildLiteratureMarkdown, toMarkdown } from "../engine.js";

export function downloadTextFile(content, filename, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function downloadReport(state) {
  downloadTextFile(
    toMarkdown(state.report, state.deepDive, selectedWorks(state), state.proposal),
    "研究选题工作台开题包.md",
    "text/markdown;charset=utf-8",
  );
}

export function downloadLiteratureMarkdown(state) {
  downloadTextFile(buildLiteratureMarkdown(selectedWorks(state), state.report.pool), "候选方向文献列表.md", "text/markdown;charset=utf-8");
}

export function downloadLiteratureCsv(state) {
  downloadTextFile(buildLiteratureCsv(selectedWorks(state), state.report.pool), "候选方向文献列表.csv", "text/csv;charset=utf-8");
}

export function selectedWorks(state) {
  const selected = new Set(state.literature.selectedIds);
  return state.literature.works.filter((work) => selected.has(work.id));
}
