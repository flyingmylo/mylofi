---
title: "使用 Nginx 部署一个静态页面"
date: 2023-03-28T20:54:28+08:00
tags: ['nginx']
showTags: true
summary: '在服务器上使用 Nginx 部署一个 Hello World'
slug: nginx-conf
draft: false
---

### 上传静态资源
首先把本地的一个 `index.html` 文件上传至服务器，然后发布进行访问。

首先进入到 `root` 目录下新建 `www` 文件夹
```
cd /root && mkdir www
```
然后在本地执行以下命令，将 `index.html` 文件上传至 `/root/www` 目录下：
```
// 上传本地文件
scp index.html root@123.249.15.191:/root/www
```

其他文件传输操作：
- 上传本地目录到服务器：`scp -r dist root@123.249.15.191:/root/www`
- 从服务器下载文件：`scp root@123.249.15.191:/root/www/index.html`
- 从服务器下载目录：`scp -r root@123.249.15.191:/root/www  /var/www`

### 安装 nginx
执行命令以检查 `yum` 源中是否存在 nginx 包：
```
yum list nginx
```
![](list.png "已安装的示例图")
使用 `yum` 安装 nginx：
```
yum install -y nginx
```
出现 **Complete!** 提示即安装成功：
![](install.png "已安装的示例图")
此时我们可以通过浏览器访问服务器地址，会看到 nginx 默认页面，如下：
![](hello-nginx.png "nginx 默认页面")

### 配置 nginx
执行以下命令进入 nginx 目录，并修改配置：
```
cd /etc/nginx
vim nginx.conf
```
在 `server` 中配置静态服务 `location` ，同时 nginx 还可以对网站的静态资源在传输前进行压缩，提高页面加载速度。经过 gzip 压缩后页面大小可以变为原来的 30% 甚至更小。使用时仅需开启 gzip 压缩功能即可。完整配置如下：
```toml
  user nginx;
  worker_processes auto;
  error_log /var/log/nginx/error.log;
  pid /run/nginx.pid;

  # Load dynamic modules. See /usr/share/doc/nginx/README.dynamic.
  include /usr/share/nginx/modules/*.conf;

  events {
      worker_connections 1024;
  }

  http {
      log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                        '$status $body_bytes_sent "$http_referer" '
                        '"$http_user_agent" "$http_x_forwarded_for"';

      access_log  /var/log/nginx/access.log  main;

      sendfile            on;
      tcp_nopush          on;
      tcp_nodelay         on;

      # 开启gzip压缩功能
      gzip   		on;

      # 设置允许压缩的页面最小字节数; 这里表示如果文件小于10k，压缩没有意义.
      gzip_min_length 10k; 

      # 设置压缩比率，最小为 1，处理速度快，传输速度慢；
      # 最大压缩比可设置为 9，但是处理速度较慢，推荐设置为 6
      gzip_comp_level 6;

      # 设置需要压缩的文件, 通常情况下文本、css、js建议压缩
      gzip_types text/plain text/css application/json application/x-javascript text/xml application/xml application/xml+rss text/javascript; 

      keepalive_timeout   65;
      types_hash_max_size 2048;

      include             /etc/nginx/mime.types;
      default_type        application/octet-stream;

      # Load modular configuration files from the /etc/nginx/conf.d directory.
      # See http://nginx.org/en/docs/ngx_core_module.html#include
      # for more information.
      include /etc/nginx/conf.d/*.conf;

      server {
          listen       80 default_server;
          listen       [::]:80 default_server;
          server_name  _;
          root         /usr/share/nginx/html;

          # Load configuration files for the default server block.
          include /etc/nginx/default.d/*.conf;

          location / {
            root /root/www;
            index index.html index.htm;
            try_files $uri $uri/ /index.html;
          }

          error_page 404 /404.html;
              location = /40x.html {
          }

          error_page 500 502 503 504 /50x.html;
              location = /50x.html {
          }
      }
  }
```
配置完成之后，执行 `nginx -s reload` 重启 nginx 后通过浏览器访问，发现报 500 内部服务器错误：
![](500.png "500 Internal Server Error")

### 排查问题
通过上文中配置可以看到，第 3 行中的错误日志路径为：`error_log /var/log/nginx/error.log;`
此时我们通过命令查看 `cat /var/log/nginx/error.log` 错误日志，由 `Permission denied` 可以看出是权限问题导致。
![](permission.png "权限错误")

1.首先，我们通过 `ps aux | grep nginx` 命令查看当前 nginx 的运行进程：
![](process.png "当前进程")

2.其次，我们修改上文配置中的第一行：
```toml
# 将用户名 nginx 改为 root
user root;
```
3.最后，执行 `nginx -s reload` 重启 nginx ，再次打开页面看到已经可以正常访问：
![](hello-world.png "hello-world")

### 常用命令
- `nginx` 启动服务
- `nginx -s reload` 重启，每次修改配置文件后都需要重新启动才能生效
- `nginx -s stop 或 nginx -s quit` 关闭服务


以上📝
