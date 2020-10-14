const mysql = require('mysql');

module.exports.pool = mysql.createPool({
	connectionLimit: 10,
	host: 'localhost',
	user: 'root',
	password: '123456',
	database: 'test_sql_injection'
});