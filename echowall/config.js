var appId = 'YourappId';
var appSecret = 'YourappSecret';
var	host = 'localhost';

// mysql 配置
var mysql_user = 'root';
var mysql_password = 'mysqlPassword';
var mysql_database = 'mysqlDatabase'; 
var mysql_port = 3306;

// redis 配置
var redis_port = 6379;
var redis_auth = {auth_pass: 'redisPassword'};

module.exports = {
  appId: appId,
  appSecret: appSecret,
  mysql_user: mysql_user,
  mysql_password: mysql_password,
  mysql_database: mysql_database,
  mysql_port: mysql_port,
  redis_port: redis_port,
  redis_auth: redis_auth,
  host: host
};
