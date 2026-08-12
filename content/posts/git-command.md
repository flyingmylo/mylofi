---
title: "Git 常用命令"
summary: "好记性不如烂笔头，记录最常用的几个 git 命令"
date: 2019-07-18T15:30:06+08:00
tags: ['git']
showTags: true
slug: git-command
draft: false
---


新建本地分支并切换到新分支
```
git checkout -b feat/abc
```
本地分支推送到远程（x）
```
git push origin feat/abc:feat/abc
```
设置跟踪（y）
```
git branch --set-upstream-to=origin/feat/abc feat/abc
```

举例：如果想要把新建的 abc 本地分支推送到远程并建立跟踪，需要使用以上 x 和 y 两条命令，也可以使用以下一条命令：
```
git push -u origin feat/abc
```

删除本地分支
```
git branch -d abc
```

如果一个分支还没有被推送或合并，强制删除使用 -D
```
git branch -D abc
```

删除远程分支
```
git push origin --delete abc
或 
git push origin :abc
```




