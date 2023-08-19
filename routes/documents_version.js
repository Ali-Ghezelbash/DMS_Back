var express = require("express");
var router = express.Router();

var Document_versionController = require("../controller/document_version.controller");
const auth = require("../middleware/auth");

router.get("/", auth, async function (req, res) {
  const result = await Document_versionController.getAllDocument_version(req.user, req.query);
  res.send(result);

  // else {
  //   const result = await DocumentController.filter(
  //     req.query.category_id,
  //     req.query.user_id
  //   );
  //   res.send(result);
  // }
});

router.get("/:id", auth, async function (req, res) {
  const result = await Document_versionController.getDocument_versionById(req.params.id);
  res.send(result);
});

router.post("/", auth, async function (req, res) {
  let file = req.files.file;

  let fileName = new Date().getTime() + "-" + file.name;

  file.mv("./uploads/" + fileName);

  req.body.file = fileName;

  req.body.roles = JSON.parse(req.body.roles);

  const result = await Document_versionController.createDocument_version(req.body, req.user);
  res.send(result);
});

router.put("/", auth, async function (req, res) {
  console.log("req.body", req.body)
  let file = req.files?.file;
  if (file) {
    let fileName = new Date().getTime() + "-" + file.name;
    file.mv("./uploads/" + fileName);
    req.body.file = fileName;
  } else {
    req.body.file = req.body.fileName;
  }

  req.body.roles = JSON.parse(req.body.roles);

  const result = await Document_versionController.updateDocument_version(req.body, req.user);
  res.send(result);
});

router.delete("/:id", auth, async function (req, res) {
  const result = await Document_versionController.deleteDocument_version(
    req.params.id,
    req.user
  );
  res.send({ result: result ? true : false });
});

module.exports = router;
