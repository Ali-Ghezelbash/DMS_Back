const { DataTypes } = require("sequelize");
var sequelize = require("../config/db");

const Log = sequelize.define("log", {
  from_doc: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  to_doc: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  users_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  doc_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

sequelize
  .sync()
  .then(() => {
    console.log("Log table created successfully!");
  })
  .catch((error) => {
    console.error("Unable to create table : ", error);
  });

module.exports = Log;
