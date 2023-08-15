### nginx常用命令

#### nginx的启动目录
```
/usr/local/nginx/sbin
```

#### linux命令
- 启动nginx
```
./nginx
```

- 重启nginx
```
./nginx -s reload
```

- 停止nginx
```
./nginx -s stop
```

- 查看nginx进程
```
ps -aux | grep nginx
```

- 查看nginx版本
```
./nginx -v
```

- 查看nginx配置文件
```
./nginx -t
```

#### windows命令
- 启动nginx
```
start .\nginx.exe
```

- 重启nginx
```
.\nginx.exe -s reload
```

- 停止nginx
```
.\nginx.exe -s stop
```

- 查看nginx进程
```
tasklist /fi "imagename eq nginx.exe"
```

- 查看nginx版本
```
.\nginx.exe -v
```

- 查看nginx配置文件
```
.\nginx.exe -t
```


#### 1 nginx 的组成部分

nginx主要由3部分组成：

- 全局配置块
- events块
- http块

#### 1.1 全局配置块

从配置文件开始到 events 块之间的内容，主要会设置一些影响nginx 服务器整体运行的配置指令，主要包括配 置运行 Nginx 服务器的用户（组）、允许生成的 worker process 数，进程 PID 存放路径、日志存放路径和类型以 及配置文件的引入等。
比如上面第一行配置的：

```nginx
worker_processes  1;
```

这是 Nginx 服务器并发处理服务的关键配置，worker_processes 值越大，可以支持的并发处理量也越多。这个指令的值与 CPU 核数有关，一般设置成等于 CPU 核数。

#### 1.2 events块

```nginx
events {
    worker_connections  1024;
}
```

events 块涉及的指令**主要影响 Nginx 服务器与用户的网络连接，常用的设置包括是否开启对多 work process 下的网络连接进行序列化，是否 允许同时接收多个网络连接，选取哪种事件驱动模型来处理连接请求，每个 word process 可以同时支持的最大连接数等。**

上述例子就表示每个 work process 支持的最大连接数为 1024.


#### 1.3 http块

这算是 Nginx 服务器配置中最频繁的部分，代理、缓存和日志定义等绝大多数功能和第三方模块的配置都在这里。需要注意的是：http 块也可以包括 http全局块、server 块。

```nginx
http {
    include       mime.types;
    default_type  application/octet-stream;
    sendfile        on;
    keepalive_timeout  65;

    server {
        listen       80;
        server_name  localhost;

        location / {
            root   html;
            index  index.html index.htm;
        }
        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }
    }
}
```

- include：引入其他配置文件，一般是 mime.types 文件，它的作用是设置浏览器访问服务器时的默认 MIME 类型。

- default_type：默认 MIME 类型，它的作用是设置浏览器访问服务器时的默认 MIME 类型。

- sendfile：配置 sendfile 指令，该指令默认为 on，表示使用 sendfile 函数（zero copy 方式）来输出文件，如果为 off，则表示不使用 sendfile 函数，而使用 write 函数来输出文件。
  - sendfile 函数是 Linux 系统提供的一个系统调用函数，它可以在两个文件描述符之间直接传输数据，避免了内核缓冲区和用户缓冲区之间的数据拷贝，所以可以提高传输性能。
  - write 函数是标准 C 库提供的一个系统调用函数，它的功能是将数据从一个文件描述符拷贝到另一个文件描述符，它需要经过内核缓冲区和用户缓冲区两次拷贝，所以传输性能不如 sendfile 函数。

- keepalive_timeout：设置客户端连接保持活动的超时时间，超过这个时间，连接会被强制关闭。

- server：配置虚拟主机的相关参数，一个 http 块可以包含多个 server 块。


#### 1.4 server块

这块和虚拟主机有密切关系，虚拟主机从用户角度看，和一台独立的硬件主机是完全一样的，该技术的产生是为了 节省互联网服务器硬件成本。
每个 http 块可以包括多个 server 块，而每个 server 块就相当于一个虚拟主机。
而每个 server 块也分为全局 server 块，以及可以同时包含多个 locaton 块。

```nginx
server {
    listen       8888;
    server_name  localhost;
    location /abc {
        proxy_pass http://localhost:8888/assets;
    }
    location /portal {
        proxy_pass http://10.10.192.44:12022/portal;
    }
}
```

#### 1.4.1 负载均衡

当我们访问http://localhost:8888/upstream时，nginx会把请求随机转发到localhost:8888和localhost:8001上。

```nginx
upstream equilibriumServer {
    server localhost:8888;
    server localhost:8001;
}

server {
    listen       8888;
    server_name  localhost;
    location /upstream {
        proxy_pass http://equilibriumServer/assets;
    }
    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   html;
    }
}
```
##### 1.4.2 ip_hash

ip_hash：每个请求按访问 ip 的 hash 结果分配，这样每个访客固定访问一个后端服务器。这样不会出现一个用户在一个 session 中的多次请求分配到了不同的服务器的情况。

