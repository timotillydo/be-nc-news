const topicsRouter = require("express").Router();
const { invalidMethodHandler } = require("../errors/index");
const { getTopics } = require("../controllers/topics-controller");

topicsRouter
  .route("/")
  .get(getTopics)
  .all(invalidMethodHandler);

module.exports = { topicsRouter };
