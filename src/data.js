export const degreeProfiles = {
  vocational: {
    level: "专科生/高职",
    goal: "解决具体实践问题，形成案例、流程、工具或原型成果。",
    literature: "5-15 个来源，允许教材、标准、行业报告和少量论文。",
    method: "工具使用、案例分析、简单实验、基础统计、流程设计。",
    innovation: "应用改进、流程优化、本地场景价值。",
    deliverable: "毕业设计、实践报告、系统/工具原型、案例方案。",
    topicStyle: "应用实践型",
  },
  undergraduate: {
    level: "本科生",
    goal: "完成一个边界清楚的小型独立研究或设计。",
    literature: "10-25 篇，包含若干近年论文。",
    method: "复现、小实验、简单模型、小数据分析、基础仿真。",
    innovation: "小改进、对比验证、本地化适配。",
    deliverable: "毕业论文、设计项目、实验报告、原型和评价。",
    topicStyle: "基础研究型",
  },
  master: {
    level: "硕士生",
    goal: "形成完整可答辩的研究问题、方法路线和证据设计。",
    literature: "30-60 篇，包含近年高质量中英文文献。",
    method: "明确研究设计、模型/算法/实验/实证路线、基线或稳健性检验。",
    innovation: "场景、方法适配、数据连接、目标约束或证据层面的有限创新。",
    deliverable: "开题报告、硕士论文、可能的论文初稿。",
    topicStyle: "规范开题型",
  },
  doctoral: {
    level: "博士生",
    goal: "提出前沿原创问题，并能发展为连续研究计划。",
    literature: "系统文献图谱，通常 60+ 核心来源并跟踪前沿。",
    method: "理论、机制、方法、系统、纵向实证或多研究设计。",
    innovation: "原创问题、理论、方法、机制、数据集、平台或研究纲领。",
    deliverable: "博士开题、学位论文计划、可发表系列研究。",
    topicStyle: "前沿原创型",
  },
};

export const degreeOptions = [
  ["vocational", "专科生/高职"],
  ["undergraduate", "本科生"],
  ["master", "硕士生"],
  ["doctoral", "博士生"],
];

export const methodOptions = [
  ["optimization", "优化/建模"],
  ["empirical-causal", "实证/因果"],
  ["algorithm-system", "算法/系统"],
  ["experiment-simulation", "实验/仿真"],
  ["clinical-public-health", "临床/公卫"],
  ["wet-lab", "生物实验"],
  ["qualitative", "质性/理论"],
];

export const dataOptions = [
  ["unknown", "暂不确定"],
  ["public-simulation", "公开数据/仿真"],
  ["real-data", "已有真实数据"],
  ["small-experiment", "小规模实验"],
  ["literature-only", "文献综述为主"],
  ["prototype", "系统/原型实现"],
];

export const outputOptions = [
  ["topic-recommendation", "选题推荐"],
  ["journal-pool", "期刊池解释"],
  ["literature-matrix", "文献矩阵"],
  ["proposal-framework", "开题报告框架"],
  ["ppt-outline", "开题 PPT 大纲"],
];

export const collections = {
  management: {
    name: "管理/经济/商科",
    subfields: {
      "or-optimization": "运筹优化/管理科学",
      "supply-chain-operations": "供应链/运营管理",
      "management-empirical": "管理实证/商科研究",
      "transportation-logistics": "交通物流管理",
    },
  },
  engineering: {
    name: "工程技术",
    subfields: {
      "mechanical-engineering": "机械工程",
      "materials-science": "材料科学与工程",
      "civil-engineering": "土木/基础设施",
      "energy-systems": "能源动力/电力系统",
      "biomedical-engineering": "生物医学工程",
      "chemistry-chemical-engineering": "化学/化工",
      "transportation-logistics": "交通运输工程",
    },
  },
  computer: {
    name: "计算机/信息/人工智能",
    subfields: {
      "computer-science": "计算机科学",
      "bioinformatics-computational-biology": "生物信息/计算生物",
      "biomedical-engineering": "医学 AI/医学影像",
    },
  },
  medicine: {
    name: "医学/公共卫生/药学",
    subfields: {
      "clinical-medicine": "临床医学",
      "public-health-epidemiology": "公共卫生/流行病学",
      "pharmacy-pharmacology": "药学/药理",
      "biomedical-engineering": "医学技术/医学影像",
    },
  },
  life: {
    name: "生命科学/生物技术",
    subfields: {
      "molecular-cell-biology": "分子/细胞生物学",
      "bioinformatics-computational-biology": "生物信息/计算生物",
      "environment-earth-agriculture": "生态/农业/环境生物",
    },
  },
  natural: {
    name: "理学基础学科",
    subfields: {
      "mathematics-physics": "数学/物理",
      "chemistry-chemical-engineering": "化学",
      "materials-science": "材料物理/材料化学",
    },
  },
  social: {
    name: "教育/心理/社会科学",
    subfields: {
      "education-psychology-social-science": "教育/心理/社会科学",
      "management-empirical": "管理/公共政策实证",
    },
  },
};

