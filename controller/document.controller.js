var Document = require("../models/document.model");
var Role = require("../models/role.model");
var Log = require("../models/log.model");
var DocumentRoles = require("../models/document_roles.model");
const { Op } = require("sequelize");
const User = require("../models/user.model");
const Category = require("../models/category.model");

/*
filter = {
  userId: number;
  categoryId: number;
}
*/

async function getAllDocument(user, filter) {
  const result = await Document.findAll({
    where: {
      ...filter,
      [Op.or]: user.roles.map((role) => ({
        "$`document_roles->role`.`id`$": role,
      })),
    },
    include: [
      {
        model: DocumentRoles,
        include: [
          {
            model: Role,
            attributes: ["id", "name"],
          },
        ],
        attributes: ["id"],
      },
      { model: User, attributes: ["id", "username"] },
      { model: Category, attributes: ["id", "name"] },
    ],
    group: ["documentKey"],
    order: [["createdAt", "ASC"]],
  });
  return result;
}

async function getDocumentById(id) {
  return await Document.findByPk(id, {
    include: [
      {
        model: DocumentRoles,
        include: [
          {
            model: Role,
            attributes: ["id", "name"],
          },
        ],
        attributes: ["id"],
      },
      { model: User, attributes: ["id", "username"] },
      { model: Category, attributes: ["id", "name"] },
    ],
  });
}

async function createDocument(document, user) {
  const res = await Document.create({ ...document, userId: user.id });

  await Document.update(
    { documentKey: document.documentKey ? document.documentKey : res.id },
    {
      where: { id: res.id },
    }
  );
  const documentRole = document.roles.map((roleId) => ({
    documentId: res.id,
    roleId,
  }));
  await DocumentRoles.bulkCreate(documentRole);

  const newLog = {
    to_doc: JSON.stringify(document),
    users_id: user.id,
    doc_id: res.id,
  };
  await Log.create(newLog);

  return res;
}

async function updateDocument(document, user) {
  const previousDoc = await Document.findOne({ where: { id: document.id } });

  await DocumentRoles.destroy({
    where: { documentId: document.id },
  });
  const documentRole = document.roles.map((roleId) => ({
    documentId: document.id,
    roleId,
  }));
  await DocumentRoles.bulkCreate(documentRole);

  const res = await Document.update(document, {
    where: { id: document.id },
  });

  const newLog = {
    from_doc: JSON.stringify(previousDoc.dataValues),
    to_doc: JSON.stringify(document),
    users_id: user.id,
    doc_id: document.id,
  };
  await Log.create(newLog);

  return res;
}

async function deleteDocument(id, user) {
  const previousDoc = await Document.findOne({ where: { id: id } });
  const res = await Document.destroy({
    where: { id },
  });

  const newLog = {
    from_doc: JSON.stringify(previousDoc),
    users_id: user.id,
    doc_id: id,
  };
  await Log.create(newLog);

  return res;
}

module.exports = {
  getAllDocument,
  getDocumentById,
  createDocument,
  updateDocument,
  deleteDocument,
};
