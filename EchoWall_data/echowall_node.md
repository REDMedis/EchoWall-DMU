# EchoWall_data

## 环境

- Node.js
- mysql
- express

## 使用说明

	npm install -g express

	cd echowall & npm install

	npm install mysql
	
	npm start

启动前需要修改 /controller/function/dbconnection.js 的数据库连接信息

	exports.connection = function() {
		var result;
		var connection = mysql.createConnection({
		  	host     : '',
		  	user     : '',
		  	password : '',
		  	database : ''
		});
		connection.connect();
		return connection;
	}

## 目录说明

	echowall/
	  |- bin/							
		  |- ...
	  |- controller
		  |- function						# 公共方法：数据库连接操作等
		  	  |- ...					
		  |- query.js						# 回音壁信息查询
		  |- test.js						# 测试
	  |- node_modules
	  |- public							# 静态文件
	  |- routes							# 路由
 	  |- views								
	  |- app.js 							# 项目入口
	  |- package.json                       			# 依赖配置文件

## 测试版信息查询访问

### 普通查询

	http://yourserver:3000/query?page=2

### 根据 title 关键字查询

	http://yourserver:3000/query/bykey?key=保研&page=2

### 根据信箱类型查询

	http://yourserver:3000/query/bybox?box=组织部信箱&page=1

### 根据时间段查询

	http://yourserver:3000/query/bytime?start_time=2018-9-28&end_time=2018-9-30&page=2
	
### 根据 id 获取指定回音壁信息

	http://yourserver:3000/query/byid?id=xxxxxxxxxxxx


## 业务拓展

routes 中的 index.js 为路由分发控制总入口，在其中暴露的方法中添加：

    var xxx = require('../controller/xxx');
    app.use('/xxx', xxx);

在 controller 中新建对指定请求的处理程序即可，如 xxx.js

	var express = require('express');
	var router = express.Router();

	// 处理get请求
	router.get('/', function(req, res) {
	    res.send({
	        'username':'杨幂',
	        'sex':'woman',
	        'address':'上海'
	    });
	});

	// 处理POST请求
	router.post('/',function(req,res){
	    console.log('接受到了post请求');
	    res.send({
	        'regist':{title:req.param('username')}
	    })
	});

	module.exports = router;

即可通过访问 localhost:3000/xxx 获取数据
