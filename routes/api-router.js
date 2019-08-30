const apiRouter = require("express").Router();
const { invalidMethodHandler } = require("../errors/index");
const { getApiEndpoints } = require("../controllers/api-controller");
const { topicsRouter } = require("./topics-router");
const { usersRouter } = require("./users-router");
const { articlesRouter } = require("./articles-router");
const { commentsRouter } = require("./comments-router");

apiRouter
  .route("/")
  .get(getApiEndpoints)
  .all(invalidMethodHandler);
apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);

module.exports = apiRouter;
