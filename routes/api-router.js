const apiRouter = require("express").Router();
const { invalidMethodHandler } = require("../errors/index");
const { topicsRouter } = require("./topics-router");
const { usersRouter } = require("./users-router");
const { articlesRouter } = require("./articles-router");

apiRouter.route("/").all(invalidMethodHandler);
apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/articles", articlesRouter);

module.exports = apiRouter;
