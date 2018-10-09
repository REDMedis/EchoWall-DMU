/**
 * 测试模块 test.js
 * @authors Carmelo Lcanboom
 */

var express = require('express');
var router = express.Router();
var database = require('./function/dbconnection');

// 处理get请求
router.get('/', function(req, res) {
	var connection = database.connection();
	var  sql = 'SELECT * FROM echowall';
	database.query(connection, null ,sql, res);
});

module.exports = router;

