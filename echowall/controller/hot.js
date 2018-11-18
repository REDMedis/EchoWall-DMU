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

// 获取热门的回音壁信息（标准：两周时间内的浏览量降序排序）
router.get('/byview', function(req, res){
	var pool = database.connection();
	var redis_client = database.redis_connection();
	page = req.query.page;
	start = (page - 1) * per_page_count;
	// 获取缓存中有序集合的 id 列表
	database.redis_zrevrangebyscore(redis_client, zset).then((hotlist) => {
		hotlist = common.arrayToString(hotlist);
		console.log(hotlist);
		sql = "SELECT id, title, box, date_format(time, '%Y-%m-%d %H:%i:%s') time from echowall where id in (" + hotlist +
		") order by FIELD(id, "+ hotlist + ") LIMIT " + start + ', ' + per_page_count; 
		console.log(sql);
		database.query(pool, null, sql).then((data) => {
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
	}, (err) => {
		res.jsonp(err);	
	})
	redis_client.quit();
});

module.exports = router;