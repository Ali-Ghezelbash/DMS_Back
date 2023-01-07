var express = require("express");
var router = express.Router();

var book = require("../controller/user.controller");

/* GET home page. */
router.get("/", function (req, res, next) {
  book.create();
  res.send("test");
});

module.exports = router;
