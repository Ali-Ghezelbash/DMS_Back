const express = require("express");
require("dotenv").config();
var cors = require("cors");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var authRouter = require("./routes/auth");
var roleRouter = require("./routes/roles");
var categoryRouter = require("./routes/categories");
var documentRouter = require("./routes/documents");
var CommentRouter = require("./routes/comments");
var LogRouter = require("./routes/logs");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/", indexRouter);
app.use("/api/users", usersRouter);
app.use("/api/roles", roleRouter);
app.use("/api/auth", authRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/documents", documentRouter);
app.use("/api/comments", CommentRouter);
app.use("/api/logs", LogRouter);

const port = 3000;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
