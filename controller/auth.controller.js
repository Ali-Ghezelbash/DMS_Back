var User = require("../models/user.model");
var Role = require("../models/role.model");
var UserRoles = require("../models/user_roles.model");
var { compare } = require("../utils/hash");
const jwt = require("jsonwebtoken");

async function login(user) {
  const fined = await User.findOne({
    where: { username: user.username },

    include: [
      {
        model: UserRoles,
        include: [{ model: Role, attributes: ["id", "name", "isAdmin"] }],
        attributes: ["id"],
      },
    ],
  });

  if (!fined) return { error: true, message: "invalid username or password" };

  const { dataValues } = fined;

  const validPassword = await compare(user.password, dataValues.password);

  if (!validPassword)
    return { error: true, message: "invalid username or password" };

  let roles = [];
  let isAdmin = false;
  dataValues.user_roles.forEach((user_role) => {
    if (user_role.role.isAdmin) {
      isAdmin = true;
    }
    roles.push(user_role.role.id);
  });

  const token = jwt.sign(
    { id: dataValues.id, roles, isAdmin },
    process.env.TOKEN_KEY,
    {
      expiresIn: "2d",
    }
  );

  return { token };
}

async function shareDocument(link, expireTime) {
  const token = jwt.sign(
    { link: link},
    process.env.TOKEN_KEY,
    {
      expiresIn: expireTime,
    }
  );
}

module.exports = { login };
