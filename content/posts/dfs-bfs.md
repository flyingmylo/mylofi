---
title: "算法之深度优先搜索与广度优先搜索"
summary: "深度优先与广度优先的概念和区别"
date: 2022-07-07T21:27:33+08:00
tags: ["算法"]
showTags: true
slug: dfs-bfs
draft: false
toc: true
---

### 深度优先搜索 DFS


深度优先搜索（Depth-First-Search）和广度优先搜索（Breadth-First-Search）都是一种用来遍历或者搜索树或图这种数据结构的算法。以树为例，深度优先搜索的过程会从根节点出发，尽可能深地遍历每个子节点，而且每个节点只能访问一次，是一个不断回溯的过程。

实现方法大致如下：
  1. 首先将根节点放入栈中
  2. 从栈中取出第一个节点，并检验它是否为目标
     1. 如果找到目标，则结束搜索并返回结果
     2. 否则将它某一个尚未检验过的直接子节点放入栈中
  3. 重复步骤 2
  4. 如果不存在未检测过的直接子节点
     1. 将上一级节点放入栈中
     2. 重复步骤 2
  5. 重复步骤 4
  6. 若栈为空，表示整张图都已检查过并且没有要查找的目标，结束搜索

另外需要我们了解的一种数据结构：栈。

我们可以把盏比喻成一包手帕纸，每张纸巾都是按序一张一张放进去的，使用的时候是一张一张从最上边开始拿出来的。所以栈是一种后进先出（Last In First Out, LIFO）的数据结构。

![](dfs.png?width=50"深度优先搜索" )

示例：通过 DFS 实现复制对象的复制
```javascript
const copyDFS = function(obj) {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }
  const copyObj = Array.isArray(obj) ? [] : {};
  for (const key in obj) {
    copyObj[key] = copyDFS(obj[key]);
  }
  return copyObj;
}
```
示例：获取对象的所有键
```javascript
const obj = { a: 1, b: 2, c: { d: 4, e: 5} }

function dfs(obj, keys = []) {
  Object.entries(obj).forEach(([k, v]) => {
    keys.push(k)
    if (typeof v === 'object') dfs(v, keys)
    else return
  })

  return keys
}
// ['a', 'b', 'c', 'd', 'e', 'f']
console.log(dfs(obj))
```

### 广度优先搜索 BFS

广度优先搜索（Breadth-First-Search）也会沿着树的宽度进行遍历，通常用来解决两种问题：
- 从节点 A 出发，有前往节点 B 的路径吗？
- 从节点 A 出发，前往节点 B 的哪条路径最短？

![](bfs.png?width=50"广度优先搜索" )

举个例子，假如今天的你心血来潮突然想看《假面骑士》，当你打开腾讯视频的时候发现只有会员才能看，真扫兴（胜利的法则变得不太确定）。这时你又不想自费充会员，所以就想找朋友借个用用。于是去挨个去问你的朋友，如果你的朋友里都没有会员，那就必须要找你朋友的朋友，别忘了你的目标是找来一个会员账号。首先，将你的朋友列入一个名单中依次查找，如果你的朋友李白没有会员，其次再将李白的朋友也加入到名单中，所以为了这个目标，你需要在你的朋友、朋友的朋友中查找，这种方式会搜遍你的整个人际关系网络，直到借来一个会员账号（胜利的法则已经决定✌️）或者一个会员都没有为止，这个过程就是广度优先搜索算法。

回到刚才的两个问题：
- 从节点 A 出发，有前往节点 B 的路径吗？（在你的人际关系网中，有会员吗？）
- 从节点 A 出发，前往节点 B 的哪条路径最短？（哪个拥有会员的朋友和你的关系最近？）

第一个问题已经在上例中说明；第二个问题就是怎么找到关系最近的朋友。

假设你的朋友是一层关系，朋友的朋友是二层关系。很显然，一层关系优于二层关系，二层关系优于三层关系，以此类推。需要注意的是，**一层关系是在二层关系之前加入名单的**，这就意味着我们依次对名单**按照顺序**进行查找出来的结果一定是关系最近的朋友，所以，广度优先搜索不仅查找 A 到 B 的路径，而且找到的是**最短路径**。

对于 BFS 算法，我们还需要了解另外一个数据结构：队列。

队列的工作原理和现实生活中的队列一样，假设你和朋友一起在排队买咖啡，如果你排在他前面，那就是你先买到咖啡。队列只支持两种操作：入队和出队，是一种先进先出（First In First Out, FIFO）的数据结构，

至此，我们可以使用队列来表示这份朋友名单，因为先加入的朋友（一层关系）将会先出队列并而且先被检查。

实现方法大致如下：
1. 首先将根节点放入队列中
2. 从队列中取出第一个节点，并检查它是否为目标
   1. 如果找到目标，则结束搜索并返回结果
   2. 否则将它所有尚未检查过的子节点加入队列中
3. 若队列为空，表示整张图都检查过了，即没有查询的目标
4. 重复步骤 2

示例：通过 DFS 实现对象深拷贝：
```javascript
function deepCopy(obj) {
  const queue = [obj]
  const newObject = {}

  while (queue.length > 0) {
    const currentObj = queue.shift()

    Object.keys(currentObj).forEach((key) => {
      const value = currentObj[key]

      if (typeof value === 'object' && value !== null) {
        queue.push(value)
        newObject[key] = Array.isArray(value) ? [] : {}
      } else {
        newObject[key] = value
      }
    })
  }

  return newObject
}

const obj = { a: 1, b: 2 }
const copy = deepCopy(obj)
copy.a = 3
console.log(copy) // {a: 3, b: 2}
console.log(copy === obj) // false

```
