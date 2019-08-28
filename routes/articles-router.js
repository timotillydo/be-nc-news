const articlesRouter = require("express").Router();
const {
  getArticleById,
  patchArticleById,
  postCommentByArticleId,
  getAllCommentsByArticleId
} = require("../controllers/articles-controller");

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleById);

articlesRouter
  .route("/:article_id/comments")
  .post(postCommentByArticleId)
  .get(getAllCommentsByArticleId);

module.exports = { articlesRouter };
