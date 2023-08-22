const { DataTypes } = require("sequelize");
var sequelize = require("../config/db");
const User = require("./user.model");

const Document = sequelize.define("Document_version", {
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
    console.log("Document_version table created successfully!");
  })
  .catch((error) => {
    console.error("Unable to create table : ", error);
  });

Document.belongsTo(User);

module.exports = Document;
