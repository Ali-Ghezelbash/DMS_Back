const { DataTypes } = require("sequelize");
var sequelize = require("../config/db");

var Document = require("./document.model");
var Role = require("./role.model");

const DocumentRoles = sequelize.define("document_roles", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
});

Document.belongsToMany(Role, { through: DocumentRoles });
Role.belongsToMany(Document, { through: DocumentRoles });

Document.hasMany(DocumentRoles);
DocumentRoles.belongsTo(Document);

Role.hasMany(DocumentRoles);
DocumentRoles.belongsTo(Role);

module.exports = DocumentRoles;
