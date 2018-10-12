var Sequelize = require('sequelize');
var sequelize = require('../modules/db_conx');
var post = require('./post');
var user = sequelize.define('user', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
    },
    name: Sequelize.STRING,
    email: Sequelize.STRING,
    password: Sequelize.STRING,
    activated: Sequelize.BOOLEAN
});
user.hasMany(post, { as: 'posts', foreignKey: 'user_id' });
module.exports = user;