# 研究选题工作台

面向毕业论文或开题报告的选题辅助工作台，从需求采集、学科路由、候选方向、方向深挖、联网文献检索、缺口矩阵到开题包导出，形成一套可交互的选题流程。

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

仓库推送到 `main` 分支后，`.github/workflows/deploy.yml` 会自动执行测试、构建并发布 `dist` 到 GitHub Pages。

首次使用时，在 GitHub 仓库的 `Settings -> Pages` 中把 Source 设置为 `GitHub Actions`。
