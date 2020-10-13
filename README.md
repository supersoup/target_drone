# target_drone

渗透测试用的靶机

首先要安装 node.js 环境，建议使用 lts 版本

https://nodejs.org/zh-cn/download/

之后，进入到本项目根文件夹中：

安装本地包：

`npm install --registry=https://registry.npm.taobao.org`

开启两个命令行：

靶机：

`node app1`

可以在：localhost:9000 进行查看

攻击者：

`node app2`

可以在：localhost:9001 进行查看
