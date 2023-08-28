const { DataTypes } = require("sequelize");
var sequelize = require("../config/db");
const User = require("./user.model");
const Document = require("./document.model")

const Comment = sequelize.define("comment", {
  message: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

sequelize
  .sync()
  .then(() => {
    console.log("Comment table created successfully!");
  })
  .catch((error) => {
    console.error("Unable to create table : ", error);
  });

Comment.belongsTo(User);
Comment.belongsTo(Document);

module.exports = Comment;
