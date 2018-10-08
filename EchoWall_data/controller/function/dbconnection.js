/**
 * 数据库连接模块 db.js
 * @authors Carmelo Lcanboom
 */

var express = require('express');
var router = express.Router();
var mysql = require('mysql');

exports.connection = function() {
	var result;
	var connection = mysql.createConnection({
	  	host     : 'localhost',
	  	user     : 'username',
	  	password : 'password',
	  	database : 'echo'
	});
	connection.connect();
	return connection;
}

exports.query = function(connection, values, sql, res) {
	connection.query(sql, values, function (err, data) {
	    var result;
	    if(err){
	    	result = {
	    		'status': "500",
	    		'message':"query error"
	    	}
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


