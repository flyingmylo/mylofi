---
title: 你好，新博客
date: 2025-01-01
summary: 从 Hugo 主题逃离之后，我用 Next.js 给自己搭了一个博客。这是第一篇文章。
tags: [随笔, 建站]
---

这是新博客的第一篇文章。

## 为什么自建

用 Hugo 的时候，主题总是差那么一点意思：配色不喜欢、排版不顺眼、想改又要在 Go template 里翻半天。与其迁就别人的审美，不如自己写一个。

现在的技术栈：

- **Next.js + React + TypeScript**：熟悉的生态，想加什么组件就加什么
- **Tailwind CSS**：样式完全自己掌控
- **Cloudflare Pages**：免费、全球 CDN、push 即部署

## 写作流程

和 Hugo 时代一样：在 `content/posts/` 里新建一个 Markdown 文件，写上 frontmatter，`git push`，几分钟后文章就上线了。

```bash
git add content/posts/hello-world.md
git commit -m "new post: hello world"
git push
```

工具应该服务于写作，而不是反过来。希望这次能长久地写下去。
