var mysql = require('mysql');
var config = require('../config');

var pool = mysql.createPool({
    connectionLimit: config.MYSQL_POOL_LIMIT,
    host: config.MYSQL_HOST,
    user: config.MYSQL_USER,
    password: config.MYSQL_PASSWORD,
    port: config.MYSQL_PORT,
    database: config.MYSQL_DATABASE
});

module.exports = pool;