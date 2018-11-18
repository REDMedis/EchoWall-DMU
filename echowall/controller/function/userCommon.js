var database = require('./dbPoolConnection');
var wechatCommunicate = require('./wechatCommunicate.js');
var param;

function userTransaction(sk, openid, sqlArray) {
	var pool = database.connection();
	return new Promise( (resolve, reject) => {
		wechatCommunicate.verifySk(sk).then(isVerified => {
			if (isVerified) {
				wechatCommunicate.getUserInfo(openid).then(result => {
					console.log(result);
					if (Array.isArray(result) && result.length === 0){
						error = {
					    	'status': 500,
					    	'error': 'openid is not exits',						
						}
						reject(error);
					}					
					else {
						// 事件的事务组成					
						database.transaction(pool, sqlArray).then( (err, result) => {
							if (err) 
								reject(err);
							else
								resolve(result);
						}, (err) => {
							error = {
								'status': 500,
								'message': 'rollback errorr'
							};
							reject(error);
						})
					}
				}, (error) => {
					reject(error);
				})
			}
			else {
					error = {
				    	'status': 500,
				    	'error': 'sk is not exits',						
					}
					reject(error);
			}
		}, (error) => {
			reject(error);
		})
	});
}

exports.userTransaction = userTransaction;