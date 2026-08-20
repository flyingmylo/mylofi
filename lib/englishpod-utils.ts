/** 期号转 4 位 slug（纯函数，服务端与客户端组件共用；勿引入 node 依赖） */
export function episodeSlug(no: number): string {
  return String(no).padStart(4, '0')
}
