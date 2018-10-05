var Sequelize = require('sequelize');
var sequelize = require('../modules/db_conx');
var user = sequelize.define('user', {
    id: {
        type: Sequelize.STRING,
        primaryKey: true,
    },
    name: Sequelize.STRING,
    email: Sequelize.STRING,
    birthday: Sequelize.STRING,
    password: Sequelize.STRING,
    activated: Sequelize.BOOLEAN,
    token: Sequelize.STRING
});
module.exports = user;