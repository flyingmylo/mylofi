---
title: "记 Git 目录体积过大的优化方案"
summary: "一次优化 Git 历史提交中包含对大文件引用的过程"
date: 2022-12-20T17:03:14+08:00
tags: ['git']
slug: git-slim
toc: true
draft: false
---


Git 版本仓库提交过多，会导致项目根目录下的 `.git` 文件夹体积巨大，原因可能不只是单纯的提交历史过多，而是历史提交中包含有对大文件的引用，即使现在的项目中已经不存在这些文件了，但其引用关联依旧会被 `git` 保留下来。

## 踩坑方案一
 `git filter-branch` 命令可以改写历史中大量的提交，但是它有很多陷阱，而且官方文档中已经不推荐使用它来重写历史了，当然，这个坑是我踩过之后才知道的。

### 识别查询大文件
找到项目根目录下的 `.idx` 文件，路径：

>`.git/objects/pack/pack-************.idx` 

执行：
>`git rev-list --objects --all | grep -f <(git verify-pack -v  .git/objects/pack/******.idx| sort -k 3 -n | cut -f 1 -d " " | tail -10)`

运行结果大致如下：

```text
c0b33abdf3af4f0a4ae82d6243954eeb344432d9 src/components/Emoji/emoji.png
a08b3b0f766d26729cbaf0b7e86212b0ca4a5569 dist/js/2a10361c.async.js
1d26f0da81c885c676badb026367a47183013fb5 dist/js/84ad94bf.async.js
eb07071cdea7e019953a3a6778a4bb6e728ea13d dist/js/4922a65f.async.js
7ddf057a0e26f300137c84cf03dbe088a69da488 dist/js/62f9d99c.async.js
```


### 删除文件
将该文件从历史记录的所有 tree 中移除，执行：

>`git filter-branch --index-filter 'git rm --cached --ignore-unmatch  src/components/Emoji/emoji.png'`

注：需要依次执行该命令去删除这些大文件，可能会有很多 `jpg/js.map/gif` 等类型的文件。

### 推送到远程

```text
rm -rf .git/refs/original/
git reflog expire --expire=now --all
git fsck --full --unreachable 
git repack -A -d
git gc --aggressive --prune=now
git push --force
```

依次执行完以上命令后，此时去检查远程仓库，结果令人诧异，居然...没有...生效...本地确实是清理掉了一部分空间，从 `1.2G` 瘦身到 `600M` 左右，但是推送后并没有作用，于是继续寻找其他方案，结果看到 [stackoverflow](https://stackoverflow.com/questions/2100907/how-to-remove-delete-a-large-file-from-commit-history-in-the-git-repository?answertab=modifieddesc&newreg=adaec4ffc87445179ca5946bf95f0109#tab-top) 上有一个一摸一样的问题，按 `Date modified (newest first)` 排序之后，看到👇
![](1.png " ")
也就是说 2022 了，`git filter-branch` 已经不好使了，推送到远程之后没有任何作用，方案一以失败告状。

## 终极方案二
`git` 官方文档推荐了这个库： [git-filter-pro](https://github.com/newren/git-filter-repo) ，它是一个可以重写 git 历史的多功能 `Python` 脚本，即使现在在项目当中找不到那些历史文件，它依然可以找到它们并进行清理（看来这才是我想要的东西）。

### 安装 git-filter-pro
> `brew install git-filter-repo`

❌ 报错

> `No such file or directory @ rb_sysopen -xxxxx`

✅ 解决方案

>原因是使用国内镜像但是该镜像未完全同步的问题，临时去除镜像即可：
`export HOMEBREW_BOTTLE_DOMAIN=''`




### 如何使用

这里可以搭配此命令来找到那些历史中的大文件，然后逐一清理。
>`git rev-list --objects --all | grep -f <(git verify-pack -v  .git/objects/pack/******.idx| sort -k 3 -n | cut -f 1 -d " " | tail -10)`

假设要清理全部的 `*.jpg` 文件，只需要如下命令，需要注意的是这样也会把项目中现有的所有 `.jpg` 文件清理掉。

```text
git filter-repo --path-glob '*.jpg' --invert-paths

之后，强制推送到远程👇

git push --all --force

git push --tags --force
```

废了一些功夫，效果一级棒👍
![](2.png "清理前")
![](3.png "清理后")


参考链接：

- [Git-工具-重写历史](https://git-scm.com/book/zh/v2/Git-%E5%B7%A5%E5%85%B7-%E9%87%8D%E5%86%99%E5%8E%86%E5%8F%B2)
- [git-filter-repo](https://github.com/newren/git-filter-repo/blob/main/INSTALL.md)
