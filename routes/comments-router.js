const commentsRouter = require("express").Router();
const { invalidMethodHandler } = require("../errors/index");
const { patchCommentById } = require("../controllers/comments-controller");

commentsRouter
  .route("/:comment_id")
  .patch(patchCommentById)
  .all(invalidMethodHandler);

module.exports = { commentsRouter };
