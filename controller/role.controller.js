var Role = require("../models/role.model");

async function getAllRole() {
  return await Role.findAll();
}

async function createRole(role) {
  return await Role.create(role);
}

async function updateRole(role) {
  return await Role.update(role, {
    where: { id: role.id },
  });
}

async function deleteRole(id) {
  return await Role.destroy({
    where: { id },
  });
}

module.exports = {
  getAllRole,
  createRole,
  updateRole,
  deleteRole,
};
