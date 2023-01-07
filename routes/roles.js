var express = require("express");
var router = express.Router();

var Role = require("../controller/role.controller");
const auth = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");

router.get("/", async function (req, res) {
  const result = await Role.getAllRole();
  res.send("result");
});

router.post("/", async function (req, res) {
  const result = await Role.createRole(req.body);
  res.send(result);
});

router.put("/", async function (req, res) {
  const result = await Role.updateRole(req.body);
  res.send(result);
});

router.delete("/:id", async function (req, res) {
  const result = await Role.deleteRole(req.params.id);
  res.send(req.params.id);
});
module.exports = router;
