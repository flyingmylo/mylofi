---
title: 这个博客的技术架构
date: 2025-01-15
summary: 记录博客的完整技术方案：Next.js 静态导出、Pagefind 搜索、Giscus 评论，以及 Cloudflare Pages 部署。
tags: [技术, 建站, Next.js]
---

这个博客是**纯静态站点**：构建时把 Markdown 渲染成 HTML，产物扔到 Cloudflare Pages 的全球 CDN 上。没有任何服务端逻辑。

## 架构一览

```
Markdown (content/posts/)
    ↓ 构建时
Next.js output:'export' + remark/rehype 渲染管线
    ↓
out/ 目录（纯 HTML/CSS/JS）
    ↓
Pagefind 建立全文搜索索引
    ↓
Cloudflare Pages（自动部署 + 自定义域名 + SSL）
```

## 内容渲染管线

文章解析用的是 unified 生态，每一步都可插拔：

```ts
unified()
  .use(remarkParse)          // Markdown → AST
  .use(remarkGfm)            // 表格、删除线、任务列表
  .use(remarkRehype)         // Markdown AST → HTML AST
  .use(rehypePrettyCode)     // Shiki 代码高亮（双主题）
  .use(rehypeSlug)           // 标题锚点
  .use(rehypeStringify)      // AST → HTML 字符串
```

## 深色模式

`next-themes` 负责切换 `<html>` 上的 `.dark` class，Tailwind 的 `dark:` 变体接管样式，代码高亮则用 Shiki 的双主题变量跟随切换：

```css
.dark .shiki,
.dark .shiki span {
  color: var(--shiki-dark) !important;
}
```

## 搜索与评论

- **搜索**：Pagefind 在构建后对 `out/` 目录建索引，前端加载一个 10KB 左右的 wasm，搜索完全在浏览器内完成，无需后端。
- **评论**：Giscus 把每篇文章的评论映射到 GitHub Discussions，数据存在 GitHub 上，免费且无广告。

两个功能都保持了站点的纯静态属性，这是这个架构最满意的地方。
