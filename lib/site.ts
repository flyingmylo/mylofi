// 站点全局配置 —— 部署前请修改 url 和 giscus
export const site = {
  name: 'My Blog',
  title: 'My Blog',
  description: '一个用 Next.js 自建、部署在 Cloudflare Pages 上的博客',
  // TODO: 部署前改成你的真实域名，例如 'https://blog.yourdomain.com'
  url: 'https://blog.example.com',
  author: 'Mylo',
  locale: 'zh-CN',
  // Giscus 评论（基于 GitHub Discussions）
  // 配置方法：https://giscus.app/zh-CN ，填写后评论自动启用
  giscus: {
    repo: '' as `${string}/${string}` | '',
    repoId: '',
    category: 'Announcements',
    categoryId: '',
  },
}
