const topicsRouter = require("express").Router();
const { invalidMethodHandler } = require("../errors/index");
const { getTopics, postTopic } = require("../controllers/topics-controller");

topicsRouter
  .route("/")
  .get(getTopics)
  .post(postTopic)
  .all(invalidMethodHandler);

module.exports = { topicsRouter };
