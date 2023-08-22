var Document = require("../models/document.model");
var Role = require("../models/role.model");
var Log = require("../models/log.model");
var DocumentRoles = require("../models/document_roles.model");
const { Op } = require("sequelize");
const User = require("../models/user.model");
const Category = require("../models/category.model");

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
            attributes: ["id", "name", "key"],
          },
        ],
        attributes: ["id"],
      },
      { model: User, attributes: ["id", "username"] },
      { model: Category, attributes: ["id", "name"] },
    ],
    attributes: [
      "id",
      "title",
      "description",
      "userId",
      "version",
      "active",
      "categoryId",
      "document_key",
      "createdAt",
      "file",
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
      "userId",
      "version",
      "active",
      "categoryId",
      "document_key",
    ],
  });
  if (result) {
    const document = result.dataValues;
    const roles = document.document_roles.map(
      (document_role) => document_role.role.id
    );
    delete document.document_roles;
    const documents = { ...document, roles };
    return documents;
  } else return "not found";
}

async function createDocument(document, user) {
  const res = await Document.create({ ...document, userId: user.id });
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

async function filter(categoryId, userId) {
  if (!userId) {
    const previousDoc = await Document.findAll({
      where: { categoryId },
    });
    return previousDoc;
  } else if (!categoryId) {
    const previousDoc = await Document.findAll({
      where: { userId },
    });
    return previousDoc;
  } else {
    const previousDoc = await Document.findAll({
      where: { userId, categoryId },
    });
    return previousDoc;
  }
}

module.exports = {
  getAllDocument,
  getDocumentById,
  createDocument,
  updateDocument,
  deleteDocument,
  filter,
};
