import { labelLiteratureSource } from "../engine.js";

const fitOrder = {
  核心池: 0,
  相邻池: 1,
  待核验: 2,
  排除池: 3,
};

export function sortLiteratureWorks(works, sortConfig = {}, pool = { core: [], adjacent: [], excluded: [] }) {
  const key = sortConfig.key || "relevance";
  if (key === "relevance") {
    return [...works];
  }
  const direction = sortConfig.direction === "asc" ? 1 : -1;
  return works
    .map((work, index) => ({ work, index }))
    .sort((left, right) => {
      const result = compareValues(valueForSort(left.work, key, pool), valueForSort(right.work, key, pool));
      return result === 0 ? left.index - right.index : result * direction;
    })
    .map((item) => item.work);
}

export function filterLiteratureWorks(works, filters = {}) {
  const fromYear = parseYear(filters.fromYear);
  const toYear = parseYear(filters.toYear);
  return works.filter((work) => {
    const year = parseYear(work.year);
    if (!year) {
      return true;
    }
    if (fromYear && year < fromYear) {
      return false;
    }
    if (toYear && year > toYear) {
      return false;
    }
    return true;
  });
}

function valueForSort(work, key, pool) {
  if (key === "fit") {
    return fitOrder[labelLiteratureSource(work, pool).label] ?? fitOrder["待核验"];
  }
  if (key === "year" || key === "citedBy") {
    const value = Number(work[key]);
    return Number.isFinite(value) ? value : -1;
  }
  return String(work[key] || "").toLowerCase();
}

function compareValues(left, right) {
  if (typeof left === "number" && typeof right === "number") {
    return left - right;
  }
  return String(left).localeCompare(String(right), "zh-Hans-CN");
}

function parseYear(value) {
  const year = Number(value);
  return Number.isInteger(year) && year >= 1800 ? year : 0;
}
