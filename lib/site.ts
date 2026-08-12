// 站点全局配置
export const site = {
  name: 'mylofi',
  title: 'mylofi',
  description: "I'm Mylo, this is my blog, a tech & life blog.",
  url: 'https://mylofi.fun',
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
