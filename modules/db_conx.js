var Sequelize = require('sequelize');
var sequelize = new Sequelize('untanglext', 'root', '', {
    host: 'localhost',
    port: 3306,
    dialect: 'mysql'
});
sequelize.authenticate()
    .then(function () {
        console.log("CONNECTED! ");
    })
    .catch(function (err) {
        console.log("NOT ABLE TO CONNECT TO THE DATABASE");
    })
    .done();

module.exports = sequelize;