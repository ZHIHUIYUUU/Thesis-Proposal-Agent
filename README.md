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

当前仓库使用手动 `docs/` 目录部署，避免依赖 GitHub Actions。

```bash
npm run build:pages
```

把生成的 `docs/` 上传到 GitHub 后，在仓库 `Settings -> Pages` 中设置：

- Source: `Deploy from a branch`
- Branch: `main`
- Folder: `/docs`
