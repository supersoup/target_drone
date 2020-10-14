# target_drone

渗透测试用的靶机。

**学习渗透测试，请遵守法律法规，仅在允许的环境中进行使用。**

首先要安装 node.js 环境，建议使用 lts 版本

https://nodejs.org/zh-cn/download/

之后，进入到本项目根文件夹中：

一、安装本地包：

`npm install --registry=https://registry.npm.taobao.org`

二、导入数据库并配置：

将 sql/test_sql_injection.sql 导入到你的某一个数据库中。

在 db.js 中配置数据库相关信息。

三、开启两个服务，您可以使用两个命令行：

靶机：

`node app1`

可以在：localhost:9000 进行查看

攻击者：

`node app2`

可以在：localhost:9001 进行查看

