/*
	回音壁信息查询
	@authors Carmelo
	---------------------------------
	edit by keith
	2018/11/08
	---------------------------------
*/
var express = require('express');
var router = express.Router();
//var database = require('./function/dbconnection');
var database = require('./function/dbPoolConnection');
var common = require('./function/common');
var zset = "view_last_twoWeek";
var per_page_count = 10;
var page;
var start;
var sql;

// 处理get请求, 获得所有回音壁信息
router.get('/', function(req, res) {
	var connection = database.connection();
	page = req.query.page;
	start = (page - 1) * per_page_count;
	sql = "SELECT id, title, box, date_format(time, '%Y-%m-%d %H:%i:%s') time FROM echowall ORDER BY time DESC limit " + start + ', ' + per_page_count;
	database.query(connection, null, sql).then((data) => {
		if (data)
			res.jsonp(data);
		else
			res.jsonp({
		    	'status': "500",
		    	'message':"query error",
			})
	}, (err) => {
			res.jsonp(err);	
	});
});

// 根据信箱类型，获取回音壁相关信息
router.post('/bybox', function(req, res, next) {
	var connection = database.connection();
	var box_name = req.body.box;
	page = req.body.page;
	start = (page - 1) * per_page_count;
	//处理不常用信箱，额外写一个 sql 语句
	if (box_name === "其他") {
		var box_types = req.body.types;
		box_types = common.arrayToString(box_types)		// 格式化数组
		console.log(box_types);
		sql = "SELECT id, title, box, date_format(time, '%Y-%m-%d %H:%i:%s') time \
			FROM echowall WHERE box not in (" + box_types + ")\
			ORDER BY time DESC limit " + start + ', ' + per_page_count;
		database.query(connection, null, sql).then((data) => {
			if (data)
				res.jsonp(data);
			else
				res.jsonp({
			    	'status': "500",
			    	'message':"query error",
				})
		}, (err) => {
				res.jsonp(err);	
		});		
	} else {
		sql = "SELECT id, title, box, date_format(time, '%Y-%m-%d %H:%i:%s') time FROM echowall WHERE box = ? ORDER BY time DESC limit " + start + ', ' + per_page_count;
		database.query(connection, box_name, sql).then((data) => {
			if (data)
				res.jsonp(data);
			else
				res.jsonp({
			    	'status': "500",
			    	'message':"query error",
				})
		}, (err) => {
				res.jsonp(err);	
		});	
	}	
});

// 根据时间段（start_time，end_time）获取回音壁信息
router.get('/bytime', function(req, res) {
	var connection = database.connection();
	var start_time = req.query.start_time;
	var end_time = req.query.end_time;
	page = req.query.page;
	start = (page - 1) * per_page_count;
	sql = "SELECT id, title, box, date_format(time, '%Y-%m-%d %H:%i:%s') time FROM echowall WHERE time between ? AND  ? ORDER BY time DESC limit " + start + ', ' + per_page_count;
	database.query(connection, [start_time, end_time], sql).then((data) => {
		if (data)
			res.jsonp(data);
		else
			res.jsonp({
		    	'status': "500",
		    	'message':"query error",
			})
	}, (err) => {
			res.jsonp(err);	
	});
});

// 根据 title 关键字进行模糊查询，获取回音壁信息。
router.get('/bykey', function(req, res) {
	var connection = database.connection();
	var title_key = '%' + req.query.key + '%';
	page = req.query.page;
	start = (page - 1) * per_page_count;
 	sql = "SELECT id, title, box, date_format(time, '%Y-%m-%d %H:%i:%s') time FROM echowall WHERE title LIKE ? ORDER BY time DESC limit " + start + ', ' + per_page_count;
	database.query(connection, title_key, sql).then((data) => {
		if (data)
			res.jsonp(data);
		else
			res.jsonp({
		    	'status': "500",
		    	'message':"query error",
			})
	}, (err) => {
			res.jsonp(err);	
	});	
});

// 根据 id 获取指定回音壁信息
router.get('/byid', function(req, res) {
	var connection = database.connection();
	var redis_client = database.redis_connection();
	var id =  req.query.id;
 	sql = "SELECT * FROM echowall WHERE id = ? ";
	database.query(connection, id, sql).then((data) => {
		if (data) {
			// 判断 redis 有序集合中是否已经存在该回音壁的 id 信息
			database.redis_zscore(redis_client, zset, id).then((result) => {
				if (result)
					redis_client.zincrby(zset, 1, id, function(err, ret){
						if (err) {
							console.log(err);
							res.jsonp({
								"data": data,
								"message": "redis zincrby error"
							});
						}
						else{
							res.jsonp({
								"data": data,
								"message": "redis zincrby success"
							});							
						}
					});					
				else
					redis_client.zadd(zset, 1, id, function(err, ret){
						if (err) {
							console.log(err);
							res.jsonp({
								"data": data,
								"message": "redis zadd error"
							});
						}
						else{
							res.jsonp({
								"data": data,
								"message": "redis zadd success"
							});								
						}
					});
				redis_client.quit();
			}, (err) =>{
				res.jsonp(err);
			})
		}
		else
			res.jsonp({
		    	'status': "500",
		    	'message':"query error",
			})
	}, (err) => {
			res.jsonp(err);	
	});
});

module.exports = router;
