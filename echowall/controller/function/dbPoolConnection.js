var mysql = require('mysql');
var redis = require('redis');
var config = require('../../config');
var async = require('async');
/**
 * Use mysql pool
 */
function connection() {
	var pool = mysql.createPool({
	  	host     : config.host,
	  	user     : config.mysql_user,
	  	password : config.mysql_password,
	  	database : config.mysql_database,
	  	port 	 : config.mysql_port		
	});
	return pool;
}

function query(pool, values, sql) {
	return new Promise( function(resolve, reject){
		pool.getConnection(function(err, connection) {
		  	if (err){ // not connected!
		  		error = {
		  			'status': 500,
		  			'error': 'not connected'
		  		}
		  		resolve(error); 
		  	} 	  		
		  	// Use the connection
			connection.query(sql, values, function (err, data) {
			    var result;
			    if(err){
			    	error = {
			    		'status': "500",
			    		'message':"connection query error"
			    	}
			    	reject(error);
			    }
			    else{
					resolve(data);
			    }
			    // When done with the connection, release it.	    

			    connection.release();
			    
			    // Handle error after the release.

			    if (err) {
			  		error = {
			  			'status': 500,
			  			'error': 'Handle error after the release'
			  		}
			  		reject(error); 
			    }
			    // Don't use the connection here, it has been returned to the pool.	 	    
			});
		});
	})	
}

/*
* 对事务的封装
*/

function getSqlParamEntity(sql, params, callback) {
  	if (callback) {
    	return callback(null, {
      	sql: sql,
      	params: params
    	});
  	}
  	return {
    	sql: sql,
    	params: params
 	};
}

function getSqlArray(sql, params, connection) {
	return function(callback) {
		connection.query(sql, params, function(err, result) {
		callback(err);
		})
	};
}

function transaction(pool, sqlArray) {
	var SqlArray = [];
	return new Promise( (resolve, reject) => {
		pool.getConnection( (err, connection) => {
			if (err) {
				// get connection err
				error = {
					'status': 500,
					'message': 'get connection err'					
				}
				resolve(error);		
				return;
			}
			// 事务开始
			connection.beginTransaction( (err) => {
				if (err) {
					error = {
						'status': 500,
						'message': 'beginTransaction err'					
					}					
					reject(error);
				}
				
				for (var i = 0; i < sqlArray.length; i++) {
					console.log(sqlArray[i].sql);
					console.log(sqlArray[i].params);
					SqlArray.push(getSqlArray(sqlArray[i].sql, sqlArray[i].params, connection));
				}
				// 顺序实现 sql 语句，出错 rollback
				async.series(SqlArray, (err, result) => {
					if (err) {
						console.log(err);
						connection.rollback( (err) => { reject(err) });
					}
				})

				connection.commit( err => {
					if (err) {
						connection.rollback( (err) => { reject(err) } )
					}
				})
				console.log('Transaction complete');
				resolve({
					'status': 200,
					'message': 'Transaction complete'
				})
				connection.release();
			})
		})
	})
}

/*
* redis connect
*/

function redis_connection() {
	var host = config.host;
	var port = config.redis_port;
	var auth = config.redis_auth;
	var client = redis.createClient(port, host, auth);
	return client;
}

function redis_hash_set(client, name, key, values) {
	client.hset(name, key, values, function(err, ret){
		if (err) {
			console.log(err);
			return;
		}
	});
	client.quit();
}

function redis_zscore(client, name, values) {
	return new Promise( (resolve, reject) => {
		client.zscore(name, values, function(err, ret){
			if (err) {
				console.log(err);
				reject({
					"status": 500,
					"message": "zscore error"
				})
			}
			else
				resolve(ret);
		});	
	})
}

function redis_zrevrangebyscore(client, name) {
	return new Promise( (resolve, reject) => {
		client.zrevrangebyscore(name, "+inf", "-inf", function(err, ret){
			if (err) {
				console.log(err);
				reject({
					"status": 500,
					"message": "zscore error"
				})				
			}
			else
				resolve(ret);
		})
	})
}

exports.connection = connection;
exports.query = query;
exports.redis_connection = redis_connection;
exports.redis_hash_set = redis_hash_set;
exports.transaction = transaction;
exports.getSqlParamEntity = getSqlParamEntity;
exports.redis_zscore = redis_zscore;
exports.redis_zrevrangebyscore = redis_zrevrangebyscore;