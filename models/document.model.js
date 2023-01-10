const { DataTypes } = require("sequelize");
var sequelize = require("../config/db");

const Document = sequelize.define("document", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  version: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  active: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  document_key: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});

sequelize
  .sync()
  .then(() => {
    console.log("Document table created successfully!");
  })
  .catch((error) => {
    console.error("Unable to create table : ", error);
  });

module.exports = Document;
