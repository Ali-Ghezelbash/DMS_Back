var express = require("express");
var router = express.Router();
var Category = require("../controller/category.controller");
const auth = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");

router.get("/", [auth, isAdmin], async function (req, res) {
  const result = await Category.getAllCategory();
  res.send(result);
});

router.get("/:id", [auth, isAdmin], async function (req, res) {
  const result = await Category.getCategoryById(req.params.id);
  res.send(result);
});

router.post("/", [auth, isAdmin], async function (req, res) {
  const result = await Category.createCategory(req.body);
  res.send(result);
});

router.put("/", [auth, isAdmin], async function (req, res) {
  const result = await Category.updateCategory(req.body);
  res.send(result);
});

router.delete("/:id", [auth, isAdmin], async function (req, res) {
  const result = await Category.deleteCategory(req.params.id);
  res.send({ result: result ? true : false });
});
module.exports = router;
