
var mysql = require('mysql');
var configDB = require('../config/database.js');

var connection;

connection  = mysql.createPool(configDB);

module.exports = connection;