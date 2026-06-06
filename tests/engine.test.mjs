import assert from "node:assert/strict";
import {
  buildLiteratureCsv,
  buildLiteratureMarkdown,
  buildGapMatrix,
  buildGapOptions,
  buildLiteratureInsights,
  buildOpenAlexUrl,
  buildProposalPackage,
  buildTopicDeepDive,
  generateReport,
  labelLiteratureSource,
  normalizeOpenAlexWork,
  refineReportForDirections,
  toMarkdown,
} from "../src/engine.js";

function baseInput(overrides = {}) {
  return {
    degreeLevel: "",
    collection: "engineering",
    subfield: "mechanical-engineering",
    method: "experiment-simulation",
    dataCondition: "public-simulation",
    advisorPreference: "偏工程应用和可完成性",
    studentProfile: "会基础 Python 和 SolidWorks，做过机械设计课程项目",
    outputMode: "topic-recommendation",
    multiLevel: false,
    ...overrides,
  };
}

{
  const report = generateReport(baseInput());
  assert.equal(report.degree.level, "硕士生");
  assert.equal(report.degree.assumed, true);
  assert.match(report.degree.warning, /默认按硕士/);
  assert.equal(report.prompt, undefined);
  assert.deepEqual(
    report.workflowStages.map((stage) => stage.key),
    ["route", "candidates", "deep-dive", "literature", "proposal"],
  );
  assert.ok(report.topics.length >= 3);
  assert.ok(report.topics[0].scores.total >= 28);
  assert.ok(report.topics[0].risks.data);
  assert.ok(report.topics[0].nextAction.label.includes("深挖"));
}

{
  const report = generateReport(baseInput());
  assert.equal(report.routing.collectionName, "工程技术");
  assert.equal(report.routing.subfieldName, "机械工程");
  assert.ok(report.pool.core.some((item) => item.includes("Journal of Mechanical Design")));
  assert.ok(report.pool.excluded.some((item) => item.includes("管理")));
  assert.match(report.routing.rationale, /工程技术/);
  assert.match(report.routing.rationale, /实验\/仿真/);
}

{
  const report = generateReport(
    baseInput({
      degreeLevel: "博士生",
      collection: "medicine",
      subfield: "clinical-medicine",
      method: "clinical-public-health",
      dataCondition: "real-data",
      studentProfile: "有医院队列数据和统计基础",
      multiLevel: true,
    }),
  );
  assert.equal(report.degree.level, "博士生");
  assert.equal(report.routing.collectionName, "医学/公共卫生/药学");
  assert.ok(report.pool.core.some((item) => item.includes("New England Journal of Medicine")));
  assert.equal(report.multiLevelVersions.length, 4);
  assert.ok(report.topics[0].innovation.includes("原创") || report.topics[0].innovation.includes("前沿"));
}

{
  const topicReport = generateReport(baseInput({ outputMode: "topic-recommendation" }));
  const poolReport = generateReport(baseInput({ outputMode: "journal-pool" }));
  const matrixReport = generateReport(baseInput({ outputMode: "literature-matrix" }));
  const proposalReport = generateReport(baseInput({ outputMode: "proposal-framework" }));
  const pptReport = generateReport(baseInput({ outputMode: "ppt-outline" }));

  assert.equal(topicReport.modePanel.key, "topic-recommendation");
  assert.match(poolReport.modePanel.title, /期刊池/);
  assert.match(matrixReport.modePanel.title, /文献矩阵/);
  assert.match(proposalReport.modePanel.title, /开题报告/);
  assert.match(pptReport.modePanel.title, /PPT/);
  assert.notDeepEqual(poolReport.modePanel.sections, pptReport.modePanel.sections);
}

{
  const report = generateReport(baseInput());
  const deepDive = buildTopicDeepDive(report, 2);
  assert.equal(deepDive.topic.rank, 2);
  assert.ok(deepDive.searchPlan.openAlexUrl.startsWith("https://api.openalex.org/works?"));
  assert.ok(deepDive.searchPlan.openAlexUrl.includes("search="));
  assert.ok(!deepDive.searchPlan.openAlexUrl.includes("search.semantic="));
  assert.ok(deepDive.searchPlan.openAlexQuery);
  assert.doesNotMatch(deepDive.searchPlan.openAlexQuery, /[\u4e00-\u9fff]/);
  assert.ok(deepDive.searchPlan.query.includes(deepDive.topic.scenario));
  assert.ok(deepDive.discussionQuestions.length >= 4);
  assert.ok(deepDive.narrowingOptions.some((option) => option.level === "standard"));
  assert.ok(deepDive.proposalSections.some((section) => section.title.includes("研究问题")));
}

