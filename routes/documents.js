var express = require("express");
var router = express.Router();

var DocumentController = require("../controller/document.controller");
const auth = require("../middleware/auth");

router.get("/", auth, async function (req, res) {
  if (!req.query.category_id) {
    const result = await DocumentController.getAllDocument(req.user);
    res.send(result);
  } else {
    const result = await DocumentController.filterByCategory(
      req.query.category_id
    );
    res.send(result);
  }
});

router.get("/:id", auth, async function (req, res) {
  const result = await DocumentController.getDocumentById(req.params.id);
  res.send(result);
});

router.post("/", auth, async function (req, res) {
  // const result = await DocumentController.createDocument(req.body, req.user);
  console.log("dddddddddddddddd", req.fields);
  // const file = req.files.myFile;
  // const path = __dirname + "/files/" + file.name;

  // file.mv(path, (err) => {
  //   if (err) {
  //     return res.status(500).send(err);
  //   }
  //   return res.send({ status: "success", path: path });
  // });
  res.send(true);
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
  const result = await DocumentController.filterByCategory(
    req.params.categoryId
  );
  res.send(result);
});

module.exports = router;
