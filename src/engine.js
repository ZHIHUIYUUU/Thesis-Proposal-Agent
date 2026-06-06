import { collections, degreeProfiles, outputOptions, pools } from "./data.js";

const degreeAliases = {
  "": "master",
  master: "master",
  "硕士": "master",
  "硕士生": "master",
  undergraduate: "undergraduate",
  "本科": "undergraduate",
  "本科生": "undergraduate",
  doctoral: "doctoral",
  "博士": "doctoral",
  "博士生": "doctoral",
  vocational: "vocational",
  "专科": "vocational",
  "专科生": "vocational",
  "高职": "vocational",
};

const methodLabels = {
  optimization: "优化/建模",
  "empirical-causal": "实证/因果",
  "algorithm-system": "算法/系统",
  "experiment-simulation": "实验/仿真",
  "clinical-public-health": "临床/公卫",
  "wet-lab": "生物实验",
  qualitative: "质性/理论",
};

const methodEnglish = {
  optimization: "optimization and modeling",
  "empirical-causal": "empirical and causal analysis",
  "algorithm-system": "algorithmic system design",
  "experiment-simulation": "experimental and simulation",
  "clinical-public-health": "clinical and public health",
  "wet-lab": "wet-lab experimental",
  qualitative: "qualitative and theoretical",
};

const dataLabels = {
  unknown: "暂不确定",
  "public-simulation": "公开数据/仿真",
  "real-data": "已有真实数据",
  "small-experiment": "小规模实验",
  "literature-only": "文献综述为主",
  prototype: "系统/原型实现",
};

const outputLabels = Object.fromEntries(outputOptions);

const poolQueryTerms = {
  "mechanical-engineering": "mechanical engineering manufacturing systems design optimization",
  "materials-science": "materials science design synthesis characterization",
  "civil-engineering": "civil engineering infrastructure construction structural",
  "biomedical-engineering": "biomedical engineering medical imaging biosensors biomechanics",
  "clinical-medicine": "clinical medicine diagnosis prognosis treatment",
  "public-health-epidemiology": "public health epidemiology population health",
  "pharmacy-pharmacology": "pharmacology pharmacy drug delivery pharmacokinetics",
  "molecular-cell-biology": "molecular biology cell biology mechanism",
  "bioinformatics-computational-biology": "bioinformatics computational biology genomics",
  "chemistry-chemical-engineering": "chemical engineering chemistry catalysis process",
  "environment-earth-agriculture": "environmental science agriculture remote sensing climate",
  "mathematics-physics": "applied mathematics physics statistics",
  "education-psychology-social-science": "education psychology social science",
  "or-optimization": "operations research optimization scheduling routing",
  "supply-chain-operations": "supply chain operations management inventory",
  "transportation-logistics": "transportation logistics routing mobility",
  "energy-systems": "energy systems smart grid dispatch optimization",
  "computer-science": "computer science machine learning systems",
  "management-empirical": "empirical management business research",
};

const scenarioSearchTerms = {
  智能制造: "smart manufacturing flexible production manufacturing systems",
  机械结构可靠性: "mechanical structural reliability failure analysis",
  热流体系统: "thermal fluid system heat transfer flow simulation",
  设备状态监测: "equipment condition monitoring fault diagnosis predictive maintenance",
  增材制造: "additive manufacturing 3d printing process optimization",
  功能材料: "functional materials properties characterization",
  复合材料: "composite materials mechanical properties",
  能源材料: "energy materials battery catalysis storage",
  生物材料: "biomaterials tissue engineering biocompatibility",
  计算材料: "computational materials machine learning materials design",
  智慧建造: "smart construction automation digital construction",
  结构可靠性: "structural reliability infrastructure resilience",
  基础设施运维: "infrastructure maintenance asset management",
  低碳建材: "low carbon construction materials cement concrete",
  水资源系统: "water resources systems hydrology management",
  医学影像: "medical imaging diagnosis image analysis",
  生物传感: "biosensors biomedical sensing wearable sensors",
  康复工程: "rehabilitation engineering assistive technology",
  医疗器械: "medical devices biomedical instrumentation",
  组织工程: "tissue engineering regenerative medicine",
  诊断预测: "diagnostic prediction clinical risk model",
  治疗效果: "treatment effect clinical outcome",
  预后模型: "prognostic model survival prediction",
  临床路径: "clinical pathway care process",
  数字健康: "digital health telemedicine",
  疾病负担: "disease burden epidemiology",
  环境健康: "environmental health exposure assessment",
  健康政策: "health policy public health evaluation",
  队列研究: "cohort study longitudinal epidemiology",
  干预评估: "intervention evaluation public health",
  药物递送: "drug delivery controlled release",
  药代药效: "pharmacokinetics pharmacodynamics",
  毒理: "toxicology safety assessment",
  药物发现: "drug discovery medicinal chemistry",
  临床药学: "clinical pharmacy medication management",
  细胞信号: "cell signaling molecular mechanism",
  基因调控: "gene regulation transcription epigenetics",
  免疫机制: "immune mechanism immunology",
  微生物机制: "microbial mechanism microbiome",
  疾病机制: "disease mechanism molecular pathology",
  单细胞分析: "single cell analysis single-cell sequencing",
  多组学整合: "multi-omics integration genomics proteomics",
  生物网络: "biological network systems biology",
  疾病分型: "disease subtyping precision medicine",
  "数据库/工具": "database tool bioinformatics software",
  催化: "catalysis reaction mechanism",
  分离过程: "separation process membrane adsorption",
  反应工程: "reaction engineering reactor design",
  绿色化学: "green chemistry sustainable synthesis",
  过程系统: "process systems engineering optimization",
  气候影响: "climate impact environmental change",
  水环境: "water environment pollution treatment",
  遥感监测: "remote sensing monitoring",
  农业生态: "agricultural ecology crop environment",
  循环经济: "circular economy waste recycling",
  优化理论: "optimization theory mathematical programming",
  统计方法: "statistical methods inference",
  数值分析: "numerical analysis computational mathematics",
  凝聚态: "condensed matter physics",
  "光学/应用物理": "optics applied physics photonics",
  教育技术: "educational technology learning analytics",
  学习评价: "learning assessment educational measurement",
  心理测量: "psychometrics psychological measurement",
  组织行为: "organizational behavior management psychology",
  社会政策: "social policy evaluation",
  车辆路径: "vehicle routing problem last mile delivery routing",
  调度: "scheduling problem operations research production scheduling",
  库存: "inventory control inventory routing supply chain",
  选址: "facility location location allocation logistics network",
  "鲁棒/随机优化": "robust optimization stochastic programming uncertainty",
  韧性供应链: "supply chain resilience disruption risk",
  低碳运营: "low carbon operations emission reduction",
  库存生产: "inventory production planning",
  平台服务: "platform service operations",
  全渠道履约: "omnichannel fulfillment retail operations",
  城市配送: "urban delivery city logistics",
  网约车调度: "ride hailing dispatch mobility",
  电动车路径: "electric vehicle routing charging logistics",
  多式联运: "multimodal transportation intermodal logistics",
  低碳运输: "low carbon transportation sustainable logistics",
  微电网调度: "microgrid dispatch energy management",
  储能运行: "energy storage operation optimization",
  需求响应: "demand response smart grid",
  电动车充电: "electric vehicle charging scheduling",
  低碳能源管理: "low carbon energy management",
  机器学习: "machine learning model evaluation",
  NLP: "natural language processing language model",
  计算机视觉: "computer vision image recognition",
  系统安全: "systems security cybersecurity",
  软件工程: "software engineering empirical software",
  平台治理: "platform governance digital platform",
  "AI 采纳": "AI adoption technology acceptance",
  绿色创新: "green innovation environmental management",
  数字化转型: "digital transformation management",
  消费者行为: "consumer behavior marketing",
};

const genericAngles = [
  {
    key: "scope-definition",
    name: "边界收窄",
    questionFocus: "可完成边界和核心变量",
    methodFocus: "先界定对象、变量和评价指标，再选择可复现的方法路线",
    dataFocus: "优先找到一组可公开说明来源和质量的数据或案例",
    evaluationFocus: "用小样本验证、对比表和误差/偏差说明支撑结论",
    innovationFocus: "把大方向收窄成一个可答辩的小问题",
    searchTerms: "research design evidence evaluation",
    methodRisk: "如果边界没有收窄，后续文献和方法都会变成泛泛综述。",
  },
  {
    key: "comparative-evidence",
    name: "对比证据",
    questionFocus: "方法对比和适用条件",
    methodFocus: "设置基线、对照组或替代方案，明确评价指标",
    dataFocus: "需要能支持横向比较的数据、案例或可复现实验材料",
    evaluationFocus: "用基线对比、敏感性分析或稳健性检查说明改进是否成立",
    innovationFocus: "把创新落在适用场景、指标组合或证据组织上",
    searchTerms: "comparative study benchmark evaluation",
    methodRisk: "没有基线或对照时，结论容易被质疑只是主观判断。",
  },
  {
    key: "mechanism-explanation",
    name: "机制解释",
    questionFocus: "关键机制和影响路径",
    methodFocus: "围绕机制、变量关系或过程链条组织研究设计",
    dataFocus: "需要能解释机制的过程数据、访谈材料、实验记录或文献证据",
    evaluationFocus: "用机制图、证据矩阵和反例讨论说明解释力度",
    innovationFocus: "贡献重点放在解释框架和边界条件",
    searchTerms: "mechanism framework evidence",
    methodRisk: "机制如果只停留在概念层面，开题时会被追问证据来源。",
  },
  {
    key: "application-validation",
    name: "应用验证",
    questionFocus: "本地应用和可交付验证",
    methodFocus: "把方案落实到工具、流程、模型或原型，并设计可检查指标",
    dataFocus: "需要至少一个本地案例、公开样例或可运行原型测试",
    evaluationFocus: "从准确性、效率、成本或可用性中选择 2-3 个指标验证",
    innovationFocus: "把贡献放在本地化适配和可交付方案上",
    searchTerms: "application validation case study prototype",
    methodRisk: "只有方案描述但没有验证指标，会变成不可答辩的设计说明。",
  },
  {
    key: "risk-control",
    name: "风险控制",
    questionFocus: "不确定性、偏差或失效条件",
    methodFocus: "识别风险来源，并用鲁棒性、敏感性或边界测试控制结论",
    dataFocus: "需要覆盖极端情形、异常样本或不同参数组合",
    evaluationFocus: "用风险清单、敏感性图和失败案例说明边界",
    innovationFocus: "把创新放在可靠性、稳健性或风险解释上",
    searchTerms: "risk uncertainty robustness sensitivity",
    methodRisk: "如果只展示成功结果，不说明失败边界，答辩风险较高。",
  },
];

