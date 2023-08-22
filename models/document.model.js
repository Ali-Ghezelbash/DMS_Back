const { DataTypes } = require("sequelize");
var sequelize = require("../config/db");
const Category = require("./category.model");
const User = require("./user.model");

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
  document_key: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  file: {
    type: DataTypes.STRING,
    allowNull: false,
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

Document.belongsTo(User);
Document.belongsTo(Category);

module.exports = Document;
