import assert from "node:assert/strict";
import { filterLiteratureWorks, sortLiteratureWorks } from "../src/services/literatureSort.js";

const pool = {
  core: ["Journal of Manufacturing Systems"],
  adjacent: ["OR Spectrum"],
  excluded: ["Irrelevant Journal"],
};

const works = [
  { id: "w1", title: "Beta routing", source: "OR Spectrum", year: 2020, citedBy: 22 },
  { id: "w2", title: "Alpha manufacturing", source: "Journal of Manufacturing Systems", year: 2024, citedBy: 5 },
  { id: "w3", title: "Gamma benchmark", source: "Unknown Journal", year: 2022, citedBy: 70 },
];

{
  const sorted = sortLiteratureWorks(works, { key: "year", direction: "desc" }, pool);
  assert.deepEqual(
    sorted.map((work) => work.id),
    ["w2", "w3", "w1"],
  );
}

{
  const sorted = sortLiteratureWorks(works, { key: "citedBy", direction: "desc" }, pool);
  assert.deepEqual(
    sorted.map((work) => work.id),
    ["w3", "w1", "w2"],
  );
}

{
  const sorted = sortLiteratureWorks(works, { key: "fit", direction: "asc" }, pool);
  assert.deepEqual(
    sorted.map((work) => work.id),
    ["w2", "w1", "w3"],
  );
}

{
  const filtered = filterLiteratureWorks(works, { fromYear: "2021", toYear: "2024" });
  assert.deepEqual(
    filtered.map((work) => work.id),
    ["w2", "w3"],
  );
}

console.log("literature sort tests passed");
