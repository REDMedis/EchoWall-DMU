var mysql = require('mysql');
var config = require('../../config');
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