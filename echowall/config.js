var appId = 'wx4960b854a7a61e91';
var appSecret = '8b21421af25755cb5cc9197680f37a59';
var	host = 'localhost';

// mysql 配置
var mysql_user = 'root';
var mysql_password = '521Loli';
var mysql_database = 'echo'; 
var mysql_port = 3306;

// redis 配置
var redis_port = 6379;
var redis_auth = {auth_pass: 'echowall'};

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
