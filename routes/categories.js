var express = require("express");
var router = express.Router();

var Category = require("../controller/category.controller");

router.get("/", async function (req, res) {
  const result = await Category.getAllCategory();
  res.send(result);
});

router.get("/:id", async function (req, res) {
  const result = await Category.getCategoryById(req.params.id);
  res.send(result);
});

router.post("/", async function (req, res) {
  const result = await Category.createCategory(req.body);
  res.send(result);
});

router.put("/", async function (req, res) {
  const result = await Category.updateCategory(req.body);
  res.send(result);
});

router.delete("/:id", async function (req, res) {
  const result = await Category.deleteCategory(req.params.id);
  res.send({ result: result ? true : false });
});
module.exports = router;
