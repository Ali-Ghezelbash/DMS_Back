var express = require("express");
var router = express.Router();

var Auth = require("../controller/auth.controller");

router.post("/login", async function (req, res) {
  const result = await Auth.login(req.body);
  res.send(result);
});

module.exports = router;
