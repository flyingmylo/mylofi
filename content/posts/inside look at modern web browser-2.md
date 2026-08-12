---
title: "深入了解现代网络浏览器（2/4）【译】"
summary: "一个通过翻译的方式学习英语的尝试计划"
date: 2022-05-28T17:27:11+08:00
tags: ['翻译']
slug: inside look at modern web browser-2
draft: false
toc: true
autonumber: true
---

## 导航栏里都发生了些什么
这是 4 篇博客系列中的第 2 篇，来窥探 Chrome 的内部工作原理。在[上一篇文章](https://flyingmylo.com/posts/inside-look-at-modern-web-browser-1/)中，我们探讨了进程和线程在处理浏览器不同模块时的区别。本篇文章我们将会更深层次地挖掘线程和进程为了渲染一个网站是如何进行有序通信的。

我们来看一个浏览器里简单的例子：在浏览器中输入一个 URL 地址，接着浏览器会从网络中请求数据然后渲染出一个页面。在这篇文章中，我们将会聚焦于用户请求一个站点随后浏览器准备渲染页面这一部分，也就是我们熟知的导航。

## 始于一个浏览器进程
正如我们已经在 [上篇中阐述过的 GPU/CPU/内存/多进程架构](https://flyingmylo.com/posts/inside-look-at-modern-web-browser-1/#%E4%B8%AD%E5%A4%AE%E5%A4%84%E7%90%86%E5%99%A8%E5%9B%BE%E5%BD%A2%E5%A4%84%E7%90%86%E5%99%A8%E5%86%85%E5%AD%98%E5%A4%9A%E8%BF%9B%E7%A8%8B%E6%9E%B6%E6%9E%84) 一样，浏览器进程处理了其每个标签页的所有任务。浏览器进程拥有像 UI 线程这样绘制按钮或者输入框的进程，还有网络线程从网络中接收数据，存储线程控制文件的访问等等这些进程。当我们在地址栏中输入一个 URL 地址时，我们的输入就会被浏览器进程里的 UI 线程处理。
![](01.png "图1：上方是浏览器的用户界面，下方则是浏览器进程的示意图，其中包含了用户界面、网络和存储线程。")

## 一个简单的导航
### 第一步：处理输入
当用户开始在地址栏中输入的时候，UI 线程首要询问的是“这是一个搜索关键词还是一个地址咧？”。在 Chrome 中，地址栏同样是一个搜索框，所以 UI 线程需要解析并且决定是要把输入发送给搜索引擎，还是直接显示这个你请求的网站。
![](02.png "图2：UI 线程询问此输入是搜索关键字还是一个地址")

### 第二步：开始导航
当用户敲了回车键，UI 线程会初始化一个网络命令去获取网站内容，此时在标签页的左上角会显示一个转圈圈的加载器 ，随后网络线程会通过合适的协议，比如 DNS 查询为该请求建立 TLS 链接。
![](03.png "图3：UI 线程与网络线程通信，以导航到 mysite.com 站点")
此时网络进程可能会收到一个服务器的重定向头信息，比如 HTTP 301 ，这种情况下，网络线程就会和 UI 线程对于服务器正在请求重定向进行通信，然后向另一个 URL 发起请求。

### 第三步：读取响应
当响应正文开始返回的时候，网络线程就会在必要时查看字节流的前几个字节，响应头中的 Content-Type 字段说明了数据的类型，但是由于它可能会出错或是不准确，所以此处会有一个 [MIME Type Sniffing](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Basics_of_HTTP/MIME_types) 检查来确认该数据是什么类型。这算是 [源码](https://source.chromium.org/chromium/chromium/src/+/main:net/base/mime_sniffer.cc;l=5) 中提到的一个“小花招”，具体可以参见文章中的注释以了解不同的浏览器是如何处理 `content-type/payload` 的。
![](04.png "图4：响应头包含了 Content-Type 用以说明数据类型，而 payload 表示真实传输的数据")

如果服务器返回的是一个 HTML 文件，那么下一步浏览器就会向渲染进程传递数据以渲染页面，但如果是一个 zip 文件或其他格式的文件，就意味着这是一个下载请求，此时浏览器需要把数据传递给下载管理器以下载文件。
![](05.png "图5：网络线程询问响应的数据是否是一个来自安全站点的 HTML")

这也正是 [SafeBrowsing](https://safebrowsing.google.com/) 发生的时机。如果域名和响应数据看起来像个恶意的网站，这时网络线程会警惕性地显示一个提示页面，而且也会触发 [Cross Origin Read Blcoking(CORB)](https://www.chromium.org/Home/chromium-security/corb-for-developers/) 检测，以确保被攻击的垮站数据不会被传递给渲染进程。

### 第四步：查找渲染器进程
当所有的检测工作都已完成，并且网络线程也能够确信浏览器可以处理这个请求站点时，网络线程就会告诉 UI 线程数据已就绪，UI 线程就会寻找一个渲染器进程继续渲染这个网页。
![](06.png "图6：网络线程告诉 UI 线程去寻找一个渲染器进程")
由于网络请求可能需要几百毫秒才能获取到响应回复，因此需要对这个过程进行优化加速。在第二步的时候，当 UI 线程正在向网络线程发送一个 URL 请求，它就已经知道目标网站的地址了。同时 UI 线程会为这个网络请求试图主动查找或开启一个渲染器进程。这样一来，如果所有的步骤都如期进行，一个渲染器进程就会在网络线程收到数据的时候原定待命。如果导航发生跨站重定向的话，这个备用状态的进程可能不会被用到，此时可能就需要另外一个进程了。

### 第五步：委托导航
现在数据和渲染器进程已经准备就绪，一个 IPC 信号（进程间通信 Inter-Process Communication，简称IPC，是一种技术或方法，用于在至少两个进程或线程之间传输数据或信号。每个进程都有自己独立的系统资源，彼此隔离。）会从浏览器进程发送到渲染器进程以委托这个导航。它也会传递数据流，这样渲染器进程就能一直收到 HTML 数据。当渲染器进程收到委托的信号一旦被浏览器进程回执确认后，这个导航就完成了，并且文档的加载阶段也随之开始。

与此同时，地址栏便会更新，安全指示器和网站设置的用户界面也会显示出新页面的网站信息。标签页的会话历史记录也会被更新，因此后退/前进按钮也会跳转到刚刚导航过的网站。为了方便在关闭标签页或窗口时恢复标签页/会话，会话历史记录会存储在磁盘上。
![](07.png "图7：浏览器进程和渲染器进程之间的通信，请求渲染此页面")

### 附加步骤：初始化加载完成
一旦导航已提交，渲染器进程就会携带加载资源渲染这个页面。我们将会在下一篇文章中详细回顾在这一阶段发生的事情。当渲染器进程「完成」了渲染，它会发送一个 IPC 信号给浏览器进程（此举发生在所有页面的加载事件发出并且完成执行之后），此时 UI 线程便会停止标签页上的加载器。

我之所以说「完成」，是因为客户端 `JavaScript` 仍然可以在此之后加载其他资源并渲染新视图。
![](08.png "图8：从渲染器到浏览器进程的 IPC 信号，通知页面已经完成加载")

## 导航到一个不同的网站
这个简单的导航已经完成！但是，如果用户在地址栏中再次输入不同的 URL，会发生什么情况呢？那么，浏览器进程会通过相同的步骤导航到不同的网站。但在此之前，它需要检查当前渲染的网站是否关心 `beforeunload` 事件。

当你尝试离开或者关闭当前标签页的时候，`beforeunload` 事件可以创造一个“是否离开当前网站”的弹窗提示。一个标签页内部的所有内容包含你的`JavaScript` 代码，都由渲染器进程处理，所以当一个新的导航请求到来时，浏览器进程必须检查当前的渲染器进程。

> ⚠️注意：不要添加无条件的 `beforeunload` 处理事件。它会产生更多延迟，因为处理事件需要在导航开始之前被执行。这个事件处理器只应该在被需要的时候添加，比如，当用户需要被提醒警告他们可能会丢失已经在当前页面输入的数据。

![](09.png "图9：浏览器进程发送 IPC 信号给渲染器进程，告知它将会导航到一个新的网站")


If the navigation was initiated from the renderer process (like user clicked on a link or client-side JavaScript has run window.location = "https://newsite.com") the renderer process first checks beforeunload handlers. Then, it goes through the same process as browser process initiated navigation. The only difference is that navigation request is kicked off from the renderer process to the browser process.

When the new navigation is made to a different site than currently rendered one, a separate render process is called in to handle the new navigation while current render process is kept around to handle events like unload. For more, see an overview of page lifecycle states and how you can hook into events with the Page Lifecycle API.
