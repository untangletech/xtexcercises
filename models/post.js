var Sequelize = require('sequelize');
var sequelize = require('../modules/db_conx');
var user = require('./user');
var post = sequelize.define('post', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
    },
    post: Sequelize.STRING,
    user_id: {
        type: Sequelize.STRING,
        references: 'users',
        referencesKey: 'id'
    }
});
//post.hasOne(user, { targetKey: 'user_id', foreignKey: 'user_id', as: 'users' });
/*post.associate = function () {
    post.hasOne(user, { targetKey: 'user_id', foreignKey: 'user_id', as: 'users' });
}*/
module.exports = post;