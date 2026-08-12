---
title: 从 Hugo 迁移到新博客的清单
date: 2025-02-01
summary: 迁移存量文章时需要注意的事项：frontmatter 字段映射、shortcode 替换、URL 兼容与 301 跳转。
tags: [技术, Hugo]
draft: true
---

> 这是一篇草稿（`draft: true`），生产构建时不会输出，开发环境可见。

迁移存量文章的检查清单：

## 1. Frontmatter 字段映射

| Hugo | 新博客 | 说明 |
|---|---|---|
| `title` | `title` | 一致 |
| `date` | `date` | 一致 |
| `description` | `summary` | 字段名不同，需要批量替换 |
| `tags` | `tags` | 一致 |
| `draft` | `draft` | 一致 |

## 2. Shortcode 替换

Hugo 的 shortcode 需要替换成标准 Markdown 或 MDX 组件：

```
{{< figure src="/img/a.png" alt="示例" >}}
```

替换为：

```md
![示例](/img/a.png)
```

## 3. URL 兼容

- 保持文件名（slug）不变，URL 就不变
- 结构变化时用 Cloudflare Pages 的 `_redirects` 文件配 301

## 4. 图片

Hugo 的 `static/` 目录内容直接拷到 `public/`。