const methodAngles = {
  optimization: [
    {
      key: "constraint-model",
      name: "约束建模",
      questionFocus: "容量、时间窗、成本或服务水平约束",
      methodFocus: "混合整数规划、约束定义和小规模精确/启发式求解",
      dataFocus: "优先使用 VRPLIB、Solomon、公开调度算例或自建仿真实例，并说明参数来源",
      evaluationFocus: "比较基线规则、经典启发式和改进方案的成本、时间、可行率",
      innovationFocus: "把真实场景约束转化为清楚的数学模型，而不是只换算法名",
      searchTerms: "mixed integer programming constraints benchmark heuristic",
      methodRisk: "约束必须能写成模型并能运行验证，不能只在文字里堆限制条件。",
    },
    {
      key: "uncertainty-robust",
      name: "不确定性处理",
      questionFocus: "需求波动、旅行时间扰动或资源不确定性",
      methodFocus: "鲁棒优化、随机规划、情景生成或滚动优化",
      dataFocus: "需要历史波动、仿真扰动或公开场景集支撑不确定性设定",
      evaluationFocus: "比较平均表现、最坏情形、服务违约率和计算时间",
      innovationFocus: "把贡献落在不确定性描述和稳健性收益上",
      searchTerms: "robust optimization stochastic programming uncertainty scenarios",
      methodRisk: "不确定性分布如果没有依据，会被质疑为人为制造问题。",
    },
    {
      key: "multi-objective",
      name: "多目标权衡",
      questionFocus: "成本、效率、碳排放或公平性的权衡",
      methodFocus: "多目标优化、权重法、Pareto 前沿或目标规划",
      dataFocus: "需要能计算多类目标的参数，如距离、能耗、时间、服务质量或成本",
      evaluationFocus: "用 Pareto 解、权重敏感性和典型方案解释取舍",
      innovationFocus: "把传统单目标问题改写成符合现实决策的多目标方案",
      searchTerms: "multi objective optimization pareto emission service level",
      methodRisk: "目标过多会稀释论文主线，必须明确主目标和解释顺序。",
    },
    {
      key: "algorithm-benchmark",
      name: "算法对比",
      questionFocus: "启发式、元启发式或分解算法的性能差异",
      methodFocus: "ALNS、遗传算法、禁忌搜索、列生成或 Benders 分解的可复现实验",
      dataFocus: "需要公开算例、统一参数和可重复运行的代码实验记录",
      evaluationFocus: "比较最优性差距、运行时间、稳定性和不同规模下的表现",
      innovationFocus: "以可复现实验说明一个小改进是否真的有效",
      searchTerms: "adaptive large neighborhood search metaheuristic benchmark vehicle routing",
      methodRisk: "算法名不能代替贡献，必须有基线、消融或参数敏感性。",
    },
    {
      key: "simulation-sensitivity",
      name: "仿真敏感性",
      questionFocus: "场景参数变化对方案表现的影响",
      methodFocus: "仿真实验、情景分析和敏感性分析",
      dataFocus: "需要把需求、容量、时间窗、成本或资源参数设置成可解释的实验矩阵",
      evaluationFocus: "用参数曲线和情景对比解释方案在哪些条件下有效",
      innovationFocus: "把贡献放在场景适配和决策启示上",
      searchTerms: "simulation sensitivity analysis scenario analysis operations research",
      methodRisk: "仿真参数如果缺少现实解释，结论会显得像调参游戏。",
    },
  ],
  "empirical-causal": [
    {
      key: "variable-mechanism",
      name: "变量机制",
      questionFocus: "核心变量、作用机制和理论路径",
      methodFocus: "变量定义、理论模型、回归或结构方程设计",
      dataFocus: "需要可观测变量、样本来源和测量口径",
      evaluationFocus: "报告主效应、机制检验和替代解释",
      innovationFocus: "把贡献放在机制链条和边界条件",
      searchTerms: "empirical study mechanism mediation moderation",
      methodRisk: "变量没有理论来源时，模型会像拼凑回归。",
    },
    {
      key: "identification",
      name: "识别策略",
      questionFocus: "因果识别和内生性处理",
      methodFocus: "DID、IV、PSM、断点或固定效应模型",
      dataFocus: "需要政策冲击、时间变化、面板数据或可解释工具变量",
      evaluationFocus: "做平行趋势、安慰剂、稳健性和异质性检验",
      innovationFocus: "贡献在识别设计和因果解释可信度",
      searchTerms: "causal inference difference in differences panel data",
      methodRisk: "没有识别来源时，不应把相关关系写成因果结论。",
    },
    {
      key: "heterogeneity",
      name: "异质性分析",
      questionFocus: "不同群体、地区或情境下的差异",
      methodFocus: "分组回归、交互项、分位数回归或多层模型",
      dataFocus: "需要样本量足以支撑分组，并明确分组理由",
      evaluationFocus: "解释差异来源，而不是机械列出显著性",
      innovationFocus: "贡献在边界条件和管理启示",
      searchTerms: "heterogeneity analysis subgroup moderation empirical",
      methodRisk: "分组过多会制造偶然显著，必须控制假设数量。",
    },
    {
      key: "robustness",
      name: "稳健性检验",
      questionFocus: "结论在替代指标和模型下是否稳定",
      methodFocus: "替代变量、替代样本、滞后项和模型设定检验",
      dataFocus: "需要能构造替代指标或补充样本的数据条件",
      evaluationFocus: "用稳健性表格说明结论可信度",
      innovationFocus: "贡献在证据链完整性",
      searchTerms: "robustness check empirical model alternative measures",
      methodRisk: "稳健性不能补救错误识别，只能支撑已有研究设计。",
    },
    {
      key: "policy-implication",
      name: "政策/管理启示",
      questionFocus: "研究结果如何转化为管理建议",
      methodFocus: "把实证结果与制度、组织或政策情境连接",
      dataFocus: "需要案例背景、制度文本或行业数据辅助解释",
      evaluationFocus: "说明建议适用对象和限制条件",
      innovationFocus: "贡献在情境解释和实践启示",
      searchTerms: "management implication policy evaluation empirical evidence",
      methodRisk: "启示必须来自结果，不能在结论部分重新编故事。",
    },
  ],
  "algorithm-system": [
    {
      key: "benchmark-model",
      name: "基准模型",
      questionFocus: "算法在公开基准上的表现",
      methodFocus: "模型选择、基线复现、指标定义和误差分析",
      dataFocus: "优先选择公开数据集、可复现划分和明确评价脚本",
      evaluationFocus: "比较准确率、召回、F1、AUC、延迟或资源消耗",
      innovationFocus: "贡献在可解释的小改进和可靠复现",
      searchTerms: "benchmark dataset baseline model evaluation",
      methodRisk: "没有强基线时，模型效果没有说服力。",
    },
    {
      key: "system-prototype",
      name: "系统原型",
      questionFocus: "算法如何落到可运行系统",
      methodFocus: "架构设计、接口流程、模块实现和端到端测试",
      dataFocus: "需要演示数据、用户任务或实际场景样例",
      evaluationFocus: "测试准确性、响应时间、可用性和异常处理",
      innovationFocus: "贡献在系统集成和可用性验证",
      searchTerms: "system prototype architecture evaluation",
      methodRisk: "只有界面没有核心算法或评估，会变成普通课程设计。",
    },
    {
      key: "robustness-security",
      name: "鲁棒安全",
      questionFocus: "模型在噪声、攻击或分布变化下是否可靠",
      methodFocus: "鲁棒训练、异常检测、压力测试或安全评估",
      dataFocus: "需要扰动样本、异常样本或跨域测试集",
      evaluationFocus: "报告失败案例、鲁棒指标和边界条件",
      innovationFocus: "贡献在可靠性提升和风险解释",
      searchTerms: "robustness security distribution shift stress testing",
      methodRisk: "安全和鲁棒性不能只靠直觉，需要明确威胁模型或扰动方式。",
    },
    {
      key: "data-construction",
      name: "数据构建",
      questionFocus: "数据集、标注或知识库如何支撑任务",
      methodFocus: "数据采集、清洗、标注规范和质量控制",
      dataFocus: "需要说明样本来源、标注一致性和隐私/授权边界",
      evaluationFocus: "用数据统计、标注一致性和模型实验证明价值",
      innovationFocus: "贡献在数据资源和任务定义",
      searchTerms: "dataset construction annotation data quality",
      methodRisk: "数据构建必须有任务价值，不能只是收集资料。",
    },
    {
      key: "interpretability",
      name: "可解释性",
      questionFocus: "模型输出是否能被用户或领域专家理解",
      methodFocus: "可解释模型、特征归因、案例分析或人机协同评估",
      dataFocus: "需要代表性案例和可核对的领域解释",
      evaluationFocus: "结合量化指标和案例解释验证可信度",
      innovationFocus: "贡献在可解释证据和实际决策支持",
      searchTerms: "interpretability explainable artificial intelligence case analysis",
      methodRisk: "解释图不能替代科学解释，必须连接领域问题。",
    },
  ],
  "experiment-simulation": [
    {
      key: "parameter-sensitivity",
      name: "参数敏感性",
      questionFocus: "关键参数如何影响性能或结果",
      methodFocus: "仿真建模、参数设计和敏感性分析",
      dataFocus: "需要明确参数范围、物理意义和实验/文献来源",
      evaluationFocus: "用曲线、响应面或对比表说明影响规律",
      innovationFocus: "贡献在参数规律和设计建议",
      searchTerms: "simulation sensitivity analysis parameter study",
      methodRisk: "参数范围不能任意设定，否则结论无法支撑工程判断。",
    },
    {
      key: "structure-optimization",
      name: "结构优化",
      questionFocus: "结构、工艺或配置如何改进性能",
      methodFocus: "实验设计、仿真优化、对比验证或响应面方法",
      dataFocus: "需要几何、工艺、材料或运行条件的可控数据",
      evaluationFocus: "比较改进前后性能，并说明约束和代价",
      innovationFocus: "贡献在结构/工艺参数的可验证改进",
      searchTerms: "design optimization experiment simulation response surface",
      methodRisk: "只有仿真最优值不够，需要解释工程可行性。",
    },
    {
      key: "comparative-experiment",
      name: "对比实验",
      questionFocus: "不同方案或模型在同一条件下的差异",
      methodFocus: "控制变量、重复实验和统计对比",
      dataFocus: "需要统一实验条件和可重复记录",
      evaluationFocus: "报告均值、波动、显著性或误差来源",
      innovationFocus: "贡献在清晰证据而不是复杂方法",
      searchTerms: "comparative experiment controlled study validation",
      methodRisk: "如果变量没有控制，差异无法归因。",
    },
    {
      key: "failure-mechanism",
      name: "失效机理",
      questionFocus: "失效、退化或异常现象的形成原因",
      methodFocus: "失效分析、监测数据、仿真复现和机理解释",
      dataFocus: "需要故障样本、实验记录、传感数据或仿真结果",
      evaluationFocus: "用证据链解释现象、原因和边界",
      innovationFocus: "贡献在机理解释和预防建议",
      searchTerms: "failure mechanism degradation analysis monitoring",
      methodRisk: "没有观测证据时，机理解释会被认为是猜测。",
    },
    {
      key: "prototype-validation",
      name: "原型验证",
      questionFocus: "方案能否在原型或小规模系统中运行",
      methodFocus: "原型搭建、功能测试和性能评价",
      dataFocus: "需要测试场景、样例数据和可重复操作流程",
      evaluationFocus: "评价准确性、效率、稳定性或用户任务完成度",
      innovationFocus: "贡献在可交付系统和验证流程",
      searchTerms: "prototype validation performance evaluation",
      methodRisk: "原型必须服务研究问题，不能只是展示功能。",
    },
  ],
  "clinical-public-health": genericAngles,
  "wet-lab": genericAngles,
  qualitative: genericAngles,
};

export function normalizeDegree(value) {
  const key = degreeAliases[value] || value || "master";
  const profile = degreeProfiles[key] || degreeProfiles.master;
  return {
    key: degreeProfiles[key] ? key : "master",
    level: profile.level,
    profile,
    assumed: !value || !degreeProfiles[key],
    warning: !value || !degreeProfiles[key] ? "未指定培养层次，默认按硕士生进行开题深度匹配。" : "",
  };
}

export function routeInput(input) {
  const collectionKey = collections[input.collection] ? input.collection : "engineering";
  const collection = collections[collectionKey];
  const subfieldKey = collection.subfields[input.subfield] ? input.subfield : Object.keys(collection.subfields)[0];
  const pool = pools[subfieldKey] || pools["mechanical-engineering"];
  const method = methodLabels[input.method] ? input.method : "experiment-simulation";
  const dataCondition = dataLabels[input.dataCondition] ? input.dataCondition : "unknown";
  const methodName = methodLabels[method];
  const dataConditionName = dataLabels[dataCondition];

  return {
    collectionKey,
    collectionName: collection.name,
    subfieldKey,
    subfieldName: collection.subfields[subfieldKey] || pool.name,
    method,
    methodName,
    methodEnglish: methodEnglish[method],
    dataCondition,
    dataConditionName,
    rationale: `该任务被路由到${collection.name}下的${collection.subfields[subfieldKey] || pool.name}，主证据应匹配${methodName}方法传统。核心池用于证明研究问题和方法贡献，相邻池只用于背景或交叉证据，排除池不能支撑主要创新。`,
    methodBoundary: methodBoundary(method),
  };
}

function methodBoundary(method) {
  const boundaries = {
    optimization: "主证据应来自运筹优化、建模、计算决策或场景内运营优化文献。",
    "empirical-causal": "主证据应包含理论、变量、识别策略、样本和稳健性检验。",
    "algorithm-system": "主证据应来自算法、系统、基准实验或对应技术社区。",
    "experiment-simulation": "主证据应围绕工程对象、实验设计、仿真模型、评价指标和可复现验证。",
    "clinical-public-health": "主证据应匹配临床、流行病、公共卫生或医学统计研究设计。",
    "wet-lab": "主证据应匹配生物层级、实验技术、机制证据和验证链条。",
    qualitative: "主证据应匹配质性、理论、文本、案例或解释性研究传统。",
  };
  return boundaries[method] || boundaries["experiment-simulation"];
}

function levelVerb(degreeKey) {
  return {
    vocational: ["应用", "流程", "案例"],
    undergraduate: ["复现", "小实验", "对比"],
    master: ["建模", "验证", "优化"],
    doctoral: ["原创", "机制", "理论"],
  }[degreeKey] || ["建模", "验证", "优化"];
}

function titlePrefix(degreeKey) {
  return {
    vocational: "面向",
    undergraduate: "基于",
    master: "考虑",
    doctoral: "面向前沿机制的",
  }[degreeKey] || "考虑";
}

function dataRouteFor(condition, scenario) {
  const routes = {
    unknown: `先确认${scenario}是否有公开数据、可仿真数据或小样本实验条件，再决定题目边界。`,
    "public-simulation": `优先使用公开数据、仿真模型或可复现实验基准支撑${scenario}研究。`,
    "real-data": `围绕已有真实数据明确样本范围、字段质量、伦理/权限和可重复验证。`,
    "small-experiment": `用小规模实验或原型测试形成可控证据链，避免扩大到不可完成的系统验证。`,
    "literature-only": `先把题目收窄为综述、方法比较或研究框架，避免声称未经验证的实证结论。`,
    prototype: `以系统或工具原型为证据主线，配套可用性、准确性或效率评价。`,
  };
  return routes[condition] || routes.unknown;
}

