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

router.post("/", [auth, isAdmin], async function (req, res) {
  const result = await UserController.createUser(req.body);
  res.send(result);
});

router.put("/", [auth, isAdmin], async function (req, res) {
  const result = await UserController.updateUser(req.body);
  res.send(result);
});

router.put("/changePassword", [auth, isAdmin], async function (req, res) {
  const result = await UserController.updateUser(req.body);
  res.send(result);
});

router.delete("/:id", [auth, isAdmin], async function (req, res) {
  const result = await UserController.deleteUser(req.params.id);
  res.send(req.params.id);
});
module.exports = router;
