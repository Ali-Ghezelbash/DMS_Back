var express = require("express");
var router = express.Router();
const fs = require("fs");
const path = require("path");

var Auth = require("../controller/auth.controller");

router.post("/login", async function (req, res) {
  const result = await Auth.login(req.body);
  res.send(result);
});

router.post("/upload", async function (req, res) {
  let username = req.body.username;
  let userPicture = req.files.userPicture;
  userPicture.mv("./uploads/" + userPicture.name);
  res.send(`
      Your username is: ${username}
      Uploaded image name is: ${userPicture.name}
    `);
});

router.get("/uploads/*", async function (req, res) {
  let filePath = "." + req.url;

  fs.readFile(filePath, (error, data) => {
    if (error) return;
    res.end(data, "utf8");
  });
});

module.exports = router;