{
  const input = baseInput({
    collection: "management",
    subfield: "or-optimization",
    method: "optimization",
    dataCondition: "public-simulation",
    advisorPreference: "偏运筹优化和可发表性",
    studentProfile: "会 Python，能跑启发式算法和公开算例",
  });
  const report = generateReport(input);
  const refined = refineReportForDirections(report, ["scenario:车辆路径"], input);
  const scenarioSet = new Set(refined.topics.map((topic) => topic.scenario));
  assert.deepEqual([...scenarioSet], ["车辆路径"]);
  assert.equal(refined.topics.length, 5);
  assert.ok(new Set(refined.topics.map((topic) => topic.question)).size >= 4);
  assert.ok(new Set(refined.topics.map((topic) => topic.dataRoute)).size >= 4);
  assert.ok(refined.topics.every((topic) => topic.apiSearchQuery));
  assert.ok(refined.topics.every((topic) => !/[\u4e00-\u9fff]/.test(topic.apiSearchQuery)));
}

{
  const url = buildOpenAlexUrl("mechanical design reliability", { perPage: 7 });
  assert.match(url, /search=mechanical\+design\+reliability/);
  assert.doesNotMatch(url, /search\.semantic/);
  assert.match(url, /publication_year%3A2000-/);
  assert.match(url, /per-page=7/);
  assert.match(url, /sort=relevance_score%3Adesc/);
}

{
  const report = generateReport(baseInput());
  const coreWork = normalizeOpenAlexWork({
    title: "Robust scheduling for smart manufacturing systems",
    publication_year: 2024,
    doi: "https://doi.org/10.1234/example",
    cited_by_count: 18,
    abstract_inverted_index: {
      Robust: [0],
      scheduling: [1],
      improves: [2],
      throughput: [3],
    },
    concepts: [{ display_name: "Scheduling" }, { display_name: "Manufacturing" }],
    primary_location: {
      source: { display_name: "Journal of Manufacturing Systems" },
      landing_page_url: "https://example.org/article",
    },
    authorships: [
      { author: { display_name: "A. Zhang" } },
      { author: { display_name: "B. Li" } },
    ],
    open_access: { is_oa: true, oa_url: "https://example.org/pdf" },
  });
  const adjacentWork = normalizeOpenAlexWork({
    title: "AI vision for manufacturing inspection",
    publication_year: 2023,
    primary_location: {
      source: { display_name: "计算机视觉/AI" },
      landing_page_url: "https://example.org/ai",
    },
  });

  assert.equal(coreWork.source, "Journal of Manufacturing Systems");
  assert.equal(coreWork.authors, "A. Zhang; B. Li");
  assert.equal(coreWork.abstract, "Robust scheduling improves throughput");
  assert.deepEqual(coreWork.concepts, ["Scheduling", "Manufacturing"]);
  assert.equal(labelLiteratureSource(coreWork, report.pool).label, "核心池");
  assert.equal(labelLiteratureSource(adjacentWork, report.pool).label, "相邻池");

  const md = buildLiteratureMarkdown([coreWork], report.pool);
  assert.match(md, /Robust scheduling/);
  assert.match(md, /核心池/);

  const csv = buildLiteratureCsv([coreWork], report.pool);
  assert.match(csv, /Robust scheduling/);
  assert.match(csv, /核心池/);
}

