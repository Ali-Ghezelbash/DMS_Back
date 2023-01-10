var User = require("../models/user.model");
var Role = require("../models/role.model");
var UserRoles = require("../models/user_roles.model");
var { hash } = require("../utils/hash");

async function getAllUser() {
  const result = await User.findAll({
    include: [
      {
        model: UserRoles,
        include: [{ model: Role, attributes: ["id", "name", "key"] }],
        attributes: ["id"],
      },
    ],
    attributes: ["id", "firstname", "lastname", "username", "createdAt"],
  });

  const users = result.map((value) => {
    const user = value.dataValues;

    const roles = user.user_roles.map((user_role) => user_role.role.key);

    delete user.user_roles;

    return {
      ...user,
      roles,
    };
  });

  return users;
}

async function getUserById(id) {
  const result = await User.findByPk(id, {
    include: [
      {
        model: UserRoles,
        include: [{ model: Role, attributes: ["id", "name", "key"] }],
        attributes: ["id"],
      },
    ],
    attributes: ["id", "firstname", "lastname", "username", "createdAt"],
  });

  const user = result.dataValues;
  const roles = user.user_roles.map((user_role) => user_role.role.key);
  delete user.user_roles;
  const users = { ...user, roles };
  return users;
}

async function createUser(user) {
  const fined = await User.findOne({
    where: { username: user.username },
  });
  if (fined !== null) return "Duplicate username";

  user.password = await hash(user.password);
  const res = await User.create(user);

  let userRolesData = [];
  user.roles.forEach((roleId) => {
    userRolesData.push({ userId: res.id, roleId });
  });

  await UserRoles.bulkCreate(userRolesData);

  return res;
}

async function updateUser(user) {
  if (user.password) user.password = await hash(user.password);

  if (user.roles) {
    await UserRoles.destroy({
      where: { userId: user.id },
    });

    let userRolesData = [];
    user.roles.forEach((roleId) => {
      userRolesData.push({ userId: user.id, roleId });
    });
    await UserRoles.bulkCreate(userRolesData);
  }

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
  deleteUser,
};
