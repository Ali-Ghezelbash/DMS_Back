const { DataTypes } = require("sequelize");
var sequelize = require("../config/db");
const User = require("./user.model");

const Comment = sequelize.define("comment", {
  message: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  users_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  documents_id: {
    type: DataTypes.INTEGER,
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

module.exports = Comment;
