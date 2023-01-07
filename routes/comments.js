var express = require("express");
var router = express.Router();

var Comment = require("../controller/comment.controller");

router.get("/", async function (req, res) {
  const result = await Comment.getAllComment();
  res.send(result);
});

router.post("/", async function (req, res) {
  const result = await Comment.createComment(req.body);
  res.send(result);
});

router.put("/", async function (req, res) {
  const result = await Comment.updateComment(req.body);
  res.send(result);
});

router.delete("/:id", async function (req, res) {
  const result = await Comment.deleteComment(req.params.id);

  res.send({ result: result ? true : false });
});
module.exports = router;