function buildTopic(pool, route, degree, index, input, overrides = {}) {
  const scenario = overrides.scenario || pool.scenarios[index % pool.scenarios.length];
  const angle = overrides.angle || angleForRoute(route, index);
  const verbs = levelVerb(degree.key);
  const advisor = input.advisorPreference?.trim() || "导师偏好暂未指定";
  const profile = input.studentProfile?.trim() || "学生能力画像暂未填写";
  const title = `${titlePrefix(degree.key)}${scenario}${angle.name}的${route.methodName}${degree.profile.topicStyle}选题`;
  const englishTitle = `${capitalize(route.methodEnglish)} Study of ${scenarioEnglishTerms(scenario)} with ${angle.key.replaceAll("-", " ")}`;
  const question = buildResearchQuestion(degree.key, scenario, route.methodName, angle);
  const methodRoute = `${route.methodName}：${angle.methodFocus}；数据条件：${route.dataConditionName}；学生画像：${profile}`;
  const dataRoute = `${dataRouteFor(route.dataCondition, scenario)} ${angle.dataFocus}`;
  const innovation = `${innovationForDegree(degree.key)} ${angle.innovationFocus}`;
  const risks = riskNotesForTopic(degree, route, pool, scenario, advisor, angle);
  const scores = scoreTopic(degree, route, input, index, angle);

  return {
    rank: index + 1,
    title,
    englishTitle,
    scenario,
    angle,
    verbs,
    question,
    methodRoute,
    dataRoute,
    innovation,
    expectedDeliverable: degree.profile.deliverable,
    levelFit: `${degree.level}：${degree.profile.topicStyle}`,
    risk: Object.values(risks).join(" "),
    risks,
    scores,
    searchQuery: buildSearchQuery(pool, route, scenario, angle),
    apiSearchQuery: buildOpenAlexQuery(pool, route, scenario, angle),
    discussionQuestions: buildDiscussionQuestions(degree, route, scenario, angle),
    nextAction: {
      label: "选择并深挖",
      targetStage: "deep-dive",
      topicRank: index + 1,
    },
  };
}

function buildResearchQuestion(degreeKey, scenario, methodName, angle) {
  const focus = angle?.questionFocus || "核心问题";
  return {
    vocational: `如何在${scenario}场景下围绕${focus}形成可落地的应用流程或工具方案？`,
    undergraduate: `如何在${scenario}的${focus}问题上复现并评价一个小规模${methodName}改进？`,
    master: `如何围绕${scenario}的${focus}构建可验证的${methodName}研究问题？`,
    doctoral: `如何围绕${scenario}的${focus}提出具有前沿原创性的理论、机制或方法问题？`,
  }[degreeKey];
}

function innovationForDegree(degreeKey) {
  return {
    vocational: "强调本地应用、流程改进和可交付原型，避免过度学术创新。",
    undergraduate: "强调复现、对比验证和小幅改进，控制变量和工作量。",
    master: "强调真实文献缺口、有限创新和可答辩的实验/数据路线。",
    doctoral: "强调原创问题、前沿对比、系统研究计划和可发表贡献。",
  }[degreeKey];
}

function translateScenario(scenario) {
  const terms = {
    智能制造: "smart manufacturing",
    机械结构可靠性: "mechanical structure reliability",
    热流体系统: "thermal-fluid systems",
    设备状态监测: "equipment condition monitoring",
    增材制造: "additive manufacturing",
    医学影像: "medical imaging",
    诊断预测: "diagnostic prediction",
    电动车充电: "electric vehicle charging",
    车辆路径: "vehicle routing",
  };
  return terms[scenario] || scenario;
}

function scenarioEnglishTerms(scenario) {
  return scenarioSearchTerms[scenario] || asciiOnly(translateScenario(scenario));
}

function capitalize(value) {
  return value ? value.charAt(0).toUpperCase() + value.slice(1) : "";
}

function angleForRoute(route, index) {
  const angles = methodAngles[route.method] || genericAngles;
  return angles[index % angles.length];
}

function buildSearchQuery(pool, route, scenario, angle) {
  const poolTerms = poolQueryTerms[route.subfieldKey] || pool.name;
  return `${scenario} ${scenarioEnglishTerms(scenario)} ${angle.name} ${angle.searchTerms} ${poolTerms} ${route.methodEnglish}`
    .replace(/\s+/g, " ")
    .trim();
}

function buildOpenAlexQuery(pool, route, scenario, angle) {
  const poolTerms = poolQueryTerms[route.subfieldKey] || "";
  return dedupeWords(`${scenarioEnglishTerms(scenario)} ${angle.searchTerms} ${route.methodEnglish} ${poolTerms}`);
}

function buildDiscussionQuestions(degree, route, scenario, angle) {
  return [
    `你更想把“${scenario}”里的“${angle.name}”做成${degree.profile.topicStyle}，还是先降一级做成更稳的版本？`,
    `你能获得哪类数据或实验条件来支撑“${angle.questionFocus}”？`,
    `导师更看重应用价值、方法创新、实验结果，还是论文发表潜力？`,
    `这个方向里哪些期刊池必须排除，避免答辩时被质疑文献口径？`,
    `如果联网检索后核心池文献不足，你愿意换场景，还是保留场景并降低方法复杂度？`,
  ];
}

function riskNotesForTopic(degree, route, pool, scenario, advisor, angle) {
  return {
    sourcePool: `来源池风险：主论据必须优先来自${pool.name}核心池，相邻池只能做背景或交叉支撑。`,
    degreeLevel: `层次风险：${degree.profile.goal} 当前角度是“${angle.name}”，不能扩成完整大课题。`,
    data: `数据风险：${dataRouteFor(route.dataCondition, scenario)} ${angle.dataFocus}`,
    method: `方法风险：${angle.methodRisk || route.methodBoundary}`,
    novelty: `创新风险：${degree.profile.innovation} ${angle.innovationFocus}`,
    defense: `答辩风险：需解释导师偏好“${advisor}”如何落实到题目边界和证据路线。`,
  };
}

function scoreTopic(degree, route, input, index, angle) {
  const hasProfile = Boolean(input.studentProfile?.trim());
  const hasAdvisor = Boolean(input.advisorPreference?.trim());
  const dataScore = route.dataCondition === "unknown" ? 3 : route.dataCondition === "literature-only" ? 3 : 4;
  const technicalDifficulty = degree.key === "doctoral" ? 4 : degree.key === "vocational" && route.method === "optimization" ? 3 : 4;
  const innovationStrength = degree.key === "doctoral" ? 5 : degree.key === "master" ? 4 : 3;
  const focusedAngleBonus = angle?.key === "scope-definition" ? 0 : 1;
  const details = {
    degreeLevelFit: degree.key === "master" || degree.key === "doctoral" ? 4 : 3,
    disciplineFit: 5,
    practicalRelevance: 4,
    literatureGap: index === 0 || focusedAngleBonus ? 4 : 3,
    researchQuestionClarity: 4,
    methodFit: route.method === "qualitative" && route.collectionKey === "engineering" ? 3 : 4,
    dataAvailability: dataScore,
    technicalDifficulty,
    evidenceDesign: route.dataCondition === "literature-only" ? 3 : 4,
    innovationStrength,
    studentProfileFit: hasProfile && hasAdvisor ? 4 : 3,
  };
  const total = Object.values(details).reduce((sum, value) => sum + value, 0);
  return {
    details,
    total,
    label: total >= 47 ? "强候选" : total >= 38 ? "可推进但需收窄" : total >= 28 ? "有风险，需重设边界" : "不建议",
  };
}