```nginx
upstream equilibriumServer {
    ip_hash;
    server localhost:8888;
    server localhost:8001;
}
```

##### 1.4.3 权重
这里是每访问4次，其中3次是8001，1次是8888。如果使用了ip_hash，还是会被锁定在某个server。

```nginx
upstream equilibriumServer {
    # ip_hash;
    server localhost:8888 weight=1;
    server localhost:8001 weight=3;
}
```

#### 1.4.4 try_files

```nginx
location /copy/ {
    root C:/Users/xuruixi/Desktop/npm发布包/xrx-monorepo/packages/jqweb/assets1;
    try_files $uri $uri/ /assets/风景.png;
}
```
上面表示，如果访问的是http://localhost:8888/copy/风景.png，那么会先去C:/Users/xuruixi/Desktop/npm发布包/xrx-monorepo/packages/jqweb/assets1目录下找  /copy/风景.png  。完整的路径是C:/Users/xuruixi/Desktop/npm发布包/xrx-monorepo/packages/jqweb/assets1/copy/风景.png。如果找不到，那么会去/assets/风景.png。


#### 1.4.5 自定义错误页面

```nginx
error_page   404    /404.html;
    location = /404.html {
    root   /web/front/static/errorPage;
} 

error_page   500  /500.html;
location = /500.html {
    root   /web/front/static/errorPage;
}

error_page   500  /503.html;
location = /503.html {
    root   /web/front/static/errorPage;
}
```

#### 1.4.6 静态资源

像下面那样，就把http://localhost:8888/assets/风景.png映射到了C:/Users/xuruixi/Desktop/npm发布包/xrx-monorepo/packages/jqweb/assets1目录下。

```nginx
location /assets/ {
    root C:/Users/xuruixi/Desktop/npm发布包/xrx-monorepo/packages/jqweb/assets1;
}
```

#### 1.4.7 alias

alias和root的区别在于，alias后面的路径会替换掉location后面的路径。
例如下面的配置，**http://localhost:8888/abc/风景.png**  会映射到  **C:/Users/xuruixi/Desktop/npm发布包/xrx-monorepo/packages/jqweb/assets/风景.png。**

如果是root **http://localhost:8888/abc/风景.png**  会映射到  **C:/Users/xuruixi/Desktop/npm发布包/xrx-monorepo/packages/jqweb/assets/abc/风景.png。**

```nginx
location /abc {
    alias C:/Users/xuruixi/Desktop/npm发布包/xrx-monorepo/packages/jqweb/assets;
}
```


### 1.5 http配置

#### 1.5.1 gzip压缩
```nginx
http{
    # 开启压缩功能
    gzip on;
    # 设置压缩级别
    gzip_comp_level 6;
    # 设置压缩类型
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    # 设置最小压缩文件大小
    gzip_min_length 1000;
    # 设置压缩缓冲区大小
    gzip_buffers 4 32k;
    # 设置压缩后数据的缓存时间
    gzip_proxied any;
    # 设置压缩比例
    gzip_vary on;
    # 过滤掉IE6等不支持压缩的浏览器
    gzip_disable "MSIE [1-6]\.(?!.*SV1)";
    
    server{
      ...
    }
}
```

#### 1.5.2 nginx设置文件上传大小限制

```nginx
http{
    client_max_body_size 20m;
    server{
      ...
    }
}
```

#### 1.5.3 nginx设置跨域

跨域设置放在server块中，那就是针对某个server设置跨域，如果放在http块中，那就是针对所有server设置跨域。  
也可以在location块中设置跨域，那就是针对某个location设置跨域。

```nginx
http{
    server{
        set $cors_origin "";
        #访问的域名与填写的域名比较
        if ($http_origin ~* "^https://apifox.com$") {
            set $cors_origin $http_origin;
        }
        # 这里填*就是任何域名都允许跨域
        add_header Access-Control-Allow-Origin $cors_origin;

        # CORS请求默认不发送Cookie和HTTP认证信息。但是如果要把Cookie发到服务器，要服务器同意，指定 
        #Access-Control-Allow-Credentials字段。
	    add_header Access-Control-Allow-Credentials 'true';

        #设置跨域请求允许的Header头信息字段，以逗号分隔的字符串
        add_header Access-Control-Allow-Headers 'Origin,X-Requested-With,Content-Type,  Accept,Authorization,token';

        #设置跨域允许的请求
        add_header Access-Control-Allow-Metthods 'POST,GET,PUT,OPTIONS,DELETE';
    
        # 预检请求处理
        if ($request_method = OPTIONS) {
                return 204;
        }
    }
}
```

### 2 解决vue/react项目路由刷新404问题

下面表示如果找不到文件，就去找/index.html。

```nginx
server {
    listen       8888;
    server_name  localhost;
    location / {
        root   C:/Users/xuruixi/Desktop/npm发布包/xrx-monorepo/packages/jqweb/dist;
        index  index.html index.htm;
        try_files $uri $uri/ /index.html;
    }
}
```