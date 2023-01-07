const { DataTypes } = require("sequelize");
var sequelize = require("../config/db");

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

module.exports = Comment;
