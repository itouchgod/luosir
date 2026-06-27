# Luosir — Agent 工作指南

## 技术栈

| 层 | 选型 |
|---|---|
| 框架 | Next.js 15 (App Router, Turbopack) |
| 语言 | TypeScript 5，严格模式 |
| 样式 | Tailwind CSS v4 + CSS 变量主题 |
| 字体 | Inter（正文）· Sora（标题），via `next/font/google` |
| 部署 | Vercel |

```
src/
├── app/
│   ├── layout.tsx          # 根布局：字体、主题初始化脚本、BackToTop
│   ├── page.tsx            # 首页（全屏 TabView，无 Footer）
│   ├── go/page.tsx         # /go 外贸导航页
│   └── globals.css         # 全局主题变量 & 工具覆写
├── components/
│   ├── TabView.tsx         # 三选项卡容器（世界时钟 / 全球假日 / 大写转换）
│   ├── WorldClock.tsx      # 世界时钟，带可拖拽时间轴
│   ├── GlobalHolidays.tsx  # 全球假日列表，sticky 头部
│   ├── RmbConverter.tsx    # 人民币大写转换
│   ├── Navbar.tsx          # 顶部导航栏（fixed, z-50）
│   ├── BackToTop.tsx       # 固定右侧回到顶部按钮
│   ├── Footer.tsx          # 页脚（仅非首页使用）
│   ├── ThemeToggle.tsx     # 亮/暗主题切换
│   ├── HeroSection.tsx     # 首屏英雄区（已移出首页）
│   ├── AboutSection.tsx    # 关于部分
│   ├── ProjectsSection.tsx # 项目展示
│   ├── ContactSection.tsx  # 联系方式
│   ├── BrandMark.tsx       # Logo 组件
│   └── icons.tsx           # 公共 SVG 图标
└── data/
    ├── holidays2026.ts     # 2026 年全球 186 个假日数据
    └── go-links.ts         # /go 页导航链接分类数据
```

---

## 主题系统

### 变量定义（globals.css）

```css
/* 暗色（默认）*/
:root {
  --color-primary: #58a6ff;
  --color-background: #0d1117;
  --color-background-secondary: #161b22;
  --color-text-primary: #e6edf3;
  --color-text-secondary: #8b949e;
}

/* 亮色护眼模式 */
html[data-theme="light"] {
  --color-primary: #2d7a50;
  --color-background: #f0f4ec;
  --color-background-secondary: #e2ead8;
  --color-text-primary: #1a2f1e;
  --color-text-secondary: #4d6e58;
}
```

`@theme inline` 块将 CSS 变量桥接到 Tailwind，使 `bg-background`、`text-primary`、`text-muted` 等类可用。

### 主题初始化（无闪）

`layout.tsx` 的 `<head>` 内有一段同步内联脚本，在首次渲染前读取 `localStorage` 并设置 `document.documentElement.dataset.theme`，防止刷新时亮色→暗色闪烁。`<html>` 加 `suppressHydrationWarning`。

### 亮色模式白色透明度覆写

Tailwind 的 `bg-white/[0.04]`、`border-white/10` 等在亮色下用 `globals.css` 里的 `!important` 规则替换为绿调 `rgba(30,80,50,…)`，统一视觉风格。

---

## 首页布局（全屏 TabView）

```tsx
// src/app/page.tsx
<Navbar />                                    {/* fixed, z-50, h-18 */}
<main className="h-screen pt-20 overflow-hidden flex flex-col">
  <TabView />
</main>
{/* 无 Footer：避免 body 超出 100vh 导致整页滚动 */}
```

**关键约束：** 首页不能有 Footer，否则 body 可滚动，导致 TabView 内的浮动选项卡随页面被顶走。

### TabView 结构

```tsx
<div className="flex flex-col h-full">
  {/* 小屏（<lg）：顶部水平胶囊 */}
  <div className="flex lg:hidden justify-center py-4 shrink-0"> … </div>

  {/* 大屏（≥lg）：左侧浮动菜单，fixed left-6 top-24 */}
  <div className="hidden lg:flex fixed left-6 top-24 z-40 …"> … </div>

  {/* 内容区：唯一滚动容器 */}
  <div className="flex-1 overflow-y-auto bg-background">
    {activeTab === "clock"    && <WorldClock />}
    {activeTab === "holidays" && <GlobalHolidays />}
    {activeTab === "rmb"      && <RmbConverter />}
  </div>
</div>
```

**sticky 的正确姿势：** `sticky top-0` 必须在 `overflow-y-auto` 容器内的子元素上使用，才能相对该容器吸顶，而非相对视口。GlobalHolidays 的标题栏即用此方式实现。

---

## 路由

| 路径 | 说明 |
|---|---|
| `/` | 全屏工具首页（WorldClock / GlobalHolidays / RmbConverter） |
| `/go` | 外贸导航页，带左侧固定分类边栏（桌面）和顶部横向滚动分类（移动端）|

---

## 组件规范

### 所有 Tab 内容组件

- 宽度统一 `max-w-4xl mx-auto`
- 组件本身不设高度或滚动，由 TabView 的 `flex-1 overflow-y-auto` 容器控制滚动

### GlobalHolidays

- 用 `sticky top-0 z-10 bg-background` 固定标题 + 分类 Tab + 地区筛选芯片
- 假日列表在 sticky 头部下方正常流动
- 组件 mount 后自动 `scrollIntoView` 到当前月份

### WorldClock

- 时间轴用 CSS `linear-gradient` 实现色段（灰=休息，黄=过渡，绿/蓝=工作）
- 浮动时间气泡：`bg-foreground text-background` 反色，带 CSS border 三角 caret
- 支持拖拽查看任意时刻，"回到实时"按钮 `bg-primary text-background`

### BackToTop

- `fixed top-1/2 right-6 -translate-y-1/2 z-50`
- 下滑 300px 后从右侧滑入，`opacity-0 translate-x-16` → `opacity-100 translate-x-0`

---

## 样式约定

- **不要**直接写 `text-amber-*` 等具体颜色，改用 `text-primary`、`text-muted`、`text-foreground`，保证双主题兼容
- 半透明背景优先用 `bg-white/[0.04]`（暗色），globals.css 会自动覆写亮色值
- 渐变背景在 `body` 上（radial-gradient），内容组件不重复加渐变
- 字体：正文 `font-sans`（Inter），标题 `font-heading`（Sora）

---

## 常见坑

| 问题 | 原因 | 解法 |
|---|---|---|
| 首页整体可滚动 | page.tsx 含 `<Footer />`，body 超出 100vh | 首页不加 Footer |
| 亮色刷新闪黑 | ThemeToggle 是 client 组件，useEffect 才读 localStorage | layout.tsx head 内加同步内联脚本 |
| sticky 失效 | 无近祖滚动容器，或祖先设了 `overflow: hidden` | 确认 sticky 元素的最近滚动祖先是 `overflow-y-auto` |
| 亮色下 white/opacity 色差 | Tailwind 生成纯白透明，亮色下偏白 | globals.css 用 `!important` 替换为绿调 rgba |
| 颜色泄漏（如 amber） | lint/格式化工具自动修改了 `text-primary` | 检查并还原为 `text-primary`、`border-primary/20` |
