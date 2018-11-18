/*
*	与微信服务相关的处理
*/

var request = require('request');
var crypto = require('crypto');
//var database = require('./dbconnection');
var database = require('./dbPoolConnection');
var config = require('../../config');

function getSessionIDandOpenid(code) {
    // 向微信服务器发送请求获取 openid session_key，并生产 SessionID，封装成为 promise 对象
    return new Promise( (resolve, reject) => 
		request.get({
		    uri: 'https://api.weixin.qq.com/sns/jscode2session',
		    json: true,
		    qs: {
		      grant_type: 'authorization_code',
		      appid: config.appId,
		      secret: config.appSecret,
		      js_code: code
		    }
		}, (err, response, data) => {
		    if (!err && response.statusCode === 200) {

		    	// 生成 md5 码作为 session_ID 
		      	var hash = crypto.createHash('md5');
		      	hash.update(data.openid + data.session_key);
		      	var sk = hash.digest('hex');
		      	
		      	// 将 json 对象序列化为字符串
		      	data = JSON.stringify(data);

			    // 存入 redis 中保存 sk
				var redis_client = database.redis_connection();
				database.redis_hash_set(redis_client, 'sessionID', sk, data);

				data = JSON.parse(data);
				data['sk'] = sk;
				resolve(data);
		    } else {
		      	console.log("[error]", err);
		      	reject(err);
		    } 
		})
    )
}

function verifySk(sk) {
	// 检验小程序传来的 sk 是否存在
	var redis_client = database.redis_connection();
	return new Promise((resolve, reject) => {
		redis_client.hexists('sessionID', sk, function(err, ret){
			if (err) {
				error = {
		    		'status': "500",
		    		'message':"redis query error"					
				}
				reject(error);
			}
			else{
				resolve(ret);
			}
		});
		redis_client.quit();	
	})
}

function deleteSk(sk) {
	// 当小程序端判断 session_key 已过时，清楚缓存中对应已过期的项
	var redis_client = database.redis_connection();
	return new Promise((resolve, reject) => {
		redis_client.hdel('sessionID', sk, function(err, ret){
			if (err) {
				error = {
		    		'status': "500",
		    		'message':"redis delete error"					
				}
				reject(error);
			}
			else{
				resolve(ret);
			}
		});
		redis_client.quit();	
	})	
}

function getUserInfo(openid) {
	var mysql_client = database.connection();
	return new Promise( (resolve, reject) => {
		sql = "select * from userInfo where openid = ?";
		database.query(mysql_client, openid, sql).then((data) => {
			if (data)
				resolve(data);
			else{
					error = {
				    	'status': "500",
				    	'message':"query error or openid is not exist",
					}
					reject(error);				
			}
		}, (err) => {
				reject(err);	
		});	
	})
}

exports.getSessionIDandOpenid = getSessionIDandOpenid;
exports.verifySk = verifySk;
exports.deleteSk = deleteSk;
exports.getUserInfo = getUserInfo;