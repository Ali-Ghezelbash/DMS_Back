var Document = require("../models/document.model");
var Role = require("../models/role.model");
var Log = require("../models/log.model");
var DocumentRoles = require("../models/document_roles.model");
const { Op, Sequelize } = require("sequelize");
const User = require("../models/user.model");
const Category = require("../models/category.model");
var Auth = require("../controller/auth.controller");

async function getAllDocument(user, filter) {
  const result = await Document.findAll({
    where: {
      ...filter,
      [Op.in]: Sequelize.literal(
        "`document`.`version` = (SELECT max(version) FROM documents t2 WHERE t2.documentKey = `document`.`documentKey`)"
      ),
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
  });
  return result;
}

async function getAllVersionDocument(user, documentKey) {
  const result = await Document.findAll({
    where: {
      documentKey: documentKey,
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
            attributes: [],
          },
        ],
        attributes: [],
      },
    ],
    attributes: ["version", "id"],
  });
  let versions = new Array();
  result.forEach((i, index) => (versions[index] = i.dataValues));
  return versions;
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

async function getDocumentBytoken(id, body) {
  console.log(body)
  const result = await Auth.shareDocument(id, body.expireTime, body.filename);
  return result
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

  // const newLog = {
  //   to_doc: JSON.stringify(document),
  //   users_id: user.id,
  //   doc_id: res.id,
  // };
  // await Log.create(newLog);

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

  // const newLog = {
  //   from_doc: JSON.stringify(previousDoc.dataValues),
  //   to_doc: JSON.stringify(document),
  //   users_id: user.id,
  //   doc_id: document.id,
  // };
  // await Log.create(newLog);

  return res;
}

async function deleteDocument(id, user) {
  const previousDoc = await Document.findOne({ where: { id: id } });
  const res = await Document.destroy({
    where: { id },
  });

  // const newLog = {
  //   from_doc: JSON.stringify(previousDoc),
  //   users_id: user.id,
  //   doc_id: id,
  // };
  // await Log.create(newLog);

  return res;
}

module.exports = {
  getAllDocument,
  getAllVersionDocument,
  getDocumentById,
  getDocumentBytoken,
  createDocument,
  updateDocument,
  deleteDocument,
};
