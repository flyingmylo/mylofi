# My Blog

用 Next.js 自建、部署在 Cloudflare Pages 上的静态博客。

## 技术栈

- **框架**：Next.js 15（App Router，`output: 'export'` 纯静态导出）+ React 19 + TypeScript
- **样式**：Tailwind CSS v4 + Typography 插件，深色模式由 next-themes 驱动
- **内容**：`content/posts/*.md`（gray-matter + remark/rehype 管线，Shiki 双主题代码高亮）
- **搜索**：Pagefind（构建时对 `out/` 建索引，纯浏览器端搜索）
- **评论**：Giscus（GitHub Discussions），在 `lib/site.ts` 填配置后启用
- **SEO**：Metadata API + 自动 sitemap.xml / robots.txt / feed.xml（RSS）

## 日常写作

```bash
# 1. 新建文章（frontmatter 字段：title / date / summary / tags / draft）
vim content/posts/my-new-post.md

# 2. 本地预览
npm run dev          # http://localhost:3000

# 3. 发布
git add . && git commit -m "new post" && git push
```

> 搜索索引在 `npm run build` 时生成，开发环境下搜索页不可用属正常现象。

## 游乐场（/playground）

自用小工具集，工具在 `lib/playground.ts` 登记，路由挂在 `app/playground/` 下。

- **Englishpod**（`/playground/englishpod/`）：EnglishPod 播客 365 期档案，
  对话与词汇要点在 `content/englishpod/md/`（构建时由 `lib/englishpod.ts` 解析），
  播客全文 txt 在 `public/englishpod/txt/`（页面按需 fetch，不进包）。
  365 期按 50 期一组分页浏览（`/playground/englishpod/g/[2-8]/`）。

## 构建与部署

```bash
npm run build        # 静态导出到 out/ + 生成 Pagefind 索引
npm run preview      # 本地预览构建产物
```

### Cloudflare Pages 部署

1. 把仓库 push 到 GitHub
2. Cloudflare Dashboard → Pages → 连接 Git 仓库
3. 构建配置：
   - Framework preset: **Next.js (Static HTML Export)** 或 None
   - Build command: `npm run build`
   - Output directory: `out`
4. 部署完成后：Pages 项目 → **Custom domains** → 绑定你的域名
   （域名 DNS 需托管在 Cloudflare，自动签发 SSL）

### 部署前检查清单

- [ ] `lib/site.ts`：修改 `url` 为真实域名、`name` / `description` / `author`
- [ ] `lib/site.ts`：填写 Giscus 配置（向导：https://giscus.app/zh-CN）
- [ ] `app/about/page.tsx`：写自己的介绍
- [ ] 旧站 URL 若有变化，在 `public/_redirects` 配 301（Hugo 旧链接 → 新链接）

## 从 Hugo 迁移

1. 把 Hugo `content/posts/*.md` 拷入 `content/posts/`
2. frontmatter 字段映射：`description` → `summary`（其余基本一致）
3. 替换 Hugo shortcode 为标准 Markdown
4. Hugo `static/` → `public/`
