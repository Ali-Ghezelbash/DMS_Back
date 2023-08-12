var express = require("express");
var router = express.Router();

var DocumentController = require("../controller/document.controller");
const auth = require("../middleware/auth");

router.get("/", auth, async function (req, res) {
  if (!req.query.category_id && !req.query.user_id) {
    const result = await DocumentController.getAllDocument(req.user);
    res.send(result);
  } else {
    const result = await DocumentController.filter(
      req.query.category_id,
      req.query.user_id
    );
    res.send(result);
  }
});

router.get("/:id", auth, async function (req, res) {
  const result = await DocumentController.getDocumentById(req.params.id);
  res.send(result);
});

router.post("/", auth, async function (req, res) {
  let file = req.files.file;

  let fileName = new Date().getTime() + "-" + file.name;

  file.mv("./uploads/" + fileName);

  req.body.file = fileName;

  req.body.roles = JSON.parse(req.body.roles);

  const result = await DocumentController.createDocument(req.body, req.user);
  res.send(result);
});

router.put("/", auth, async function (req, res) {
  let file = req.files.file;
  if (file) {
    let fileName = new Date().getTime() + "-" + file.name;
    file.mv("./uploads/" + fileName);
    req.body.file = fileName;
  } else {
    req.body.file = req.body.fileName;
  }

  req.body.roles = JSON.parse(req.body.roles);

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
  const result = await DocumentController.filterByCategory(
    req.params.categoryId
  );
  res.send(result);
});

module.exports = router;
