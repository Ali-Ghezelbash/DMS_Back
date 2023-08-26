const { DataTypes } = require("sequelize");
var sequelize = require("../config/db");

const Category = sequelize.define("category", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

sequelize
  .sync()
  .then(() => {
    console.log("Category table created successfully!");
  })
  .catch((error) => {
    console.error("Unable to create table : ", error);
  });

module.exports = Category;
