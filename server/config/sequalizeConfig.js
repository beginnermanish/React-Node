var configDB = require('./database.js');
var Sequelize = require('sequelize');


var sequelize = new Sequelize(configDB.database, configDB.user, configDB.password, {
    host: configDB.host,
    dialect: 'mysql',
    pool: {
        max: 100,
        min: 0,
        maxConnections:100,
        idle: 10000
    }
});

module.exports = sequelize;