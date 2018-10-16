# Echo 后台环境搭建

- - - -

### 环境要求

* 国内云服务器
* Apache / Nginx
* MySQL 8.0.x
* Node 10.x
* npm 6.x
* 服务器端口开放
* 后台代码配置

### MySQL 配置

MySQL 安装时需注意版本不宜过低，过低的版本如 5.5，5.7 会出现不兼容原始数据的字符集导致无法写入数据文件或是出现字符乱码等问题，同时由于 MySQL 8.0 新增了较强的数据库加密方式，这可能会导致与后台进行连接时出现问题，因此在安装时要保证采用较为宽松的密码验证方式即： *Use Legacy  Authentication Method (Retain MySQL 5.x Compatibility )*

### Node 配置

我们采用源代码的方式来在 Ubuntu 服务端安装最新版本的 Node 服务。
1. 下载源代码包 ` wget https://npm.taobao.org/mirrors/node/v10.11.0/node-v10.11.0-linux-x64.tar.xz `
2. 解压代码包
3. 为 node 和 npm 指令添加软连接：

`ln -s /node_locate/bin/node /usr/local/bin/node `

`ln -s /node_locate/bin/npm /usr/local/bin/npm `

4. 测试 Node 是否成功安装

### 阿里云服务器端口开放

由于服务端监听的是 3000 端口，同时为了保证服务器远程连接，Ftp 连接等功能的正常使用，我们需要在阿里云中为实例开放以下几个端口：

![5b350044.png](http://wx2.sinaimg.cn/mw690/0060lm7Tly1fw2edc40x2j30wq0ewgo1.jpg
)

### 后台代码配置

[echowall_node](https://github.com/REDMedis/EchoWall-DMU/blob/master/echowall/echowall_node.md)

