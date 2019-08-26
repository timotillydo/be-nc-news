const express = require("express");
const app = express();
const apiRouter = require("./routes/api-router");

app.use("/api", apiRouter);

app.all("/*", (req, res, next) => {
  res.status(404).send({ errMsg: "Error 404: Route Not Found" });
});

module.exports = app;
