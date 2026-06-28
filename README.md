# Luo Sir 个人主页

个人工具与导航站，部署于 Vercel。

## 功能

- **世界时钟** — 可拖拽时间轴，查看全球主要城市当前时间与工作状态
- **全球假日** — 2026 年 186 个全球假日，支持按地区 / 宗教筛选
- **人民币大写** — 小写金额转规范中文大写及英文金额，适用于票据合同
- **外贸导航**（`/go`）— 外贸相关工具链接分类导航

## 技术

Next.js 15 · React 19 · TypeScript · Tailwind CSS v4 · Vercel

## 品牌资源

- 页面 Logo：`public/brand/logo-light.png`，透明底，浅色 / 暗色主题共用
- 浏览器图标：`src/app/icon.png` 与 `src/app/favicon.ico`
- 分享预览图：`public/og-image.png`

Logo 更新规范与组件约束见 [AGENTS.md](./AGENTS.md)。

## 开发

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm run lint
```

详细架构与约定见 [AGENTS.md](./AGENTS.md)。
