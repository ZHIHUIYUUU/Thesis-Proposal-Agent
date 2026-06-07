# 研究选题工作台

面向毕业论文或开题报告的选题辅助工作台，从需求采集、学科路由、候选方向、方向深挖、联网文献检索、缺口矩阵到开题包导出，形成一套可交互的选题流程。

## 模式说明

- 默认模式：使用本地规则引擎、文献检索和缺口矩阵，不需要 API Key。
- 智能模式：在侧边栏 `API 配置` 中填入自己的 API Key 后，可在缺口矩阵页点击 `AI 深度分析`，让模型基于已选文献、矩阵维度和候选方向生成更具体的改进方向。
- 支持入口：OpenAI / Codex、Claude / Anthropic、DeepSeek、小米 / MiLM、自定义 OpenAI 兼容接口。
- 安全提示：API Key 只保存在当前浏览器的 localStorage 中。这个静态站点没有后端代理，不建议在公共或共享电脑保存真实密钥。

## 本地运行

```bash
npm ci
npm run dev
```

## 验证

```bash
npm test
npm run build
```

## GitHub Pages 部署

当前仓库使用手动 `docs/` 目录部署，避免依赖 GitHub Actions。

```bash
npm run build:pages
```

把生成的 `docs/` 上传到 GitHub 后，在仓库 `Settings -> Pages` 中设置：

- Source: `Deploy from a branch`
- Branch: `main`
- Folder: `/docs`