{
  const report = generateReport(baseInput({ outputMode: "proposal-framework" }));
  const deepDive = buildTopicDeepDive(report, 1);
  const work = normalizeOpenAlexWork({
    title: "Manufacturing systems design review",
    publication_year: 2024,
    primary_location: {
      source: { display_name: "Journal of Manufacturing Systems" },
      landing_page_url: "https://example.org/review",
    },
  });
  const proposal = buildProposalPackage(report, deepDive, [work]);
  assert.match(proposal.chineseTitle, /智能制造|机械/);
  assert.match(proposal.englishTitle, /Research|Study|Design/);
  assert.ok(proposal.literatureGap.length >= 3);
  assert.ok(proposal.defenseQuestions.length >= 5);

  const markdown = toMarkdown(report, deepDive, [work], proposal);
  assert.match(markdown, /# 研究选题工作台报告/);
  assert.match(markdown, /已选方向/);
  assert.match(markdown, /文献列表/);
  assert.doesNotMatch(markdown, /请使用 graduate-proposal-topic-scout/);
}

{
  const input = baseInput({
    outputMode: "proposal-framework",
    collection: "management",
    subfield: "or-optimization",
    method: "optimization",
    dataCondition: "public-simulation",
    advisorPreference: "偏运筹优化和可发表性",
    studentProfile: "会 Python，能跑启发式算法和公开算例",
  });
  const report = refineReportForDirections(generateReport(input), ["scenario:车辆路径"], input);
  const deepDive = buildTopicDeepDive(report, 1);
  const works = [
    normalizeOpenAlexWork({
      title: "Hybrid Truck-Drone Delivery Systems: A Systematic Literature Review",
      publication_year: 2024,
      cited_by_count: 18,
      abstract_inverted_index: {
        Hybrid: [0],
        truck: [1],
        drone: [2],
        delivery: [3],
        systems: [4],
        review: [5],
        routing: [6],
        constraints: [7],
        benchmark: [8],
      },
      primary_location: {
        source: { display_name: "European Journal of Operational Research" },
        landing_page_url: "https://example.org/review",
      },
    }),
    normalizeOpenAlexWork({
      title: "Multiobjective Optimization for Planning the Service Areas of Smart Parcel Locker Facilities in Logistics Last Mile Delivery",
      publication_year: 2022,
      cited_by_count: 9,
      abstract_inverted_index: {
        Multiobjective: [0],
        optimization: [1],
        planning: [2],
        smart: [3],
        parcel: [4],
        locker: [5],
        facilities: [6],
        last: [7],
        mile: [8],
        delivery: [9],
        service: [10],
        areas: [11],
      },
      primary_location: {
        source: { display_name: "Transportation Research Part E" },
        landing_page_url: "https://example.org/reliability",
      },
    }),
  ];
  const matrix = buildGapMatrix(report, deepDive, works);
  assert.equal(matrix.template, "车辆路径场景矩阵");
  assert.ok(matrix.dimensions.length >= 7);
  assert.deepEqual(
    matrix.dimensions.slice(0, 6).map((dimension) => dimension.key),
    ["delivery_object", "vehicle_mode", "route_constraint", "time_window_capacity", "objective_function", "demand_uncertainty"],
  );
  assert.equal(matrix.rows.length, 2);
  assert.ok(matrix.rows.every((row) => row.cells.length === matrix.dimensions.length));
  assert.ok(matrix.coverage.some((item) => item.key === "benchmark_baseline" && item.coveredCount >= 1));
  assert.ok(matrix.scenarioLens.variables.includes("车辆/运载方式"));
  assert.ok(
    matrix.rows.some((row) =>
      row.cells.some((cell) => cell.key === "vehicle_mode" && /truck|drone|车辆|无人机/i.test(cell.value)),
    ),
  );
  assert.ok(matrix.highThreatPapers.length >= 1);

  const gapOptions = buildGapOptions(report, deepDive, works);
  assert.ok(gapOptions.length >= 3);
  assert.ok(gapOptions.every((option) => option.gapName.includes(deepDive.topic.scenario)));
  assert.ok(gapOptions.every((option) => option.gapType));
  assert.ok(gapOptions.every((option) => option.missingDimension));
  assert.ok(gapOptions.every((option) => option.evidenceChain.length >= 2));
  assert.ok(gapOptions.every((option) => option.scores.total >= 0));
  assert.ok(gapOptions.every((option) => /A|B|C|D|E/.test(option.maturity.level)));
  assert.ok(gapOptions.every((option) => option.researchQuestions.length >= 3));
  assert.ok(gapOptions.every((option) => option.contributions.length >= 3));
  assert.ok(gapOptions.every((option) => option.overclaimRisks.length >= 3));
  assert.ok(gapOptions.every((option) => option.nextSearchKeywords.length >= 2));
  assert.ok(gapOptions.every((option) => option.structuredDraft.gapName));
  assert.ok(gapOptions.some((option) => option.missingDimension.includes("车辆/运载方式")));
  assert.ok(gapOptions.every((option) => option.scenarioLens?.scenario === "车辆路径"));
  assert.ok(gapOptions.every((option) => option.scenarioLens?.keyVariables?.length >= 5));
  assert.ok(
    gapOptions.every(
      (option) =>
        option.structuredDraft.expectedData.includes("VRP") ||
        option.structuredDraft.expectedData.includes("Solomon") ||
        option.structuredDraft.expectedData.includes("仿真"),
    ),
  );
  assert.ok(gapOptions.every((option) => option.literatureSynthesis.includes("已读")));
  assert.ok(gapOptions.every((option) => option.openingDirection.includes("开题")));
  assert.ok(gapOptions.every((option) => option.draft.includes(deepDive.topic.scenario)));
  assert.ok(gapOptions.every((option) => !works.some((work) => option.title === work.title)));

  const insights = buildLiteratureInsights(report, deepDive, works);
  assert.equal(insights.readings.length, 2);
  assert.ok(insights.readings.every((reading) => reading.closeReading.includes("本文")));
  assert.ok(insights.readings.every((reading) => reading.relevance.includes(deepDive.topic.scenario)));
  assert.ok(insights.synthesis.includes("已读 2 篇"));
}

console.log("engine tests passed");
