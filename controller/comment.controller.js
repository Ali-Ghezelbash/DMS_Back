var Comment = require("../models/comment.model");

async function getAllComment() {
  return await Comment.findAll();
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
