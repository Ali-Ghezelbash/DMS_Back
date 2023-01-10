var Document = require("../models/document.model");
var Role = require("../models/role.model");
var Log = require("../models/log.model");
var DocumentRoles = require("../models/document_roles.model");
const UserRoles = require("../models/user_roles.model");
const { Op } = require("sequelize");

async function getAllDocument(user) {
  const result = await Document.findAll({
    where: {
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
            attributes: ["id", "name", "key"],
          },
        ],
        attributes: ["id"],
      },
    ],
    attributes: [
      "id",
      "title",
      "description",
      "user_id",
      "version",
      "active",
      "category_id",
      "document_key",
    ],
  });

  return result;

  // const userRole = await UserRoles.findAll({
  //   where: {
  //     user_id: user.id,
  //   },
  // });
  // let userRolesData = [];
  // userRole.forEach((userRoles) => {
  //   userRolesData.push(userRoles.roleId);
  // });
  // console.log(userRolesData);

  // const res = await DocumentRoles.findAll({
  //   where: {
  //     roleId: 2,
  //   },
  // });
  // let documentRolesData = [];
  // res.forEach((documentRoles) => {
  //   documentRolesData.push(documentRoles.documentId);
  // });
  // console.log(documentRolesData);
  // return await Document.findAll({
  //   where: {
  //     id: documentRolesData,
  //   },
  // });
}

async function getDocumentById(id) {
  const result = await Document.findByPk(id, {
    include: [
      {
        model: DocumentRoles,
        include: [{ model: Role, attributes: ["id", "name", "key"] }],
        attributes: ["id"],
      },
    ],
    attributes: [
      "id",
      "title",
      "description",
      "user_id",
      "version",
      "active",
      "category_id",
      "document_key",
    ],
  });

  const document = result.dataValues;
  const roles = document.document_roles.map(
    (document_role) => document_role.role.id
  );
  delete document.document_roles;
  const documents = { ...document, roles };
  return documents;
}

async function createDocument(document, user) {
  const res = await Document.create(document);
  let documentRolesData = [];
  document.roles.forEach((roleId) => {
    documentRolesData.push({ documentId: res.id, roleId });
  });
  await DocumentRoles.bulkCreate(documentRolesData);

  const newLog = {
    to_doc: JSON.stringify(document),
    users_id: user.id,
    doc_id: res.id,
  };
  const log = await Log.create(newLog);

  return res;
}

async function updateDocument(document, user) {
  const previousDoc = await Document.findOne({ where: { id: document.id } });

  if (document.roles) {
    await DocumentRoles.destroy({
      where: { documentId: document.id },
    });
    let documentRolesData = [];
    document.roles.forEach((roleId) => {
      documentRolesData.push({ documentId: document.id, roleId });
    });
    await DocumentRoles.bulkCreate(documentRolesData);
  }
  const res = await Document.update(document, {
    where: { id: document.id },
  });

  const newLog = {
    from_doc: JSON.stringify(previousDoc.dataValues),
    to_doc: JSON.stringify(document),
    users_id: user.id,
    doc_id: document.id,
  };
  const log = await Log.create(newLog);

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
  const log = await Log.create(newLog);

  return res;
}

module.exports = {
  getAllDocument,
  getDocumentById,
  createDocument,
  updateDocument,
  deleteDocument,
};