function asciiOnly(value) {
  return String(value || "")
    .normalize("NFKD")
    .replace(/[^\x20-\x7e]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function dedupeWords(value) {
  const seen = new Set();
  return asciiOnly(value)
    .split(" ")
    .filter((word) => {
      const key = word.toLowerCase();
      if (!key || seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    })
    .join(" ");
}

function scoreReport(topics) {
  const average = Math.round(topics.reduce((sum, topic) => sum + topic.scores.total, 0) / Math.max(topics.length, 1));
  return {
    total: average,
    label: average >= 47 ? "推荐进入文献核验" : average >= 38 ? "推荐选择一个方向继续收窄" : "需要先收窄范围",
  };
}

function buildMultiLevelVersions(pool, route) {
  return Object.entries(degreeProfiles).map(([key, profile], index) => {
    const degree = { key, level: profile.level, profile };
    const topic = buildTopic(pool, route, degree, index, {});
    return {
      level: profile.level,
      title: topic.title,
      researchQuestion: topic.question,
      literature: profile.literature,
      method: profile.method,
      dataRoute: topic.dataRoute,
      innovation: profile.innovation,
      deliverable: profile.deliverable,
      mainRisk: topic.risks.degreeLevel,
    };
  });
}

export function generateReport(input = {}) {
  const degree = normalizeDegree(input.degreeLevel);
  const routing = routeInput(input);
  const pool = pools[routing.subfieldKey] || pools["mechanical-engineering"];
  const outputKey = outputLabels[input.outputMode] ? input.outputMode : "topic-recommendation";
  const outputMode = {
    key: outputKey,
    label: outputLabels[outputKey],
  };
  const topics = buildCandidateTopics(pool, routing, degree, pool.scenarios, input);
  const score = scoreReport(topics);
  const multiLevelVersions = input.multiLevel ? buildMultiLevelVersions(pool, routing) : [];
  const workflowStages = buildWorkflowStages(outputKey);
  const modePanel = buildModePanel(outputKey, degree, routing, pool);
  const outputPlan = {
    title: modePanel.title,
    note: modePanel.lead,
    items: modePanel.sections.map((section) => ({ title: section.title, detail: section.detail })),
  };

  return {
    generatedAt: new Date().toISOString(),
    degree,
    routing,
    pool,
    outputMode,
    workflowStages,
    modePanel,
    topics,
    outputPlan,
    score,
    multiLevelVersions,
  };
}

export function refineReportForDirections(report, directionSelections = [], input = {}) {
  if (!report) {
    return report;
  }
  const selectedScenarios = directionSelections
    .map((key) => String(key).replace(/^scenario:/, ""))
    .filter((scenario) => report.pool.scenarios.includes(scenario));
  const scenarios = selectedScenarios.length ? selectedScenarios : report.pool.scenarios;
  const topics = buildCandidateTopics(report.pool, report.routing, report.degree, scenarios, input);
  return {
    ...report,
    topics,
    score: scoreReport(topics),
  };
}

function buildCandidateTopics(pool, routing, degree, scenarios, input) {
  const usableScenarios = scenarios.length ? scenarios : pool.scenarios;
  return Array.from({ length: 5 }, (_, index) => {
    const scenario = usableScenarios[index % usableScenarios.length];
    return buildTopic(pool, routing, degree, index, input, {
      scenario,
      angle: angleForRoute(routing, Math.floor(index / usableScenarios.length) + index),
    });
  });
}

function buildWorkflowStages(activeMode) {
  const stages = [
    ["route", "路由", "确认层次、学科、方法传统和证据池"],
    ["candidates", "候选方向", "比较 3-5 个方向的适配度与风险"],
    ["deep-dive", "选择深挖", "学生选择一个方向后继续追问"],
    ["literature", "联网文献", "检索并核验 DOI、来源和开放链接"],
    ["proposal", "开题包", "生成题目、缺口、方法路线和答辩问题"],
  ];
  return stages.map(([key, label, detail], index) => ({
    key,
    label,
    detail,
    active: activeMode === "literature-matrix" ? key === "literature" : index < 2,
  }));
}

function buildModePanel(outputKey, degree, routing, pool) {
  const commonLead = `当前按${degree.level}层次、${routing.methodName}方法传统和${pool.name}证据池组织。`;
  const panels = {
    "topic-recommendation": {
      key: "topic-recommendation",
      title: "选题推荐工作流",
      lead: `${commonLead} 先让学生比较候选方向，再选择一个进入深挖。`,
      sections: [
        { title: "看什么", detail: "层次适配、数据可得、方法边界、创新强度和答辩风险。" },
        { title: "怎么推进", detail: "点击候选卡片的“选择并深挖”，进入文献检索和题目收窄。" },
        { title: "输出结果", detail: "得到候选排序、风险说明和下一轮讨论问题。" },
      ],
    },
    "journal-pool": {
      key: "journal-pool",
      title: "期刊池边界工作流",
      lead: `${commonLead} 重点解释核心池、相邻池和排除池，避免用错文献传统。`,
      sections: [
        { title: "核心池", detail: pool.core.join("；") },
        { title: "相邻池", detail: pool.adjacent.join("；") },
        { title: "排除池", detail: pool.excluded.join("；") },
      ],
    },
    "literature-matrix": {
      key: "literature-matrix",
      title: "文献矩阵工作流",
      lead: `${commonLead} 选择方向后联网检索，保留题名、作者、年份、来源、DOI、开放链接和来源口径。`,
      sections: [
        { title: "检索入口", detail: "用候选方向的英文 query 访问 OpenAlex works。" },
        { title: "筛选字段", detail: "来源池标签、问题、方法、数据、贡献、局限和可转化开题点。" },
        { title: "下载", detail: "导出 Markdown 和 CSV 文献表，便于继续精读。" },
      ],
    },
    "proposal-framework": {
      key: "proposal-framework",
      title: "开题报告框架工作流",
      lead: `${commonLead} 选择方向并核验文献后，生成可写入开题报告的结构。`,
      sections: [
        { title: "题目", detail: "生成中英文题目和难度版本。" },
        { title: "核心内容", detail: "研究背景、问题、文献缺口、方法路线、数据与实验、创新和风险。" },
        { title: "答辩准备", detail: "围绕学科归属、期刊池、数据、基线和简化计划给出问题。" },
      ],
    },
    "ppt-outline": {
      key: "ppt-outline",
      title: "开题 PPT 大纲工作流",
      lead: `${commonLead} 选择方向后组织成答辩叙事和页码结构。`,
      sections: [
        { title: "页码结构", detail: "题目、问题、证据、方法、实验、风险、计划和参考文献。" },
        { title: "每页证据", detail: "标注需要的图表、数据或论文来源。" },
        { title: "讲述顺序", detail: "先讲现实问题，再讲文献缺口，最后讲方法路线和可完成性。" },
      ],
    },
  };
  return panels[outputKey] || panels["topic-recommendation"];
}

export function buildOpenAlexUrl(query, options = {}) {
  const perPage = options.perPage || 10;
  const fromYear = options.fromYear || 2000;
  const params = new URLSearchParams({
    search: query,
    filter: `publication_year:${fromYear}-${options.toYear || new Date().getFullYear()},language:en,type:article`,
    sort: "relevance_score:desc",
    "per-page": String(perPage),
  });
  return `https://api.openalex.org/works?${params.toString()}`;
}

export function normalizeOpenAlexWork(work) {
  const location = work.primary_location || {};
  const source = location.source || {};
  const authors = Array.isArray(work.authorships)
    ? work.authorships
        .slice(0, 6)
        .map((item) => item.author?.display_name)
        .filter(Boolean)
        .join("; ")
    : "";
  return {
    id: work.id || "",
    title: work.title || work.display_name || "Untitled",
    year: work.publication_year || "",
    source: source.display_name || "Unknown source",
    doi: work.doi || "",
    url: location.landing_page_url || work.id || "",
    authors,
    abstract: restoreAbstract(work.abstract_inverted_index),
    concepts: extractConcepts(work),
    type: work.type || "",
    publicationDate: work.publication_date || "",
    citedBy: work.cited_by_count || 0,
    openAccessUrl: work.open_access?.oa_url || location.pdf_url || "",
  };
}

function restoreAbstract(invertedIndex) {
  if (!invertedIndex || typeof invertedIndex !== "object") {
    return "";
  }
  const words = [];
  Object.entries(invertedIndex).forEach(([word, positions]) => {
    if (!Array.isArray(positions)) {
      return;
    }
    positions.forEach((position) => {
      words[position] = word;
    });
  });
  return words.filter(Boolean).join(" ");
}

function extractConcepts(work) {
  const topics = Array.isArray(work.topics) ? work.topics.map((item) => item.display_name || item.topic?.display_name) : [];
  const concepts = Array.isArray(work.concepts) ? work.concepts.map((item) => item.display_name) : [];
  return [...topics, ...concepts].filter(Boolean).slice(0, 8);
}

export function labelLiteratureSource(work, pool) {
  const source = String(work.source || "").toLowerCase();
  const title = String(work.title || "").toLowerCase();
  const haystack = `${source} ${title}`;
  if (matchesAny(haystack, pool.core)) {
    return { label: "核心池", tone: "core", reason: "来源匹配当前学科主证据池。" };
  }
  if (matchesAny(haystack, pool.adjacent)) {
    return { label: "相邻池", tone: "adjacent", reason: "可作背景或交叉证据，不能单独支撑主要创新。" };
  }
  if (matchesAny(haystack, pool.excluded)) {
    return { label: "排除池", tone: "excluded", reason: "与当前方法或学科证据传统不匹配。" };
  }
  return { label: "待核验", tone: "pending", reason: "需要人工核对 DOI、期刊官网或数据库分类。" };
}

function matchesAny(haystack, items) {
  return items.some((item) => {
    const text = String(item).toLowerCase();
    return text && (haystack.includes(text) || text.includes(haystack));
  });
}

export function buildLiteratureMarkdown(works, pool = { core: [], adjacent: [], excluded: [] }) {
  const lines = [
    "# 联网检索文献列表",
    "",
    "| 序号 | 题名 | 年份 | 来源 | 来源口径 | 作者 | DOI/URL | 开放链接 | 引用 |",
    "|---|---|---:|---|---|---|---|---|---:|",
  ];
  works.forEach((work, index) => {
    const sourceFit = labelLiteratureSource(work, pool);
    lines.push(
      `| ${index + 1} | ${escapeTable(work.title)} | ${work.year || ""} | ${escapeTable(work.source)} | ${sourceFit.label} | ${escapeTable(work.authors)} | ${escapeTable(work.doi || work.url)} | ${escapeTable(work.openAccessUrl)} | ${work.citedBy || 0} |`,
    );
  });
  return lines.join("\n");
}

export function buildLiteratureCsv(works, pool = { core: [], adjacent: [], excluded: [] }) {
  const rows = [["序号", "题名", "年份", "来源", "来源口径", "作者", "DOI", "URL", "开放链接", "引用"]];
  works.forEach((work, index) => {
    rows.push([
      index + 1,
      work.title,
      work.year,
      work.source,
      labelLiteratureSource(work, pool).label,
      work.authors,
      work.doi,
      work.url,
      work.openAccessUrl,
      work.citedBy,
    ]);
  });
  return rows.map((row) => row.map(csvCell).join(",")).join("\n");
}

function csvCell(value) {
  const text = String(value ?? "");
  return `"${text.replaceAll('"', '""')}"`;
}

function escapeTable(value) {
  return String(value ?? "").replaceAll("|", "\\|").replace(/\s+/g, " ").trim();
}

export function buildTopicDeepDive(report, topicRank = 1) {
  const topic = report.topics.find((item) => item.rank === Number(topicRank)) || report.topics[0];
  return {
    topic,
    searchPlan: {
      query: topic.searchQuery,
      openAlexQuery: topic.apiSearchQuery || topic.searchQuery,
      openAlexUrl: buildOpenAlexUrl(topic.apiSearchQuery || topic.searchQuery),
      database: "OpenAlex works",
      strategy: "OpenAlex works search 参数，匹配题名、摘要和部分全文",
      filters: ["2000 年以来英文 article", "按相关度排序", "核心期刊池优先人工核验", "保留 DOI/来源/开放链接"],
      poolMustCheck: report.pool.core,
    },
    discussionQuestions: topic.discussionQuestions,
    narrowingOptions: [
      {
        level: "safe",
        title: "降难度版本",
        detail: `保留${topic.scenario}场景，减少方法复杂度，优先做${report.degree.profile.deliverable}`,
      },
      {
        level: "standard",
        title: "标准版本",
        detail: `围绕“${topic.question}”形成一条可答辩的${report.routing.methodName}路线。`,
      },
      {
        level: "advanced",
        title: "升级版本",
        detail: "增加前沿文献对比、跨数据验证或方法贡献，适合更高层次研究。",
      },
    ],
    proposalSections: buildProposalSections(report, topic),
  };
}

function buildProposalSections(report, topic) {
  const outputKey = report.outputMode.key;
  if (outputKey === "ppt-outline") {
    return [
      { title: "P1 题目与研究对象", content: topic.title },
      { title: "P2 为什么值得研究", content: `结合${topic.scenario}说明现实问题和学科价值。` },
      { title: "P3 期刊池与文献口径", content: `核心池：${report.pool.core.slice(0, 5).join("；")}` },
      { title: "P4 方法路线", content: topic.methodRoute },
      { title: "P5 风险与计划", content: topic.risk },
    ];
  }
  if (outputKey === "journal-pool") {
    return [
      { title: "核心池", content: report.pool.core.join("；") },
      { title: "相邻池", content: report.pool.adjacent.join("；") },
      { title: "排除池", content: report.pool.excluded.join("；") },
      { title: "核验路径", content: "优先核验 DOI、期刊官网、OpenAlex/Crossref/WoS/Scopus 元数据。" },
    ];
  }
  if (outputKey === "literature-matrix") {
    return [
      { title: "文献矩阵字段", content: "题名、作者、年份、来源、DOI、问题、方法、数据、贡献、局限、可转化开题点。" },
      { title: "检索入口", content: topic.searchQuery },
      { title: "筛选标准", content: "先看来源是否属于核心池或相邻池，再看问题和方法是否匹配。" },
    ];
  }
  return [
    { title: "研究问题", content: topic.question },
    { title: "文献缺口", content: "需要通过联网检索后，从近年核心池论文的局限、未来工作和方法边界中提炼。" },
    { title: "方法路线", content: topic.methodRoute },
    { title: "数据与实验", content: topic.dataRoute },
    { title: "创新与风险", content: `${topic.innovation} ${topic.risk}` },
  ];
}

export function buildProposalPackage(report, deepDive, works = []) {
  const topic = deepDive.topic;
  const labeledWorks = works.map((work) => ({
    ...work,
    sourceFit: labelLiteratureSource(work, report.pool),
  }));
  const coreWorks = labeledWorks.filter((work) => work.sourceFit.label === "核心池");
  const evidenceBase = coreWorks.length ? coreWorks : labeledWorks;
  const topWork = evidenceBase[0];

  return {
    chineseTitle: topic.title.replace("选题", "研究"),
    englishTitle: topic.englishTitle || `${capitalize(report.routing.methodEnglish)} Research on ${translateScenario(topic.scenario)}`,
    difficultyVersion: topic.levelFit,
    practicalScenario: topic.scenario,
    coreResearchProblem: topic.question,
    secondaryQuestions: topic.discussionQuestions.slice(0, 3),
    literatureGap: [
      topWork
        ? `已检索到的“${topWork.title}”可作为初始证据，但仍需核对其问题、方法和局限是否直接支撑本题。`
        : "当前还没有导入文献，缺口只能作为待核验假设，不能直接写成最终创新。 ",
      `后续应优先读取${report.pool.name}核心池中的近年论文，提取局限、未来工作和方法边界。`,
      `${topic.scenario}方向需要把实际问题、数据条件和${report.routing.methodName}方法路线绑定，否则容易变成泛泛综述。`,
      `${report.degree.level}版本的创新应控制在“${report.degree.profile.innovation}”范围内。`,
    ],
    methodDataRoute: {
      method: topic.methodRoute,
      data: topic.dataRoute,
      baselines: "至少设置一个传统方法、一个近年方法或一个工程实践基线进行对比。",
    },
    innovationClaim: topic.innovation,
    openingReportSections: [
      "研究背景与意义",
      "国内外文献综述",
      "研究问题与目标",
      "研究内容",
      "模型/方法/设计",
      "数据与实验计划",
      "预期创新",
      "进度安排与可行性",
      "参考文献",
    ],
    defenseQuestions: [
      "为什么这个题目属于当前学科和方法传统？",
      "为什么这些期刊或会议是正确的主证据池？",
      "核心文献缺口来自哪几篇已核验论文？",
      "数据来源、样本范围和评价指标是什么？",
      "方法基线或对照组如何设置？",
      "如果数据拿不到，题目如何降难度？",
      "该题目的创新是否匹配当前培养层次？",
    ],
    references: labeledWorks,
  };
}

export function buildLiteratureInsights(report, deepDive, works = []) {
  const topic = deepDive.topic;
  const labeledWorks = works.map((work) => ({
    ...work,
    sourceFit: labelLiteratureSource(work, report.pool),
  }));
  const readings = labeledWorks.map((work) => buildWorkReading(report, topic, work));
  const synthesis = buildReadingSynthesis(report, topic, readings);
  return {
    readings,
    synthesis,
    evidenceStatus: summarizeEvidence(labeledWorks, report.pool),
  };
}

export function buildGapMatrix(report, deepDive, works = []) {
  const topic = deepDive.topic;
  const dimensionProfile = gapDimensionsFor(report.routing.method, topic.scenario);
  const dimensions = dimensionProfile.dimensions;
  const rows = works.map((work, index) => {
    const sourceFit = labelLiteratureSource(work, report.pool);
    const cells = dimensions.map((dimension) => readDimension(work, dimension, topic));
    const threatScore = scoreThreat(cells, work, topic);
    return {
      id: work.id || work.title || `work-${index + 1}`,
      title: work.title || `文献 ${index + 1}`,
      source: work.source || "Unknown source",
      year: work.year || "",
      sourceFit,
      weight: literatureWeight(work, sourceFit),
      threatScore,
      threatLevel: threatScore >= 75 ? "高威胁" : threatScore >= 50 ? "中威胁" : "低威胁",
      cells,
    };
  });
  const coverage = dimensions.map((dimension) => {
    const dimensionCells = rows.map((row) => row.cells.find((cell) => cell.key === dimension.key));
    const coveredCount = dimensionCells.filter((cell) => cell?.status === "covered").length;
    const partialCount = dimensionCells.filter((cell) => cell?.status === "partial").length;
    const missingCount = dimensionCells.filter((cell) => cell?.status === "missing").length;
    return {
      key: dimension.key,
      label: dimension.label,
      coveredCount,
      partialCount,
      missingCount,
      coverageRate: rows.length ? Math.round(((coveredCount + partialCount * 0.5) / rows.length) * 100) : 0,
    };
  });
  return {
    template: dimensionProfile.template,
    scenarioLens: dimensionProfile.scenarioLens,
    topic: topic.title,
    dimensions,
    rows,
    coverage,
    highThreatPapers: rows.filter((row) => row.threatScore >= 50),
    summary: summarizeMatrixCoverage(rows, coverage, topic),
  };
}

export function buildGapOptions(report, deepDive, works = []) {
  const topic = deepDive.topic;
  const insights = buildLiteratureInsights(report, deepDive, works);
  const matrix = buildGapMatrix(report, deepDive, works);
  const readings = insights.readings;
  const representativeTitles = readings
    .slice(0, 3)
    .map((reading) => `《${reading.title}》`)
    .join("、");
  const sourceReason = representativeTitles
    ? `已读 ${readings.length} 篇：${representativeTitles}。这些文献能提供研究背景和方法线索，但还不能直接替代本题的问题定义。`
    : "已选文献数量不足或摘要缺失时，只能生成待核验方向，不能直接作为最终缺口。";
  const synthesis = insights.synthesis;
  const angleName = topic.angle?.name || "当前研究角度";
  const scenario = topic.scenario;
  const method = report.routing.methodName;
  const degreeBoundary = report.degree.profile.innovation;
  const candidates = gapCandidatesForScenario({ report, topic, readings, method, angleName });
  return candidates.map((candidate) => enrichGapCandidate(candidate, { report, topic, matrix, insights, sourceReason, synthesis, degreeBoundary }));
}

function gapCandidatesForScenario({ report, topic, readings, method, angleName }) {
  const scenario = topic.scenario;
  const vehicleRouting = [
    {
      id: "vehicle-scope-gap",
      gapType: "问题边界缺口",
      missingDimension: "配送对象 + 车辆/运载方式 + 路径约束 + 目标函数",
      baseTitle: "车辆路径的具体配送场景与模型边界缺口",
      articleUnderstanding: summarizeReadings(readings, "method"),
      gapLogic:
        "已选文献能够提示 last-mile delivery、truck-drone、parcel locker 或 multiobjective optimization 等方向，但开题不能停在这些名词上。车辆路径题目必须明确研究对象是订单、客户、柜点还是服务区域，运载方式是普通车辆、无人机、混合车队还是电动车，路径约束是否包含时间窗、容量、回仓、电量或服务顺序，目标函数到底优化成本、距离、时间、服务水平、碳排还是多目标权衡。",
      possibleSolution: `把题目收窄为“${angleName}”下的一类可建模场景，例如最后一公里订单配送中混合车队的路径约束与多目标评价；先写出决策变量、约束集合、目标函数和不研究的边界，再决定算法。`,
      requiredData: "Solomon/VRPLIB/EVRP 等公开VRP算例、OpenAlex文献参数、或可解释的仿真订单点与距离矩阵。",
      requiredMethod: `${method}：问题定义、数学模型、启发式/元启发式算法与可复现实验。`,
      noveltyRisk: "如果只把 truck-drone、locker 或 last-mile 作为标题元素，而没有新的约束组合或评价边界，容易被系统综述和已有模型覆盖。",
      nextAction: "补查 vehicle routing problem + exact scenario + constraint/objective，逐篇标出对象、车辆、约束、目标和基线。",
    },
    {
      id: "vehicle-reproducible-data-gap",
      gapType: "数据/复现缺口",
      missingDimension: "VRP/Solomon/仿真算例 + 参数设定 + 可复现实验矩阵",
      baseTitle: "车辆路径的可复现实验与参数边界缺口",
      articleUnderstanding: summarizeReadings(readings, "data"),
      gapLogic:
        "车辆路径开题最容易变成“算法方案展示”，原因是没有把验证条件说清楚。缺口矩阵应检查文献是否说明算例来源、客户规模、距离计算、车辆容量、时间窗、随机种子、参数调优和失败情形；这些要素缺失时，所谓改进很难答辩。",
      possibleSolution:
        "建立小到中等规模的实验矩阵：客户点规模、车辆容量、需求波动、时间窗宽度、是否含无人机/充电约束分别变化；每个场景都保留基线结果、参数表和可复现实验记录。",
      requiredData: "Solomon/VRPLIB公开VRP算例、公开EVRP/last-mile算例，或可说明生成规则的仿真需求点、时间窗和距离矩阵。",
      requiredMethod: "实验设计、敏感性分析、基线对比、消融实验和失败场景解释。",
      noveltyRisk: "若数据来源和参数规则不透明，缺口会退化为主观方案，无法支撑“方法有效”。",
      nextAction: "补查 VRP benchmark、Solomon instances、VRPLIB、simulation experiment、parameter tuning 相关文献。",
    },
    {
      id: "vehicle-baseline-metric-gap",
      gapType: "评价/基线缺口",
      missingDimension: "ALNS/传统VRP/启发式基线 + 成本/时间/服务水平指标",
      baseTitle: "车辆路径的基线比较与评价指标缺口",
      articleUnderstanding: summarizeReadings(readings, "baseline"),
      gapLogic:
        "车辆路径方向不是只求一个更短路径。文献中可能各自使用不同目标和算例，如果开题没有统一基线，就无法说明拟方法相对谁改进、在哪些指标上改进、代价是什么。尤其多目标论文需要讲清 Pareto、权重设定和服务水平之间的取舍。",
      possibleSolution:
        "设置一条简单可复现基线和一条强基线，例如最近邻/节约算法作为传统基线，ALNS、遗传算法或公开论文算法作为强基线；指标至少包含总距离/成本、车辆数、超时率、计算时间和服务水平。",
      requiredData: "同一组Solomon/VRPLIB/仿真VRP实例下的基线运行结果、参数设置和评价指标表。",
      requiredMethod: "公平对照实验、统计比较、敏感性分析和多目标权衡解释。",
      noveltyRisk: "如果只展示拟算法结果，评审会质疑没有证明改进；如果指标太多但没有主次，也会变成不可解释的表格堆砌。",
      nextAction: "补查 ALNS vehicle routing baseline、VRP comparative study、last-mile delivery performance evaluation。",
    },
    {
      id: "vehicle-threat-boundary-gap",
      gapType: "高威胁区分缺口",
      missingDimension: "truck-drone、locker、last-mile 高相似文献的差异化边界",
      baseTitle: "车辆路径与高相似文献的差异化边界缺口",
      articleUnderstanding: summarizeReadings(readings, "application"),
      gapLogic:
        "如果已选文献里出现 truck-drone delivery、smart parcel locker、last-mile routing 或 multiobjective planning，它们不是普通参考文献，而是会直接威胁题目新颖性的对照对象。缺口矩阵要逐篇说明这些文献解决了什么、没有解决什么、本题不重复什么。",
      possibleSolution:
        "把高威胁文献作为反向清单：逐条比较研究对象、车辆类型、约束、目标函数、数据规模、算法和评价指标；本题只保留其中一个未被充分验证且学生能完成的边界。",
      requiredData: "与高威胁论文可比但边界不同的Solomon/VRPLIB/仿真VRP实例，或可复现实验表。",
      requiredMethod: "差异化建模、反向验证、消融实验和边界条件讨论。",
      noveltyRisk: "若无法说清和 truck-drone、locker 或 last-mile 近年论文的区别，应降难度到复现实验、指标比较或边界综述。",
      nextAction: "补查 exact title phrase、highly cited review、recent survey 和 high similarity papers，先排除撞题风险。",
    },
  ].map(buildStructuredGap);

  const scenarioSpecific = {
    电动车充电: [
      ["charging-demand-gap", "需求/排队缺口", "车辆/用户类型 + 到达过程 + 排队等待 + 服务水平", "电动车充电的需求时段与排队服务边界缺口", "充电调度必须具体到用户类型、到达过程、站点容量和等待时间，否则会停留在负荷调度口号。", "用公交/物流车队或私家车充电站作为限定场景，构造分时到达率、服务率、站点容量和等待时间指标。", "公开充电站数据、分时负荷数据、排队仿真数据或可解释的仿真到达过程。", "排队模型、调度优化、仿真验证和敏感性分析。"],
      ["charging-grid-gap", "电网约束缺口", "充电功率 + 电价机制 + 配网峰值 + 目标函数", "电动车充电的电网约束与运营目标缺口", "如果只优化等待时间而不考虑配网峰值或电价，结论难以落地；如果只看电网负荷又忽略用户体验，也不适合运营管理开题。", "把电价、负荷峰值、站点容量和等待时间放到同一实验框架，说明运营目标之间的取舍。", "公开负荷曲线、分时电价、站点容量参数或仿真需求数据。", "多目标优化、需求响应建模和情景仿真。"],
    ],
    库存: [
      ["inventory-demand-gap", "需求过程缺口", "SKU类型 + 需求过程 + 提前期 + 缺货服务水平", "库存控制的需求不确定性与补货边界缺口", "库存题目必须说明需求是稳定、季节、间歇还是随机扰动；否则订货策略无法被验证。", "选择一种SKU和需求过程，明确提前期、缺货成本、服务水平和滚动仿真规则。", "公开销售需求数据、M5类需求数据、企业脱敏数据或可解释的需求仿真序列。", "库存策略比较、滚动仿真、敏感性分析。"],
      ["inventory-policy-gap", "策略比较缺口", "补货策略 + 成本结构 + 多仓网络 + 基线策略", "库存控制的补货策略与成本结构缺口", "只提出一个补货算法不够，必须与经典订货点、base-stock或周期订货策略比较。", "把持有、订购、缺货、运输和碳成本写成可计算指标，比较传统策略和拟策略在不同需求波动下的表现。", "公开需求数据、仿真需求序列或多仓库存算例。", "策略仿真、基线对比和鲁棒性测试。"],
    ],
    选址: [
      ["location-coverage-gap", "覆盖边界缺口", "设施类型 + 需求点 + 服务半径 + 容量/预算", "设施选址的服务覆盖与容量边界缺口", "选址题目不能只说“优化布局”，必须明确设施是什么、服务谁、距离或时间阈值是多少、容量和预算如何限制。", "以充电站、仓库、医院或快递柜等设施为对象，构造候选点、需求点、距离矩阵和容量约束。", "公开GIS/POI数据、人口需求数据、路网距离矩阵或可解释的仿真需求点。", "p-median、set covering、MCLP、多目标优化和情景分析。"],
      ["location-equity-gap", "公平/韧性缺口", "公平覆盖 + 扰动情景 + 网络结构 + 评价指标", "设施选址的公平性与韧性评价缺口", "如果只最小化平均距离，可能牺牲边缘区域；如果考虑韧性，又需要明确扰动情景和服务失败定义。", "在成本/覆盖之外增加最差区域服务、覆盖公平性或扰动后服务保持率，形成可解释的多目标选址问题。", "公开GIS/POI/人口数据、路网矩阵或仿真扰动情景。", "多目标选址、情景鲁棒性分析和公平性指标。"],
    ],
  };

  if (scenario === "车辆路径") {
    return vehicleRouting;
  }
  if (scenarioSpecific[scenario]) {
    return scenarioSpecific[scenario]
      .map(([id, gapType, missingDimension, baseTitle, gapLogic, possibleSolution, requiredData, requiredMethod]) =>
        buildStructuredGap({
          id,
          gapType,
          missingDimension,
          baseTitle,
          articleUnderstanding: summarizeReadings(readings, id.includes("data") || id.includes("demand") ? "data" : "method"),
          gapLogic,
          possibleSolution,
          requiredData,
          requiredMethod,
          noveltyRisk: "若场景变量、数据来源和基线方法没有同时界定，题目容易变成宽泛方案而不是可答辩研究问题。",
          nextAction: `补查 ${scenarioEnglishTerms(scenario)} ${missingDimension} benchmark baseline recent study。`,
        }),
      )
      .concat(genericGapCandidates({ report, topic, readings, method, angleName }).slice(2));
  }
  return genericGapCandidates({ report, topic, readings, method, angleName });
}

function genericGapCandidates({ topic, readings, method, angleName }) {
  const scenario = topic.scenario;
  return [
    buildStructuredGap({
      id: "model-scope-gap",
      gapType: "模型/问题定义缺口",
      missingDimension: "研究对象 + 约束 + 目标函数的组合",
      baseTitle: `${scenario}的具体问题边界与${method}适配缺口`,
      articleUnderstanding: summarizeReadings(readings, "method"),
      gapLogic: `矩阵显示，已有文献可能覆盖了${scenario}、${method}或某些应用场景，但“研究对象—约束条件—评价指标—对照方法”的组合仍需要重新界定。当前候选题不能只说研究${scenario}，必须说明研究哪一类对象、哪些约束、用什么指标判断改进。`,
      possibleSolution: `将题目收窄为一个具体组合：以${scenario}中的${angleName}为主线，限定对象、约束、指标和基线。`,
      requiredData: "公开算例、仿真场景或学生可构造的小规模实例。",
      requiredMethod: method,
      noveltyRisk: "如果只换场景或只换算法名称，创新会被高相似文献削弱。",
      nextAction: "补查高相似模型论文，确认研究对象和约束组合是否已被覆盖。",
    }),
    buildStructuredGap({
      id: "reproducible-data-gap",
      gapType: "数据/复现缺口",
      missingDimension: "数据来源 + 参数设定 + 复现实验",
      baseTitle: `${scenario}的可复现验证缺口`,
      articleUnderstanding: summarizeReadings(readings, "data"),
      gapLogic: `矩阵中如果数据、基线或复现维度覆盖不足，本题就不能直接声称方法有效。开题需要把“怎么验证”作为核心问题之一，而不是只列文献或算法。`,
      possibleSolution: `围绕${topic.dataRoute}构造可复现实验矩阵，明确数据来源、参数范围、评价指标和失败情形。`,
      requiredData: "公开算例、仿真数据、历史需求样本或可解释的参数生成规则。",
      requiredMethod: "实验设计、敏感性分析、基线对比。",
      noveltyRisk: "数据不可得时容易降级为综述或方案展示。",
      nextAction: "补查 benchmark、case study、simulation、dataset 相关论文。",
    }),
    buildStructuredGap({
      id: "baseline-metric-gap",
      gapType: "评价/基线缺口",
      missingDimension: "基线方法 + 评价指标 + 公平比较",
      baseTitle: `${scenario}的基线对比与评价指标缺口`,
      articleUnderstanding: summarizeReadings(readings, "baseline"),
      gapLogic: `矩阵需要展示哪些文献有基线、哪些有指标、哪些只是综述或场景描述。若缺少公平基线，论文难以证明“改进”。`,
      possibleSolution: `建立传统方法、近年方法和拟采用方案的对比框架，指标覆盖效果、成本、稳定性和可实施性。`,
      requiredData: "统一算例或统一参数下的实验记录。",
      requiredMethod: "对照实验、统计比较、敏感性分析。",
      noveltyRisk: "只有单方案展示时，审稿人会质疑贡献不可验证。",
      nextAction: "补查 baseline、comparative study、performance evaluation 相关论文。",
    }),
    buildStructuredGap({
      id: "threat-differentiation-gap",
      gapType: "高威胁区分缺口",
      missingDimension: "与高相似文献的差异化边界",
      baseTitle: `${scenario}的高威胁文献区分缺口`,
      articleUnderstanding: summarizeReadings(readings, "application"),
      gapLogic: `缺口矩阵不能只证明“没人做”，还要检查是否已有文献高度相似。高威胁文献越多，越需要明确本题和它们在对象、约束、数据或指标上的差异。`,
      possibleSolution: `把高威胁文献作为反向验证对象，逐条说明本题不声称什么、只解决什么。`,
      requiredData: "与高威胁文献可比但边界不同的数据或算例。",
      requiredMethod: "差异化建模、消融或反向验证。",
      noveltyRisk: "若不能区分高相似文献，题目应降难度或换角度。",
      nextAction: "补查 exact phrase、高引用综述、近五年相似题名论文。",
    }),
  ];
}

function gapDimensionsFor(methodKey, scenario) {
  const scenarioProfile = scenarioGapProfileFor(scenario);
  if (scenarioProfile) {
    return scenarioProfile;
  }
  return methodGapProfileFor(methodKey);
}

function scenarioGapProfileFor(scenario) {
  const profiles = {
    车辆路径: {
      template: "车辆路径场景矩阵",
      variables: ["配送对象", "车辆/运载方式", "路径约束", "时间窗/容量", "目标函数", "需求不确定性", "基线算例", "落地边界"],
      dimensions: [
        ["delivery_object", "配送对象", "订单、客户、需求点、柜点或服务区域"],
        ["vehicle_mode", "车辆/运载方式", "普通车辆、无人机、混合车队、电动车、机器人等"],
        ["route_constraint", "路径约束", "路径结构、服务顺序、站点访问、开放路径或回仓约束"],
        ["time_window_capacity", "时间窗/容量", "时间窗、容量、电量、服务时长、装载限制"],
        ["objective_function", "目标函数", "成本、距离、时间、碳排、服务水平、公平性或多目标权衡"],
        ["demand_uncertainty", "需求不确定性", "订单需求、旅行时间、服务时间或扰动场景"],
        ["benchmark_baseline", "基线算例", "Solomon、VRPLIB、公开算例、传统VRP、ALNS或元启发式基线"],
        ["reproducible_experiment", "可复现实验", "实例生成、参数表、代码、随机种子和实验矩阵"],
        ["implementation_boundary", "落地边界", "适用场景、不适用场景、业务规则和工程限制"],
      ],
    },
    电动车路径: {
      template: "电动车路径场景矩阵",
      variables: ["配送对象", "车型/电池", "充电策略", "路径约束", "能耗模型", "目标函数", "算例基线"],
      dimensions: [
        ["delivery_object", "配送对象", "订单、客户、站点或服务区域"],
        ["vehicle_mode", "车型/电池", "电动车、电池容量、车队类型和补能方式"],
        ["charging_policy", "充电策略", "充电站选择、充电量、换电、快慢充或排队"],
        ["route_constraint", "路径约束", "路径、服务顺序、站点访问和可行性规则"],
        ["energy_consumption", "能耗模型", "载重、速度、距离、温度或路况对能耗的影响"],
        ["objective_function", "目标函数", "成本、时间、能耗、碳排、服务水平或多目标权衡"],
        ["benchmark_baseline", "算例/基线", "EVRP公开算例、传统VRP、充电启发式或精确方法基线"],
        ["reproducible_experiment", "可复现实验", "参数、算例、充电站配置和随机扰动设定"],
      ],
    },
    电动车充电: {
      template: "电动车充电场景矩阵",
      variables: ["车辆/用户类型", "充电设施", "负荷时段", "排队/等待", "电价机制", "电网约束", "服务公平性"],
      dimensions: [
        ["charging_object", "车辆/用户类型", "私家车、公交、物流车、车队或用户群体"],
        ["facility_capacity", "充电设施/容量", "充电桩数量、功率、站点容量和服务能力"],
        ["temporal_demand", "负荷时段", "到达过程、峰谷时段、预约窗口和需求曲线"],
        ["queue_waiting", "排队/等待", "排队、等待时间、服务水平或拥堵"],
        ["pricing_policy", "电价/激励", "分时电价、需求响应、补贴或预约激励"],
        ["grid_constraint", "电网约束", "配网容量、负荷峰值、电压或储能约束"],
        ["objective_function", "目标函数", "成本、等待时间、负荷平滑、收益、碳排或公平性"],
        ["benchmark_baseline", "基线方案", "先到先服务、规则调度、MILP、仿真或公开案例基线"],
        ["reproducible_experiment", "可复现实验", "到达率、服务率、电价、站点容量和敏感性设置"],
      ],
    },
    库存: {
      template: "库存控制场景矩阵",
      variables: ["物料/SKU", "需求过程", "补货策略", "提前期", "缺货/服务水平", "成本结构", "库存网络"],
      dimensions: [
        ["inventory_object", "物料/SKU", "单品、多品、易腐品、备件或库存层级"],
        ["demand_process", "需求过程", "确定性、随机、季节性、间歇性或促销扰动"],
        ["replenishment_policy", "补货策略", "订货点、周期订货、base-stock、联合补货或动态策略"],
        ["lead_time", "提前期", "固定、随机、供应延迟或生产提前期"],
        ["service_shortage", "缺货/服务水平", "缺货成本、服务水平、延期交付或丢单"],
        ["cost_structure", "成本结构", "持有、订购、缺货、运输、碳排或资金占用成本"],
        ["network_scope", "库存网络", "单仓、多仓、供应链、库存路径或生产库存协同"],
        ["benchmark_baseline", "基线/数据", "经典库存策略、公开需求数据、仿真算例或企业案例"],
        ["reproducible_experiment", "可复现实验", "需求生成、参数范围、滚动仿真和敏感性分析"],
      ],
    },
    选址: {
      template: "设施选址场景矩阵",
      variables: ["设施类型", "需求点", "服务半径", "容量约束", "网络结构", "公平性/韧性", "情景数据"],
      dimensions: [
        ["facility_type", "设施类型", "仓库、充电站、医院、应急点、柜点或生产设施"],
        ["demand_nodes", "需求点", "客户、订单、人口、区域或服务请求"],
        ["coverage_distance", "覆盖/距离", "服务半径、通达时间、距离衰减或覆盖水平"],
        ["capacity_budget", "容量/预算", "建设数量、容量、预算、土地或资源约束"],
        ["network_structure", "网络结构", "道路网络、物流网络、层级网络或多级设施"],
        ["equity_resilience", "公平性/韧性", "公平覆盖、灾害扰动、服务可靠性或风险暴露"],
        ["objective_function", "目标函数", "成本、距离、覆盖率、服务水平、韧性或多目标权衡"],
        ["benchmark_baseline", "基线/案例", "p-median、set covering、MCLP、公开GIS数据或仿真案例"],
        ["reproducible_experiment", "可复现实验", "需求点、候选点、距离矩阵、容量和情景设置"],
      ],
    },
  };
  const profile = profiles[scenario];
  if (!profile) {
    return null;
  }
  return {
    template: profile.template,
    scenarioLens: {
      scenario,
      template: profile.template,
      variables: profile.variables,
    },
    dimensions: profile.dimensions.map(([key, label, description]) => ({ key, label, description })),
  };
}

function methodGapProfileFor(methodKey) {
  const optimization = [
    ["object", "研究对象", "论文实际研究的对象或决策主体"],
    ["method", "方法/模型", "模型、算法或分析框架"],
    ["data", "数据/算例", "数据来源、公开算例、案例或仿真依据"],
    ["constraints", "约束条件", "容量、时间窗、资源、服务范围等限制"],
    ["metrics", "评价指标", "成本、效率、碳排放、服务水平、稳定性等指标"],
    ["scenario", "应用场景", "场景是否与当前选题一致"],
    ["baseline", "基线对比", "是否有可比较基线或对照实验"],
    ["reproducibility", "可复现性", "是否能支撑学生复现实验"],
  ];
  const empirical = [
    ["object", "研究对象/样本", "研究对象、人群、企业或区域"],
    ["method", "识别/分析方法", "模型、识别策略或统计方法"],
    ["data", "数据来源", "数据来源和样本范围"],
    ["variables", "变量机制", "核心变量、机制或干预"],
    ["metrics", "结局/指标", "结局变量或评价指标"],
    ["scenario", "适用情境", "研究情境与边界"],
    ["baseline", "稳健性/对照", "对照组、稳健性或基线"],
    ["reproducibility", "可复现性", "数据和方法是否可复核"],
  ];
  const engineering = [
    ["object", "研究对象", "结构、系统、设备或流程"],
    ["method", "方法/设计", "实验、仿真、设计或算法"],
    ["data", "数据/实验", "实验数据、仿真条件或样机测试"],
    ["constraints", "约束条件", "工况、材料、边界条件或资源限制"],
    ["metrics", "评价指标", "性能、可靠性、效率或成本指标"],
    ["scenario", "应用场景", "应用情境和边界"],
    ["baseline", "对照方案", "对照设计、基线方法或工程标准"],
    ["reproducibility", "可复现性", "实验和仿真是否可复现"],
  ];
  const rows = methodKey === "optimization" ? optimization : methodKey === "clinical-public-health" || methodKey === "empirical" ? empirical : engineering;
  const template = methodKey === "optimization" ? "优化建模类论文矩阵" : methodKey === "clinical-public-health" || methodKey === "empirical" ? "实证研究类论文矩阵" : "工程/实验仿真类论文矩阵";
  return {
    template,
    scenarioLens: {
      scenario: "通用场景",
      template,
      variables: rows.slice(0, 6).map(([, label]) => label),
    },
    dimensions: rows.map(([key, label, description]) => ({ key, label, description })),
  };
}

function readDimension(work, dimension, topic) {
  const text = `${work.title || ""} ${work.abstract || ""} ${(work.concepts || []).join(" ")}`.toLowerCase();
  const detectors = {
    object: [
      ["truck-drone / hybrid delivery", ["truck-drone", "drone", "hybrid"]],
      ["smart parcel locker / service area", ["locker", "parcel", "service area"]],
      ["vehicle routing / last-mile delivery", ["vehicle routing", "last-mile", "last mile", "routing"]],
      [`${topic.scenario}相关对象`, [String(topic.scenario).toLowerCase()]],
    ],
    method: [
      ["systematic literature review", ["systematic literature review", "review", "survey"]],
      ["multiobjective optimization", ["multiobjective", "multi-objective", "pareto"]],
      ["optimization/modeling", ["optimization", "model", "routing problem", "programming"]],
      ["heuristic/metaheuristic algorithm", ["heuristic", "metaheuristic", "algorithm", "search"]],
      ["simulation/experiment", ["simulation", "experiment"]],
    ],
    data: [
      ["benchmark/case/simulation data", ["benchmark", "case", "simulation", "dataset", "instance"]],
      ["survey/literature data", ["review", "survey", "literature"]],
      ["real-world or empirical data", ["real-world", "empirical", "field data"]],
    ],
    constraints: [
      ["capacity/time/resource constraints", ["capacity", "time window", "resource", "constraint"]],
      ["service area/location constraints", ["service area", "location", "facility", "locker"]],
      ["vehicle/drone operational constraints", ["truck", "drone", "battery", "delivery"]],
    ],
    variables: [
      ["mechanism/variable clues", ["variable", "mechanism", "effect", "impact", "factor"]],
    ],
    metrics: [
      ["cost/time/service/emission metrics", ["cost", "time", "service", "emission", "distance", "performance"]],
      ["multiobjective tradeoff", ["multiobjective", "pareto", "tradeoff", "trade-off"]],
    ],
    scenario: [
      ["last-mile logistics scenario", ["last-mile", "last mile", "logistics", "delivery"]],
      ["smart locker scenario", ["smart parcel locker", "locker"]],
      [`${topic.scenario}场景`, [String(topic.scenario).toLowerCase()]],
    ],
    baseline: [
      ["comparative/baseline clues", ["baseline", "comparison", "comparative", "benchmark", "performance"]],
      ["algorithm comparison clues", ["heuristic", "metaheuristic", "algorithm"]],
    ],
    reproducibility: [
      ["reproducible benchmark clues", ["benchmark", "dataset", "instance", "code", "open"]],
      ["review-only evidence", ["review", "survey", "literature"]],
    ],
    delivery_object: [
      ["parcel/customer/order delivery object", ["parcel", "customer", "order", "demand point", "delivery"]],
      ["smart locker/service area object", ["locker", "service area", "facilities"]],
      ["last-mile logistics object", ["last-mile", "last mile", "logistics"]],
    ],
    vehicle_mode: [
      ["truck-drone hybrid vehicle mode", ["truck-drone", "truck", "drone", "hybrid"]],
      ["electric vehicle fleet mode", ["electric vehicle", "evrp", "battery electric"]],
      ["vehicle routing fleet mode", ["vehicle routing", "vehicle", "fleet"]],
    ],
    route_constraint: [
      ["routing/path feasibility constraint", ["routing", "route", "path", "vehicle routing problem"]],
      ["service order or location constraint", ["service area", "location", "facility", "locker"]],
      ["explicit operational constraint", ["constraint", "capacity", "time window"]],
    ],
    time_window_capacity: [
      ["capacity/time-window constraint", ["capacity", "time window", "time-window", "service time"]],
      ["battery or endurance constraint", ["battery", "endurance", "charging"]],
      ["delivery constraint clue", ["constraint", "truck", "drone"]],
    ],
    objective_function: [
      ["multiobjective tradeoff", ["multiobjective", "multi-objective", "pareto", "tradeoff", "trade-off"]],
      ["cost/time/distance/service objective", ["cost", "time", "distance", "service", "performance"]],
      ["emission or sustainability objective", ["emission", "carbon", "sustainable"]],
    ],
    demand_uncertainty: [
      ["uncertainty/stochastic demand", ["uncertain", "uncertainty", "stochastic", "robust", "scenario"]],
      ["demand or travel-time disturbance", ["demand", "travel time", "disruption", "dynamic"]],
    ],
    benchmark_baseline: [
      ["benchmark/open instance baseline", ["benchmark", "instance", "dataset", "vrplib", "solomon"]],
      ["algorithmic baseline", ["baseline", "comparison", "comparative", "heuristic", "metaheuristic", "alns"]],
      ["review-only baseline clue", ["review", "survey", "literature"]],
    ],
    reproducible_experiment: [
      ["reproducible benchmark experiment", ["benchmark", "instance", "dataset", "simulation", "experiment", "code"]],
      ["review-only reproducibility clue", ["review", "survey", "literature"]],
    ],
    implementation_boundary: [
      ["last-mile implementation boundary", ["last-mile", "last mile", "logistics", "delivery"]],
      ["facility/service-area boundary", ["service area", "locker", "facility"]],
      ["real-world boundary", ["real-world", "case study", "application"]],
    ],
    charging_object: [
      ["charging vehicle/user object", ["electric vehicle", "ev", "fleet", "bus", "user"]],
      ["logistics charging object", ["logistics", "delivery", "vehicle"]],
    ],
    facility_capacity: [
      ["charger/facility capacity", ["charger", "charging station", "capacity", "power"]],
      ["station service capacity", ["station", "facility", "service"]],
    ],
    temporal_demand: [
      ["temporal load/demand", ["load", "demand", "arrival", "peak", "time-of-use"]],
      ["reservation window", ["reservation", "time window", "schedule"]],
    ],
    queue_waiting: [
      ["queue/waiting service", ["queue", "waiting", "congestion", "service level"]],
    ],
    pricing_policy: [
      ["pricing/incentive policy", ["price", "pricing", "tariff", "incentive", "demand response"]],
    ],
    grid_constraint: [
      ["grid/distribution constraint", ["grid", "distribution network", "voltage", "load peak", "power constraint"]],
    ],
    inventory_object: [
      ["inventory item/SKU object", ["inventory", "sku", "product", "item", "spare part"]],
    ],
    demand_process: [
      ["demand process", ["demand", "stochastic", "seasonal", "intermittent", "forecast"]],
    ],
    replenishment_policy: [
      ["replenishment policy", ["replenishment", "order-up-to", "base-stock", "ordering", "policy"]],
    ],
    lead_time: [
      ["lead-time uncertainty", ["lead time", "lead-time", "delay", "supplier"]],
    ],
    service_shortage: [
      ["shortage/service level", ["shortage", "stockout", "service level", "backorder", "lost sales"]],
    ],
    cost_structure: [
      ["inventory cost structure", ["holding cost", "ordering cost", "shortage cost", "cost", "carbon"]],
    ],
    network_scope: [
      ["inventory network scope", ["multi-echelon", "warehouse", "supply chain", "network"]],
    ],
    facility_type: [
      ["facility type", ["facility", "warehouse", "charging station", "hospital", "locker"]],
    ],
    demand_nodes: [
      ["demand/customer nodes", ["demand", "customer", "population", "node", "service request"]],
    ],
    coverage_distance: [
      ["coverage/distance", ["coverage", "distance", "travel time", "accessibility", "service radius"]],
    ],
    capacity_budget: [
      ["capacity/budget", ["capacity", "budget", "number of facilities", "resource"]],
    ],
    network_structure: [
      ["network structure", ["network", "road", "transportation", "logistics"]],
    ],
    equity_resilience: [
      ["equity/resilience", ["equity", "fairness", "resilience", "disruption", "reliability"]],
    ],
    charging_policy: [
      ["charging policy", ["charging", "charging station", "recharging", "battery swapping"]],
    ],
    energy_consumption: [
      ["energy consumption model", ["energy consumption", "battery", "load", "speed", "energy"]],
    ],
  };
  const matched = firstMatch(text, detectors[dimension.key] || []);
  if (matched) {
    return {
      key: dimension.key,
      label: dimension.label,
      value: matched.label,
      status: matched.label.includes("review-only") || matched.label.includes("survey") ? "partial" : "covered",
      evidence: matched.evidence,
      basis: work.abstract ? "标题+摘要+主题词" : "标题+来源元数据",
      confidence: work.abstract ? "中" : "低",
    };
  }
  return {
    key: dimension.key,
    label: dimension.label,
    value: "未在题名/摘要元数据中识别",
    status: "missing",
    evidence: "未出现可判断该维度的关键词或摘要线索",
    basis: work.abstract ? "标题+摘要+主题词" : "标题+来源元数据",
    confidence: "低",
  };
}

function firstMatch(text, groups) {
  for (const [label, keywords] of groups) {
    const hit = keywords.find((keyword) => keyword && text.includes(keyword));
    if (hit) {
      return { label, evidence: `命中 “${hit}” 线索` };
    }
  }
  return null;
}

function literatureWeight(work, sourceFit) {
  let weight = 40;
  if (sourceFit.label === "核心池") weight += 25;
  if (sourceFit.label === "相邻池") weight += 12;
  if (Number(work.year) >= new Date().getFullYear() - 5) weight += 12;
  if (Number(work.citedBy) >= 100) weight += 12;
  if (work.abstract) weight += 8;
  return Math.min(weight, 100);
}

function scoreThreat(cells, work, topic) {
  const importantKeys = new Set([
    "object",
    "method",
    "scenario",
    "metrics",
    "constraints",
    "delivery_object",
    "vehicle_mode",
    "route_constraint",
    "time_window_capacity",
    "objective_function",
    "benchmark_baseline",
    "implementation_boundary",
    "charging_object",
    "facility_capacity",
    "temporal_demand",
    "inventory_object",
    "demand_process",
    "replenishment_policy",
    "facility_type",
    "demand_nodes",
    "coverage_distance",
  ]);
  const covered = cells.filter((cell) => importantKeys.has(cell.key) && cell.status === "covered").length;
  const titleHit = String(work.title || "").toLowerCase().includes(String(topic.scenario || "").toLowerCase()) ? 10 : 0;
  return Math.min(covered * 15 + titleHit + Math.min(Number(work.citedBy) || 0, 100) / 5, 100);
}

function summarizeMatrixCoverage(rows, coverage, topic) {
  if (!rows.length) {
    return "尚未选择文献，无法建立矩阵。";
  }
  const weak = coverage.filter((item) => item.coverageRate < 70).map((item) => item.label);
  const strong = coverage.filter((item) => item.coverageRate >= 70).map((item) => item.label);
  return `已建立 ${rows.length} 篇文献 × ${coverage.length} 个维度的矩阵。覆盖较充分：${strong.join("、") || "暂无"}；可能缺口：${weak.join("、") || "暂无明显空白"}。当前主题 ${topic.scenario} 应优先检查弱覆盖维度是否有研究价值和可完成条件。`;
}

function buildStructuredGap(config) {
  return config;
}

function enrichGapCandidate(candidate, context) {
  const { report, topic, matrix, insights, sourceReason, synthesis, degreeBoundary } = context;
  const evidenceChain = buildEvidenceChain(candidate, matrix);
  const scores = scoreGap(candidate, matrix, report);
  const maturity = maturityFor(scores.total);
  const confidenceScore = confidenceFromEvidence(evidenceChain, matrix);
  const highThreat = matrix.highThreatPapers.slice(0, 3).map((row) => ({
    title: row.title,
    threatLevel: row.threatLevel,
    reason: `在${row.cells.filter((cell) => cell.status === "covered").length}个矩阵维度上已有覆盖，需要区分本题边界。`,
  }));
  const scenarioLens = {
    scenario: topic.scenario,
    template: matrix.template,
    keyVariables: matrix.scenarioLens?.variables || matrix.dimensions.slice(0, 6).map((dimension) => dimension.label),
    concreteDimensions: matrix.dimensions.map((dimension) => `${dimension.label}：${dimension.description}`).slice(0, 7),
  };
  const gapName = candidate.baseTitle;
  const standardTitle = `考虑${topic.scenario}${candidate.missingDimension}的${report.routing.methodName}研究`;
  const draft = `研究缺口：${gapName}。${candidate.gapLogic} 本文拟解决：${candidate.possibleSolution} 场景变量包括${scenarioLens.keyVariables.join("、")}。方法上采用${candidate.requiredMethod}，数据上需要${candidate.requiredData}。`;
  return {
    id: candidate.id,
    title: gapName,
    gapName,
    gapType: candidate.gapType,
    missingDimension: candidate.missingDimension,
    evidencePapers: matrix.rows.slice(0, 4).map((row) => row.title),
    evidenceChain,
    whyImportant: `该缺口直接影响开题是否具体：它把${topic.scenario}从泛泛方向转成可检查的对象、方法、数据和评价问题。`,
    possibleSolution: candidate.possibleSolution,
    requiredData: candidate.requiredData,
    requiredMethod: candidate.requiredMethod,
    noveltyRisk: candidate.noveltyRisk,
    feasibilityScore: scores.feasibility,
    confidenceScore,
    nextAction: candidate.nextAction,
    scores,
    maturity,
    scenarioLens,
    basisScope: "标题+OpenAlex摘要+主题词+来源元数据；未阅读全文时不能作强结论",
    highThreat,
    literatureSynthesis: `${sourceReason} ${synthesis} ${insights.evidenceStatus}`,
    articleUnderstanding: candidate.articleUnderstanding,
    gapLogic: candidate.gapLogic,
    improvementPlan: candidate.possibleSolution,
    openingDirection: `开题落点：将“${topic.scenario}”具体化为“${candidate.missingDimension}”上的可验证问题，而不是停留在方向名或文献摘要。`,
    overclaimRisks: overclaimRisksFor(report, candidate),
    reviewerQuestions: reviewerQuestionsFor(candidate),
    nextSearchKeywords: nextSearchKeywordsFor(topic, candidate),
    researchQuestions: researchQuestionsFor(topic, candidate),
    contributions: contributionsFor(candidate),
    topicTitles: {
      broad: `${topic.scenario}中的${candidate.gapType}研究`,
      standard: standardTitle,
      narrow: `${topic.scenario}中${candidate.missingDimension}的可复现${report.routing.methodName}研究`,
    },
    structuredDraft: {
      gapName,
      oneSentenceGap: `${topic.scenario}已有文献覆盖了部分对象或方法，但${candidate.missingDimension}尚需形成可验证的开题问题。`,
      supportPapers: matrix.rows.slice(0, 3).map((row) => row.title),
      existingCoverage: matrix.summary,
      unresolvedPoint: candidate.missingDimension,
      proposedWork: candidate.possibleSolution,
      expectedMethod: candidate.requiredMethod,
      expectedData: candidate.requiredData,
      scenarioVariables: scenarioLens.keyVariables.join("、"),
      concreteDimensions: scenarioLens.concreteDimensions.join("；"),
      risks: candidate.noveltyRisk,
      nextTask: candidate.nextAction,
    },
    draft,
  };
}

function buildEvidenceChain(candidate, matrix) {
  if (!matrix.rows.length) {
    return ["尚未选择文献，无法形成证据链。", "需要先返回文献检索页补选核心文献。"];
  }
  const weakDimension = matrix.coverage.find((item) => candidate.missingDimension.includes(item.label) || item.coverageRate < 60);
  const first = matrix.rows[0];
  const second = matrix.rows[1] || matrix.rows[0];
  const firstCovered = first.cells.filter((cell) => cell.status === "covered").slice(0, 2);
  const secondMissing = second.cells.filter((cell) => cell.status !== "covered").slice(0, 2);
  return [
    `证据1：${first.title} 覆盖了 ${firstCovered.map((cell) => `${cell.label}（${cell.value}）`).join("、") || "部分主题线索"}，但仍需核验其是否覆盖当前拟研究边界。`,
    `证据2：${second.title} 在 ${secondMissing.map((cell) => cell.label).join("、") || weakDimension?.label || "若干矩阵维度"} 上覆盖不足，提示可从这些维度收窄缺口。`,
    `证据3：矩阵中“${weakDimension?.label || candidate.missingDimension}”覆盖率为 ${weakDimension?.coverageRate ?? 0}%，需要判断这是有价值空白还是数据/方法不可得造成的空白。`,
  ];
}

function scoreGap(candidate, matrix, report) {
  const support = Math.min(100, 35 + matrix.rows.length * 8 + matrix.highThreatPapers.length * 5);
  const feasibility = report.routing.dataCondition === "unknown" ? 45 : report.routing.dataCondition === "literature-only" ? 55 : 75;
  const dataAvailability = candidate.requiredData.includes("公开") || candidate.requiredData.includes("仿真") ? 80 : feasibility;
  const methodReadiness = report.routing.method === "optimization" || report.routing.method === "experiment-simulation" ? 78 : 65;
  const novelty = candidate.id === "threat-differentiation-gap" && matrix.highThreatPapers.length ? 58 : 72;
  const publicationPotential = Math.round((support + novelty + methodReadiness) / 3);
  const risk = Math.max(20, 100 - Math.round((feasibility + support) / 2));
  const total = Math.round(novelty * 0.2 + feasibility * 0.2 + support * 0.2 + dataAvailability * 0.15 + methodReadiness * 0.15 + publicationPotential * 0.1 - risk * 0.1);
  return {
    novelty,
    feasibility,
    literatureSupport: support,
    dataAvailability,
    methodReadiness,
    publicationPotential,
    risk,
    total: Math.max(0, Math.min(100, total)),
  };
}

function maturityFor(total) {
  if (total >= 80) return { level: "A", label: "可直接进入开题", reason: "文献支撑、可行性和方法路线较完整。" };
  if (total >= 65) return { level: "B", label: "建议进入开题前补强", reason: "方向可用，但需要补核心文献或实验边界。" };
  if (total >= 50) return { level: "C", label: "需要进一步收窄", reason: "仍存在证据链或可行性不足。" };
  if (total >= 35) return { level: "D", label: "暂不建议直接使用", reason: "研究对象、数据或方法风险较高。" };
  return { level: "E", label: "更像写作建议", reason: "不足以构成研究缺口。" };
}

function confidenceFromEvidence(evidenceChain, matrix) {
  const abstractRows = matrix.rows.filter((row) => row.cells.some((cell) => cell.basis.includes("摘要"))).length;
  return Math.min(95, 35 + evidenceChain.length * 10 + abstractRows * 8);
}

function overclaimRisksFor(report, candidate) {
  return [
    "不能声称首次研究整个领域，只能声称在已界定对象和条件下补足缺口。",
    `不能声称方法全面优于所有方法，除非完成${candidate.requiredMethod}下的公平基线对比。`,
    "不能声称真实场景有效，除非有真实数据或清楚说明仿真条件。",
    `不能越过${report.degree.level}层次声称过大的理论原创。`,
  ];
}

function reviewerQuestionsFor(candidate) {
  return [
    "已有高相似文献是否已经覆盖这个缺口？",
    `为什么选择“${candidate.missingDimension}”作为切入点？`,
    `数据是否足以支撑“${candidate.requiredData}”？`,
    "基线是否公平，评价指标是否可量化？",
    "你的贡献是问题定义、模型方法、实验验证还是应用启示？",
  ];
}

function nextSearchKeywordsFor(topic, candidate) {
  const base = scenarioEnglishTerms(topic.scenario);
  return [
    `${base} ${candidate.gapType} benchmark baseline`,
    `${base} ${candidate.missingDimension} recent review`,
    `${base} high similarity ${candidate.requiredMethod}`,
  ];
}

function researchQuestionsFor(topic, candidate) {
  return [
    `RQ1：在${topic.scenario}中，${candidate.missingDimension}是否构成已有研究尚未充分覆盖的问题边界？`,
    `RQ2：采用${candidate.requiredMethod}能否在${cleanClause(candidate.requiredData)}条件下形成可复现验证？`,
    "RQ3：与已有基线相比，拟研究方案在关键评价指标上是否有稳定改进？",
    "RQ4：该改进在什么约束或应用场景下成立，在哪些场景下不成立？",
  ];
}

function cleanClause(value) {
  return String(value || "").replace(/[。；;,.，、]+$/g, "");
}

function contributionsFor(candidate) {
  return [
    `问题定义贡献：把缺口限定为${candidate.missingDimension}。`,
    `方法/模型贡献：围绕${candidate.requiredMethod}形成可验证路线。`,
    `实验/应用贡献：使用${candidate.requiredData}支撑评价和边界说明。`,
  ];
}

function buildWorkReading(report, topic, work) {
  const sourceFit = work.sourceFit || labelLiteratureSource(work, report.pool);
  const abstract = String(work.abstract || "").trim();
  const conceptText = work.concepts?.length ? `主题词：${work.concepts.slice(0, 5).join("、")}。` : "主题词缺失。";
  const abstractSignal = abstract
    ? `摘要显示：${trimSentence(abstract, 170)}`
    : "OpenAlex 未提供摘要，需要打开 DOI/开放链接核对研究对象、方法和局限。";
  const methodCue = inferCue(work, ["optimization", "routing", "scheduling", "algorithm", "model", "simulation", "review"]);
  const dataCue = inferCue(work, ["benchmark", "case", "simulation", "dataset", "experiment", "survey"]);
  return {
    id: work.id || work.title,
    title: work.title,
    sourceLine: `${work.source} · ${work.year || "年份缺失"} · ${sourceFit.label}`,
    closeReading: `本文可以先按“${sourceFit.label}”处理。${abstractSignal} ${conceptText}`,
    contribution: `对当前方向的贡献：它为${topic.scenario}提供${methodCue || "问题背景或方法参照"}，但贡献是否能支撑本题，仍要看其研究对象和评价指标是否一致。`,
    methodReading: `方法线索：${methodCue || "标题和摘要中尚未出现明确方法词，需要人工核验全文方法部分"}。`,
    dataReading: `数据线索：${dataCue || "暂未看到清晰数据或算例线索，开题时不能直接声称可复现"}。`,
    limitationSignal: `可追问的局限：该文是否只覆盖特定场景、特定算例、特定目标函数或综述性结论；如果是，本题可从边界、数据、基线或指标上继续收窄。`,
    relevance: `与当前选题“${topic.scenario}—${topic.angle?.name || "研究角度"}”的关系：可作为背景或证据，但需要转译成具体研究问题。`,
  };
}

function buildReadingSynthesis(report, topic, readings) {
  if (!readings.length) {
    return `已读 0 篇，暂时无法形成可靠综合判断；应先补齐${report.pool.name}核心池和相邻池文献。`;
  }
  const coreCount = readings.filter((reading) => reading.sourceLine.includes("核心池")).length;
  const abstractCount = readings.filter((reading) => !reading.closeReading.includes("未提供摘要")).length;
  return `已读 ${readings.length} 篇，其中核心池 ${coreCount} 篇、可读摘要 ${abstractCount} 篇。综合看，${topic.scenario}方向需要从“已有方法/应用”推进到“问题边界、数据验证、基线评价和可完成范围”四个开题要素。`;
}

function summarizeReadings(readings, focus) {
  if (!readings.length) {
    return "当前没有可用文献解读，需先返回文献检索页补选文献。";
  }
  const selected = readings.slice(0, 3);
  const field = {
    method: "methodReading",
    data: "dataReading",
    baseline: "contribution",
    application: "limitationSignal",
  }[focus] || "closeReading";
  return selected.map((reading) => `《${reading.title}》：${reading[field]}`).join(" ");
}

function inferCue(work, keywords) {
  const haystack = `${work.title || ""} ${work.abstract || ""} ${(work.concepts || []).join(" ")}`.toLowerCase();
  const hits = keywords.filter((keyword) => haystack.includes(keyword));
  if (!hits.length) {
    return "";
  }
  return `出现 ${hits.slice(0, 4).join("、")} 等线索`;
}

function trimSentence(text, maxLength) {
  const compact = String(text || "").replace(/\s+/g, " ").trim();
  return compact.length > maxLength ? `${compact.slice(0, maxLength)}...` : compact;
}

function summarizeEvidence(works, pool) {
  if (!works.length) {
    return `证据状态：尚未形成稳定文献证据，需优先补齐${pool.name}核心池文献。`;
  }
  const counts = works.reduce(
    (summary, work) => {
      const label = work.sourceFit?.label || "待核验";
      summary[label] = (summary[label] || 0) + 1;
      return summary;
    },
    {},
  );
  const years = works.map((work) => Number(work.year)).filter(Boolean);
  const yearText = years.length ? `${Math.min(...years)}-${Math.max(...years)} 年` : "年份待核验";
  const countText = Object.entries(counts)
    .map(([label, count]) => `${label} ${count} 篇`)
    .join("、");
  return `证据状态：已选 ${works.length} 篇，${countText}，时间覆盖 ${yearText}。`;
}

export function toMarkdown(report, deepDive = null, works = [], proposal = null) {
  const selected = deepDive?.topic;
  const finalProposal = proposal || (deepDive ? buildProposalPackage(report, deepDive, works) : null);
  const lines = [
    "# 研究选题工作台报告",
    "",
    "## 路由卡",
    "",
    `- 培养层次：${report.degree.level}${report.degree.assumed ? "（默认假设）" : ""}`,
    report.degree.warning ? `- 提醒：${report.degree.warning}` : "",
    `- 大学科集合：${report.routing.collectionName}`,
    `- 二级学科：${report.routing.subfieldName}`,
    `- 方法传统：${report.routing.methodName}`,
    `- 数据条件：${report.routing.dataConditionName}`,
    `- 路由理由：${report.routing.rationale}`,
    `- 输出类型：${report.outputMode.label}`,
    "",
    "## 期刊池边界",
    "",
    `- 核心期刊池：${report.pool.core.join("；")}`,
    `- 相邻池：${report.pool.adjacent.join("；")}`,
    `- 排除池：${report.pool.excluded.join("；")}`,
    "",
    "## 当前工作流",
    "",
    `- ${report.modePanel.title}：${report.modePanel.lead}`,
    ...report.modePanel.sections.map((item) => `- ${item.title}：${item.detail}`),
    "",
    "## 候选方向",
    "",
    ...report.topics.map((topic) => [
      `### ${topic.rank}. ${topic.title}`,
      `- 研究问题：${topic.question}`,
      `- 方法路线：${topic.methodRoute}`,
      `- 数据路线：${topic.dataRoute}`,
      `- 创新要求：${topic.innovation}`,
      `- 层次适配度：${topic.levelFit}`,
      `- 评分：${topic.scores.total}（${topic.scores.label}）`,
      `- 主要风险：${topic.risk}`,
      `- 检索 query：${topic.searchQuery}`,
      "",
    ].join("\n")),
  ].filter(Boolean);

  if (selected) {
    lines.push(
      "## 已选方向",
      "",
      `- 题目：${selected.title}`,
      `- English title：${selected.englishTitle}`,
      `- 核心问题：${selected.question}`,
      `- 检索入口：${deepDive.searchPlan.openAlexUrl}`,
      "",
      "## 深挖讨论问题",
      "",
      ...deepDive.discussionQuestions.map((question) => `- ${question}`),
      "",
    );
  }

  if (works.length) {
    lines.push("## 文献列表", "", buildLiteratureMarkdown(works, report.pool), "");
  }

  if (finalProposal) {
    lines.push(
      "## 开题包",
      "",
      `- 中文题目：${finalProposal.chineseTitle}`,
      `- 英文题目：${finalProposal.englishTitle}`,
      `- 难度版本：${finalProposal.difficultyVersion}`,
      `- 核心研究问题：${finalProposal.coreResearchProblem}`,
      "",
      "### 文献缺口",
      "",
      finalProposal.userGapNote ? `- 最终缺口草案：${finalProposal.userGapNote}` : "",
      ...finalProposal.literatureGap.map((item) => `- ${item}`),
      "",
      "### 方法与数据路线",
      "",
      `- 方法：${finalProposal.methodDataRoute.method}`,
      `- 数据：${finalProposal.methodDataRoute.data}`,
      `- 基线：${finalProposal.methodDataRoute.baselines}`,
      "",
      "### 答辩问题",
      "",
      ...finalProposal.defenseQuestions.map((question) => `- ${question}`),
      "",
    );
  }

  if (report.multiLevelVersions.length) {
    lines.push("## 多层次改写", "");
    for (const version of report.multiLevelVersions) {
      lines.push(`- ${version.level}：${version.title}；${version.researchQuestion}；${version.deliverable}；${version.innovation}`);
    }
    lines.push("");
  }

  return lines.join("\n");
}
