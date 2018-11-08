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
var database = require('./function/dbconnection');
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
	database.query(connection, null ,sql, res);
});

// 根据信箱类型，获取回音壁相关信息
router.get('/bybox', function(req, res) {
	var connection = database.connection();
	var box_name = req.query.box;
	page = req.query.page;
	start = (page - 1) * per_page_count;
	//处理不常用信箱，额外写一个 sql 语句
	if (box_name === "其他"){
		sql = "SELECT id, title, box, date_format(time, '%Y-%m-%d %H:%i:%s') time \
		FROM echowall WHERE box not in ('校领导信箱', '后勤保障处信箱', '教务处信箱', '网络信息与综合服务中心信箱', '学生处信箱', '创新创业学院信箱', '财务处信箱', '人事处信箱', '图书馆信箱', '学生就业指导中心', '保卫处信箱', '信息处信箱', '后勤集团', '研究生信箱') \
		ORDER BY time DESC limit " 
		+ start + ', ' + per_page_count;
		database.query(connection, null, sql, res);
	}else{
		sql = "SELECT id, title, box, date_format(time, '%Y-%m-%d %H:%i:%s') time FROM echowall WHERE box = ? ORDER BY time DESC limit " + start + ', ' + per_page_count;
		database.query(connection, box_name, sql, res);
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
	database.query(connection, [start_time, end_time], sql, res);
});

// 根据 title 关键字进行模糊查询，获取回音壁信息。
router.get('/bykey', function(req, res) {
	var connection = database.connection();
	var title_key = '%' + req.query.key + '%';
	page = req.query.page;
	start = (page - 1) * per_page_count;
 	sql = "SELECT id, title, box, date_format(time, '%Y-%m-%d %H:%i:%s') time FROM echowall WHERE title LIKE ? ORDER BY time DESC limit " + start + ', ' + per_page_count;
	database.query(connection, title_key, sql, res);
});

// 根据 id 获取指定回音壁信息
router.get('/byid', function(req, res) {
	var connection = database.connection();
	var id =  req.query.id;
 	sql = "SELECT * FROM echowall WHERE id = ? ";
	database.query(connection, id, sql, res);
});


module.exports = router;
