var request = require('request');
var crypto = require('crypto');
var database = require('./dbconnection');
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

exports.getSessionIDandOpenid = getSessionIDandOpenid;