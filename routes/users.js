var express = require("express");
var router = express.Router();

var UserController = require("../controller/user.controller");
const auth = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");

router.get("/", [auth, isAdmin], async function (req, res) {
  const result = await UserController.getAllUser();
  res.send(result);
});

router.get("/info", auth, async function (req, res) {
  const result = await UserController.getUserById(req.user.id);
  res.send(result);
});

router.post("/", auth, async function (req, res) {
  if (req.user?.isAdmin) {
    const result = await UserController.createUser(req.body);
    res.send(result);
  } else {
    res.status(403).send({ message: "permission denied" });
  }
});

router.put("/", auth, async function (req, res) {
  if (req.user.isAdmin) {
    const result = await UserController.updateUser(req.body);
    res.send(result);
  } else {
    res.status(403).send({ message: "permission denied" });
  }
});

router.delete("/:id", auth, async function (req, res) {
  if (req.user.isAdmin) {
    const result = await UserController.deleteUser(req.params.id);
    res.send(req.params.id);
  } else {
    res.status(403).send({ message: "permission denied" });
  }
});
module.exports = router;
