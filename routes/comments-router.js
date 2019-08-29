const commentsRouter = require("express").Router();
const { invalidMethodHandler } = require("../errors/index");
const {
  patchCommentById,
  deleteCommentById
} = require("../controllers/comments-controller");

commentsRouter
  .route("/:comment_id")
  .patch(patchCommentById)
  .delete(deleteCommentById)
  .all(invalidMethodHandler);

module.exports = { commentsRouter };
