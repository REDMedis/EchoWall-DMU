/**
 * 数据库连接模块
 * @authors Carmelo
 */

var express = require('express');
var router = express.Router();
var mysql = require('mysql');

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
	  	host     : 'localhost',
	  	user     : 'root',
	  	password : '521Loli',
	  	database : 'echo'
	});
	connection.connect(handleError);
   	connection.on('error', handleError);
   	return connection	
}

function query(connection, values, sql, res) {
	connection.query(sql, values, function (err, data) {
	    var result;
	    if(err){
	    	result = {
	    		'status': "500",
	    		'message':"query error"
	    	}
	    	console.log(err);
	    }
	    else{
	    	result = {
	    		'status': "200",
	    		'message':"query success",
	    		data: data
	    	}
			return res.jsonp(result);
	    } 
	});
}

exports.connection = connection;
exports.query = query;
