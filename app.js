const express = require("express");
const app = express();
const apiRouter = require("./routes/api-router");
const { customErrorHandler } = require("./errors/index");

app.use("/api", apiRouter);

app.use(customErrorHandler);

app.all("/*", (req, res, next) => {
  res.status(404).send({ errMsg: "Error 404: Route Not Found" });
});

module.exports = app;
