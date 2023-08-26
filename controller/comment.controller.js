var Comment = require("../models/comment.model");
const User = require("../models/user.model");

async function getAllComment(filter) {
  const result = await Comment.findAll({
    where: {
      ...filter,
    },
    include: [
      { model: User, attributes: ["id", "username", "firstname", "lastname"] },
    ],
  });

  return result;
}

async function createComment(comment) {
  return await Comment.create(comment);
}

async function updateComment(comment) {
  return await Comment.update(comment, {
    where: { id: comment.id },
  });
}

async function deleteComment(id) {
  return await Comment.destroy({
    where: { id },
  });
}

module.exports = {
  getAllComment,
  createComment,
  updateComment,
  deleteComment,
};
