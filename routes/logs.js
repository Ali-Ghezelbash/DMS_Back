var express = require("express");
var router = express.Router();

var Log = require("../controller/Log.controller");

router.get("/", async function (req, res) {
  const result = await Log.getAllLog();
  res.send(result);
});

router.post("/", async function (req, res) {
  const result = await Log.createLog(req.body);
  res.send(result);
});

router.put("/", async function (req, res) {
  const result = await Log.updateLog(req.body);
  res.send(result);
});

router.delete("/:id", async function (req, res) {
  const result = await Log.deleteLog(req.params.id);
  res.send({ result: result ? true : false });
});
module.exports = router;