export const pools = {
  "mechanical-engineering": {
    name: "机械工程",
    core: [
      "Journal of Mechanical Design",
      "Journal of Manufacturing Systems",
      "CIRP Annals",
      "Mechanical Systems and Signal Processing",
      "International Journal of Heat and Mass Transfer",
      "Computer Methods in Applied Mechanics and Engineering",
    ],
    adjacent: ["材料科学", "能源系统", "控制/机器人", "计算机视觉/AI"],
    excluded: ["纯管理问卷论文", "无机械验证的通用 AI 论文", "无工程对象的商业案例"],
    scenarios: ["智能制造", "机械结构可靠性", "热流体系统", "设备状态监测", "增材制造"],
  },
  "materials-science": {
    name: "材料科学与工程",
    core: ["Nature Materials", "Advanced Materials", "Acta Materialia", "Materials & Design", "Chemistry of Materials", "Biomaterials"],
    adjacent: ["化学/化工", "机械工程", "生物医学工程"],
    excluded: ["无材料表征的临床论文", "与材料问题无关的算法论文"],
    scenarios: ["功能材料", "复合材料", "能源材料", "生物材料", "计算材料"],
  },
  "civil-engineering": {
    name: "土木/基础设施",
    core: ["Journal of Structural Engineering", "Engineering Structures", "Automation in Construction", "Construction and Building Materials", "Water Resources Research"],
    adjacent: ["交通工程", "环境科学", "工程管理"],
    excluded: ["无基础设施对象的泛政策论文", "无土木数据的 AI 论文"],
    scenarios: ["智慧建造", "结构可靠性", "基础设施运维", "低碳建材", "水资源系统"],
  },
  "biomedical-engineering": {
    name: "生物医学工程",
    core: ["Nature Biomedical Engineering", "IEEE Transactions on Biomedical Engineering", "IEEE Transactions on Medical Imaging", "Medical Image Analysis", "Biomaterials"],
    adjacent: ["临床医学", "计算机视觉", "材料科学", "药学"],
    excluded: ["无医学验证的纯算法论文", "无工程方法的病例报道"],
    scenarios: ["医学影像", "生物传感", "康复工程", "医疗器械", "组织工程"],
  },
  "clinical-medicine": {
    name: "临床医学",
    core: ["New England Journal of Medicine", "The Lancet", "JAMA", "BMJ", "Nature Medicine", "JAMA Network Open"],
    adjacent: ["公共卫生", "药学", "医学影像/医学 AI"],
    excluded: ["工程基准实验替代临床证据", "个案报道支撑普遍疗效"],
    scenarios: ["诊断预测", "治疗效果", "预后模型", "临床路径", "数字健康"],
  },
  "public-health-epidemiology": {
    name: "公共卫生/流行病学",
    core: ["The Lancet Public Health", "American Journal of Epidemiology", "International Journal of Epidemiology", "Epidemiology", "Health Affairs"],
    adjacent: ["临床医学", "社会科学", "环境健康"],
    excluded: ["临床个案替代人群推断", "无数据的政策评论"],
    scenarios: ["疾病负担", "环境健康", "健康政策", "队列研究", "干预评估"],
  },
  "pharmacy-pharmacology": {
    name: "药学/药理",
    core: ["Nature Reviews Drug Discovery", "Clinical Pharmacology & Therapeutics", "Journal of Medicinal Chemistry", "Journal of Controlled Release", "British Journal of Pharmacology"],
    adjacent: ["分子生物学", "临床医学", "材料/递药系统"],
    excluded: ["无验证的分子对接", "无药学问题的材料论文"],
    scenarios: ["药物递送", "药代药效", "毒理", "药物发现", "临床药学"],
  },
  "molecular-cell-biology": {
    name: "分子/细胞生物学",
    core: ["Nature", "Science", "Cell", "Nature Cell Biology", "Molecular Cell", "EMBO Journal", "Nature Genetics"],
    adjacent: ["临床转化", "药理", "生物信息"],
    excluded: ["无验证的计算预测", "无机制的临床相关性"],
    scenarios: ["细胞信号", "基因调控", "免疫机制", "微生物机制", "疾病机制"],
  },
  "bioinformatics-computational-biology": {
    name: "生物信息/计算生物",
    core: ["Nature Methods", "Genome Biology", "Genome Research", "Bioinformatics", "PLOS Computational Biology", "Nucleic Acids Research"],
    adjacent: ["计算机", "分子生物学", "临床医学"],
    excluded: ["无生物解释的纯 ML", "无计算方法的湿实验论文"],
    scenarios: ["单细胞分析", "多组学整合", "生物网络", "疾病分型", "数据库/工具"],
  },
  "chemistry-chemical-engineering": {
    name: "化学/化工",
    core: ["JACS", "Angewandte Chemie", "Chemical Reviews", "ACS Catalysis", "AIChE Journal", "Chemical Engineering Science", "Chemical Engineering Journal"],
    adjacent: ["材料", "能源", "环境"],
    excluded: ["与化学过程无关的优化论文", "无反应/材料证据的泛应用论文"],
    scenarios: ["催化", "分离过程", "反应工程", "绿色化学", "过程系统"],
  },
  "environment-earth-agriculture": {
    name: "环境/地球/农业",
    core: ["Nature Climate Change", "Global Change Biology", "Environmental Science & Technology", "Water Research", "Remote Sensing of Environment", "Field Crops Research"],
    adjacent: ["公共卫生", "土木水利", "生态农业"],
    excluded: ["无环境数据的政策评论", "无验证的遥感结果"],
    scenarios: ["气候影响", "水环境", "遥感监测", "农业生态", "循环经济"],
  },
  "mathematics-physics": {
    name: "数学/物理",
    core: ["Annals of Mathematics", "SIAM Journal on Optimization", "Annals of Statistics", "Physical Review Letters", "Reviews of Modern Physics", "Nature Physics"],
    adjacent: ["计算机", "材料物理", "工程仿真"],
    excluded: ["工程应用替代理论证明", "无同行评审的前沿断言"],
    scenarios: ["优化理论", "统计方法", "数值分析", "凝聚态", "光学/应用物理"],
  },
  "education-psychology-social-science": {
    name: "教育/心理/社会科学",
    core: ["American Educational Research Journal", "Review of Educational Research", "Computers & Education", "Psychological Science", "Journal of Applied Psychology", "American Sociological Review"],
    adjacent: ["公共管理", "信息系统", "教育技术"],
    excluded: ["医学或工程论文替代社会科学构念", "无方法的观点文章"],
    scenarios: ["教育技术", "学习评价", "心理测量", "组织行为", "社会政策"],
  },
  "or-optimization": {
    name: "运筹优化/管理科学",
    core: ["Operations Research", "Management Science", "Mathematics of Operations Research", "INFORMS Journal on Computing", "European Journal of Operational Research", "Computers & Operations Research"],
    adjacent: ["交通物流", "供应链运营", "能源系统", "计算机算法"],
    excluded: ["管理问卷论文作为算法证据", "无决策模型的政策评论"],
    scenarios: ["车辆路径", "调度", "库存", "选址", "鲁棒/随机优化"],
  },
  "supply-chain-operations": {
    name: "供应链/运营管理",
    core: ["MSOM", "Production and Operations Management", "Management Science", "International Journal of Production Economics", "Journal of Operations Management"],
    adjacent: ["运筹优化", "交通物流", "管理实证"],
    excluded: ["组织行为论文替代运营模型", "无运营对象的案例"],
    scenarios: ["韧性供应链", "低碳运营", "库存生产", "平台服务", "全渠道履约"],
  },
  "transportation-logistics": {
    name: "交通物流",
    core: ["Transportation Science", "Transportation Research Part B", "Transportation Research Part C", "Transportation Research Part E", "IEEE Transactions on Intelligent Transportation Systems"],
    adjacent: ["运筹优化", "土木工程", "能源系统"],
    excluded: ["无交通决策模型的城市政策评论", "无验证的通用算法"],
    scenarios: ["城市配送", "网约车调度", "电动车路径", "多式联运", "低碳运输"],
  },
  "energy-systems": {
    name: "能源系统",
    core: ["Applied Energy", "Energy", "IEEE Transactions on Power Systems", "IEEE Transactions on Smart Grid", "IEEE Transactions on Sustainable Energy"],
    adjacent: ["运筹优化", "电气工程", "环境政策"],
    excluded: ["材料能源论文支撑调度问题", "无模型的数据评论"],
    scenarios: ["微电网调度", "储能运行", "需求响应", "电动车充电", "低碳能源管理"],
  },
  "computer-science": {
    name: "计算机科学",
    core: ["NeurIPS/ICML/ICLR", "CVPR/ICCV/ECCV", "ACL/EMNLP", "SIGMOD/VLDB", "USENIX Security/CCS", "ICSE/FSE"],
    adjacent: ["领域应用期刊", "管理信息系统", "医学影像"],
    excluded: ["无技术贡献的管理论文", "无真实评价的工具展示"],
    scenarios: ["机器学习", "NLP", "计算机视觉", "系统安全", "软件工程"],
  },
  "management-empirical": {
    name: "管理实证/商科研究",
    core: ["Academy of Management Journal", "Administrative Science Quarterly", "Strategic Management Journal", "MIS Quarterly", "Information Systems Research", "Marketing Science"],
    adjacent: ["运筹/运营模型", "经济学", "社会科学"],
    excluded: ["OR 算法论文替代理论和识别", "无变量和识别策略的案例"],
    scenarios: ["平台治理", "AI 采纳", "绿色创新", "数字化转型", "消费者行为"],
  },
};
