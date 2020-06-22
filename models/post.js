var Sequelize = require("sequelize");
var sequelize = require("../modules/db_conx");
var post = sequelize.define("post", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  postHeading: Sequelize.STRING,
  post: Sequelize.STRING,
  user_id: {
    type: Sequelize.STRING,
    references: "users",
    referencesKey: "id"
  }
});
module.exports = post;
