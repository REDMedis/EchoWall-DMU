var express = require('express');
var router = express.Router();
var mysql = require('mysql');

// Use mysql pool
function connection() {
	var pool = mysql.createPool({
	  	host     : 'localhost',
	  	user     : 'root',
	  	password : '521Loli',
	  	database : 'echo',
	  	port 	 : '3306'		
	});
	return pool;
}

function query(pool, values, sql, res) {	
	pool.getConnection(function(err, connection) {
	  	if (err) throw err; // not connected!
	  	// Use the connection
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
		    // When done with the connection, release it.	    

		    connection.release();
		    
		    // Handle error after the release.

		    if (error) throw error;

		    // Don't use the connection here, it has been returned to the pool.	 	    
		});

	});
}

exports.connection = connection;
exports.query = query;