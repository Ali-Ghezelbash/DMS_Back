var User = require("../models/user.model");
var Role = require("../models/role.model");
var UserRoles = require("../models/user_roles.model");
var { hash } = require("../utils/hash");

async function getAllUser() {
  return (result = await User.findAll({
    include: [
      {
        model: UserRoles,
        include: [{ model: Role, attributes: ["id", "name"] }],
        attributes: ["id"],
      },
    ],
    attributes: ["id", "firstname", "lastname", "username", "createdAt"],
  }));
}

async function getUserById(id) {
  return await User.findByPk(id, {
    include: [
      {
        model: UserRoles,
        include: [{ model: Role, attributes: ["id", "name"] }],
        attributes: ["id"],
      },
    ],
    attributes: ["id", "firstname", "lastname", "username", "createdAt"],
  });
}

async function createUser(user) {
  user.password = await hash(user.password);

  const res = await User.create(user);

  const userRole = user.roles.map((roleId) => ({
    userId: res.dataValues.id,
    roleId,
  }));

  await UserRoles.bulkCreate(userRole);

  delete res.dataValues.password;
  return res.dataValues;
}

async function updateUser(user) {
  await UserRoles.destroy({
    where: { userId: user.id },
  });

  const userRole = user.roles.map((roleId) => ({
    userId: user.id,
    roleId,
  }));

  await UserRoles.bulkCreate(userRole);

  return await User.update(user, {
    where: { id: user.id },
  });
}
async function changePassword(user) {
  user.password = await hash(user.password);

  return await User.update(user, {
    where: { id: user.id },
  });
}

async function deleteUser(id) {
  return await User.destroy({
    where: { id },
  });
}

module.exports = {
  getAllUser,
  getUserById,
  createUser,
  updateUser,
  changePassword,
  deleteUser,
};
