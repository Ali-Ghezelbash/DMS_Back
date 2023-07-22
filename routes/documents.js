var express = require("express");
var router = express.Router();

var DocumentController = require("../controller/document.controller");
const auth = require("../middleware/auth");

router.get("/", auth, async function (req, res) {
<<<<<<< HEAD
  const query = req.query;
  console.log({ query });
  const result = await DocumentController.getAllDocument(req.user, query);
=======
  if(req.query.categoryId === "all"){
  const result = await DocumentController.getAllDocument(req.user);
>>>>>>> 375f9d6bcd9a7cfb0e3dc545e1dc2d806317bcb7
  res.send(result);
  }
  else {
    const result = await DocumentController.filterByCategory(req.query.categoryId);
    res.send(result);
  }
});

router.get("/:id", auth, async function (req, res) {
  const result = await DocumentController.getDocumentById(req.params.id);
  res.send(result);
});

router.post("/", auth, async function (req, res) {
  const result = await DocumentController.createDocument(req.body, req.user);
  res.send(result);
});

router.put("/", auth, async function (req, res) {
  const result = await DocumentController.updateDocument(req.body, req.user);
  res.send(result);
});

router.delete("/:id", auth, async function (req, res) {
  const result = await DocumentController.deleteDocument(
    req.params.id,
    req.user
  );
  res.send({ result: result ? true : false });
});

router.get("filter/:categoryId", auth, async function (req, res) {
  const result = await DocumentController.filterByCategory(req.params.categoryId);
  res.send(result);
});

module.exports = router;
