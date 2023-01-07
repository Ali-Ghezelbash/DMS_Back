const { DataTypes } = require("sequelize");
var sequelize = require("../config/db");

var User = require("./user.model");
var Role = require("./role.model");

const UserRoles = sequelize.define("user_roles", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
});

User.belongsToMany(Role, { through: UserRoles });
Role.belongsToMany(User, { through: UserRoles });

User.hasMany(UserRoles);
UserRoles.belongsTo(User);

Role.hasMany(UserRoles);
UserRoles.belongsTo(Role);

module.exports = UserRoles;
