/**
 * 用户模块 user.js
 * @authors Carmelo Lcanboom
 */

var express = require('express');
var router = express.Router();
//var database = require('./function/dbconnection');
var database = require('./function/dbPoolConnection');
var wechatCommunicate = require('./function/wechatCommunicate.js');

// 处理POST请求
router.post('/login',function(req, res, next){
    var code = req.body.code;
    var userInfo = req.body.userInfo;
    // 向微信服务器发送请求获取 openid session_key sk
    wechatCommunicate.getSessionIDandOpenid(code).then((data) => {
		    if (data) {
			    // 存储用户信息
			    userInfo['openid'] = data['openid'];
			    var sk = data['sk'];
			    var connection = database.connection();
			    var sql = "INSERT IGNORE INTO userInfo set ?";
			    var value = userInfo;
				database.query(connection, value, sql).then((data) => {
					console.log(data);
					if (data) {
				    	res.json({
					        'openid': data['openid'],
					        'sk': sk,
					        'status': 200,
					        'userInfo': userInfo
					    });
					}
					else
						res.jsonp({
					    	'status': 500,
					    	'message':"INSERT may failed",
						})
				}, (err) => {
						res.jsonp(err);	
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

router.post('/verifySk',function(req, res, next) {
	var sk = req.body.sk;
	var message;
	wechatCommunicate.verifySk(sk).then(data => {
		if (data) 
			message = 'sk 验证通过';
		else
			message = 'sk 不存在';
		res.json({
			'isVerified': data,
			'message': message
		})
	}, (error) => {
		res.json(error);
	})
})

router.post('/deleteSk',function(req, res, next) {
	var sk = req.body.sk;
	var message;
	wechatCommunicate.deleteSk(sk).then(data => {
		if (data) 
			message = '过期的 sk 已删除';
		else
			message = 'sk 不存在';
		res.json({
			'isDeleted': data,
			'message': message
		})
	}, (error) => {
		res.json(error);
	})
})

router.post('/getUserInfo',function(req, res, next) {
	var sk = req.body.sk;
	var openid = req.body.openid;
	var message;
	wechatCommunicate.verifySk(sk).then(isVerified => {
		if (isVerified) {
			wechatCommunicate.getUserInfo(openid).then(result => {
				if (Array.isArray(result) && result.length === 0){
					error = {
				    	'status': 500,
				    	'error': 'openid is not exits',						
					}
					res.json(error);
				}					
				else
					res.json({
						'userInfo': result,
						'status': 200
					}); 
			}, (error) => {
				res.json(error);
			})
		}
		else {
				error = {
			    	'status': 500,
			    	'error': 'sk is not exits',						
				}
				res.json(error);
		}
	}, (error) => {
		res.json(error);
	})
})

module.exports = router;





