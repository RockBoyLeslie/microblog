var mysql = require('mysql');
var config = {'host':'localhost','port':'3306','user':'root','password':'123456'};

console.log('Connecting to MYSQL...');
var pool = mysql.createPool(config);

exports.pool = pool;


