/**
 * 用户模块 user.js
 * @authors Carmelo Lcanboom
 */

var express = require('express');
var router = express.Router();
var database = require('./function/dbconnection');
var wechatCommunicate = require('./function/wechatCommunicate.js');
var data;

// 处理POST请求
router.post('/login',function(req, res, next){
    var code = req.body.code;
    var userInfo = req.body.userInfo;
    // 向微信服务器发送请求获取 openid session_key sk
    wechatCommunicate.getSessionIDandOpenid(code).then((data) => {
		    if (data) {
			    // 存储用户信息
			    userInfo['openid'] = data['openid'];
			    var connection = database.connection();
			    var sql = "INSERT INTO userInfo set ?";
			    var value = userInfo;
			    database.query(connection, value, sql, res);
			    res.json({
			        'openid': data['openid'],
			        'sk': data['sk'],
			        'status': 200,
			        'userInfo': userInfo
			    });
		    }
		    else {
		    	res.json({
		    		'status': 500,
		    		'error': 'error in getting sessionID'
		    	})
		    }
	    }, (err) => {
		    	res.json({
		    		'status': 500,
		    		'error': 'error in getting sessionID',	  
		    	})    	
    })
});

module.exports = router;





