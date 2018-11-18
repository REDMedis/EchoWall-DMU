/**
 * 数据库连接模块
 * @authors Carmelo
 */
var mysql = require('mysql');
var redis = require('redis');
var config = require('../../config');

/**
 * mysql 数据库的连接
 */
function handleError(err) {
    if (err) {
        // 连接断开，自动重新连接
        console.log('err code:' + err.code);
        if (err.code === 'ETIMEDOUT' || err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR') {
            connection();
        } else {
            console.error(err.stack || err);
        }
    }
}

function connection() {
	connection = mysql.createConnection({
	  	host     : config.host,
	  	user     : config.mysql_user,
	  	password : config.mysql_password,
	  	database : config.mysql_database
	});
	connection.connect(handleError);
   	connection.on('error', handleError);
   	return connection	
}

function query(connection, values, sql) {
	return new Promise( function(resolve, reject){
		connection.query(sql, values, function (err, data) {
		    var result;
		    if(err){
		    	result = {
		    		'status': "500",
		    		'message':"query error"
		    	}
		    	reject(result);
		    }
		    else{
		    	result = {
		    		'status': "200",
		    		'message':"query success",
		    		data: data
		    	}
				resolve(result);
		    } 
		});
	}) 
}

/**
 * redis 数据库的连接
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

exports.connection = connection;
exports.query = query;
exports.redis_connection = redis_connection;
exports.redis_hash_set = redis_hash_set;